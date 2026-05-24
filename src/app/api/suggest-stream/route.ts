import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const SUGGEST_JSON_SCHEMA = {
  type: "object" as const,
  properties: {
    sources: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          name: { type: "string" as const },
          type: { type: "string" as const, enum: ["rss", "api", "web", "research"] },
          url: { type: "string" as const },
          description: { type: "string" as const },
          tags: { type: "array" as const, items: { type: "string" as const } },
          groupName: { type: "string" as const },
          processingPrompt: { type: "string" as const },
        },
        required: ["name", "type", "url", "description", "tags", "groupName", "processingPrompt"],
      },
    },
  },
  required: ["sources"],
};

function addAdditionalPropertiesFalse(schema: Record<string, unknown>): Record<string, unknown> {
  if (schema.type === "object") {
    schema.additionalProperties = false;
    if (schema.properties && typeof schema.properties === "object") {
      for (const value of Object.values(schema.properties as Record<string, Record<string, unknown>>)) {
        if (value && typeof value === "object") {
          addAdditionalPropertiesFalse(value);
        }
      }
    }
  }
  if (schema.type === "array" && schema.items && typeof schema.items === "object") {
    addAdditionalPropertiesFalse(schema.items as Record<string, unknown>);
  }
  return schema;
}

function extractJson(text: string): unknown {
  try { return JSON.parse(text); } catch { /* continue */ }
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1]!); } catch { /* continue */ }
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch { /* continue */ }
  }
  throw new Error(`Not valid JSON: ${text.slice(0, 200)}`);
}

function jsonLine(event: string, data: unknown): string {
  return JSON.stringify({ event, ...data as Record<string, unknown> }) + "\n";
}

async function streamClaude(prompt: string, enqueue: (chunk: string) => void) {
  enqueue(jsonLine("status", { provider: "claude", status: "started" }));
  const start = Date.now();

  try {
    const { query } = await import("@anthropic-ai/claude-agent-sdk");

    const jsonPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with a valid JSON object matching the provided schema. No markdown, no explanation, no code fences. Pure JSON only.`;

    enqueue(jsonLine("progress", { provider: "claude", message: "모델 호출 중..." }));

    const stream = query({
      prompt: jsonPrompt,
      options: {
        maxTurns: 3,
        permissionMode: "dontAsk",
        outputFormat: { type: "json_schema" as const, schema: SUGGEST_JSON_SCHEMA },
        model: "sonnet",
      },
    });

    let resultText = "";

    for await (const message of stream) {
      if (message.type === "assistant") {
        enqueue(jsonLine("progress", { provider: "claude", message: "응답 생성 중..." }));
      } else if (message.type === "result") {
        if (message.subtype === "success") {
          resultText = message.result;
        } else {
          throw new Error(`Claude error: ${JSON.stringify(message)}`);
        }
      }
    }

    if (!resultText) throw new Error("No result from Claude");

    const parsed = extractJson(resultText) as { sources?: unknown[] };
    const elapsed = Date.now() - start;
    enqueue(jsonLine("result", { provider: "claude", sources: parsed.sources ?? [], elapsed }));
  } catch (err) {
    const elapsed = Date.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[suggest-stream] Claude failed: ${msg}`);
    enqueue(jsonLine("error", { provider: "claude", error: msg, elapsed }));
  }
}

async function streamCodex(prompt: string, enqueue: (chunk: string) => void) {
  enqueue(jsonLine("status", { provider: "codex", status: "started" }));
  const start = Date.now();

  try {
    const { Codex } = await import("@openai/codex-sdk");
    const codex = new Codex({
      codexPathOverride: process.env.CODEX_PATH || "codex",
    });
    const thread = codex.startThread({ sandboxMode: "read-only" });

    const schema = addAdditionalPropertiesFalse(structuredClone(SUGGEST_JSON_SCHEMA));

    enqueue(jsonLine("progress", { provider: "codex", message: "모델 호출 중..." }));

    // Try streaming first, fall back to non-streaming
    let resultText = "";

    try {
      const { events } = await thread.runStreamed(prompt, { outputSchema: schema });

      for await (const event of events) {
        if (event.type === "item.started" && event.item.type === "reasoning") {
          enqueue(jsonLine("progress", { provider: "codex", message: "추론 중..." }));
        }
        if (event.type === "item.started" && event.item.type === "agent_message") {
          enqueue(jsonLine("progress", { provider: "codex", message: "응답 생성 중..." }));
        }
        if (event.type === "item.completed" && event.item.type === "agent_message") {
          resultText = event.item.text;
        }
        if (event.type === "turn.completed") {
          enqueue(jsonLine("progress", { provider: "codex", message: "완료 처리 중..." }));
        }
      }
    } catch {
      // Fallback to non-streaming
      enqueue(jsonLine("progress", { provider: "codex", message: "비스트리밍 모드로 전환..." }));
      const turn = await thread.run(prompt, { outputSchema: schema });
      resultText = turn.finalResponse;
    }

    if (!resultText) throw new Error("No result from Codex");

    const parsed = extractJson(resultText) as { sources?: unknown[] };
    const elapsed = Date.now() - start;
    enqueue(jsonLine("result", { provider: "codex", sources: parsed.sources ?? [], elapsed }));
  } catch (err) {
    const elapsed = Date.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[suggest-stream] Codex failed: ${msg}`);
    enqueue(jsonLine("error", { provider: "codex", error: msg, elapsed }));
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userPrompt: string = body.prompt;
  const count: number = body.count ?? 10;

  if (!userPrompt) {
    return new Response("Missing prompt", { status: 400 });
  }

  const prompt = `사용자가 콘텐츠 수집 소스를 찾고 있습니다. 다음 요청에 맞는 데이터 소스를 ${count}개 추천해주세요.

요청: ${userPrompt}

각 소스에 대해:
- name: 소스의 한국어 이름
- type: "rss" (RSS 피드), "api" (API 엔드포인트), "web" (웹 스크래핑 대상), "research" (리서치 주제) 중 하나
- url: 실제 접근 가능한 URL (RSS는 피드 URL, web은 페이지 URL). 정확한 URL을 모르면 가장 합리적인 URL을 제시
- description: 이 소스가 어떤 콘텐츠를 제공하는지 간단한 설명
- tags: 관련 태그 2~4개
- groupName: 소스를 그룹으로 묶을 카테고리명
- processingPrompt: 이 소스에서 콘텐츠를 수집할 때 사용할 AI 프롬프트. 소스 특성에 맞게 구체적으로 작성

실제로 존재하는 유명 사이트/서비스를 우선 추천하세요. JSON schema에 맞춰 응답하세요.`;

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  const enqueue = (chunk: string) => {
    writer.write(encoder.encode(chunk)).catch(() => {});
  };

  // Run in background — don't await, let the stream flow
  (async () => {
    try {
      const tasks = [streamCodex(prompt, enqueue)];
      // Claude Code 세션 내부가 아닐 때만 Claude 호출
      // (중첩 세션에서 Claude Agent SDK가 JSON 대신 markdown을 반환하는 문제)
      if (!process.env.CLAUDECODE) {
        tasks.push(streamClaude(prompt, enqueue));
      } else {
        enqueue(jsonLine("error", { provider: "claude", error: "Claude Code 세션 내부 — Codex만 사용", elapsed: 0 }));
      }
      await Promise.allSettled(tasks);
      enqueue(jsonLine("done", {}));
    } finally {
      writer.close().catch(() => {});
    }
  })();

  return new Response(readable, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
