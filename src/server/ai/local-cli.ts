/**
 * Local AI CLI Backend
 *
 * 로컬에 설치된 claude/codex SDK를 활용한 AI 호출 모듈.
 * - 로컬 개발: API 키 없이 로컬 인증으로 AI 호출 (Claude Agent SDK / Codex SDK)
 * - 프로덕션: AI SDK (Anthropic/OpenAI API) 사용
 *
 * 우선순위: API Key → Claude Agent SDK → Codex SDK
 */

export type CliProvider = "claude" | "codex";

export interface LocalCliOptions {
  /** 사용할 provider (미지정 시 자동 감지) */
  provider?: CliProvider;
  /** claude 모델 (기본: sonnet) */
  claudeModel?: string;
  /** codex 모델 */
  codexModel?: string;
  /** JSON Schema for structured output */
  jsonSchema?: Record<string, unknown>;
  /** 타임아웃 ms (기본: 120초) */
  timeoutMs?: number;
}

interface CliResult {
  provider: CliProvider;
  raw: string;
  parsed: unknown;
}

/** JSON 추출 헬퍼: 순수 JSON, 코드펜스 감싼 JSON, 텍스트 속 JSON 객체 순으로 시도 */
function extractJson(text: string, provider: string): unknown {
  // 1) 순수 JSON
  try {
    return JSON.parse(text);
  } catch {
    // continue
  }
  // 2) ```json ... ``` 코드펜스
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1]!);
    } catch {
      // continue
    }
  }
  // 3) 텍스트 속 JSON 객체
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // continue
    }
  }
  throw new Error(`${provider} output is not valid JSON: ${text.slice(0, 300)}`);
}

async function callClaude(
  prompt: string,
  options: LocalCliOptions,
): Promise<CliResult> {
  const { query } = await import("@anthropic-ai/claude-agent-sdk");

  const outputFormat = options.jsonSchema
    ? { type: "json_schema" as const, schema: options.jsonSchema }
    : undefined;

  // Claude Agent SDK의 outputFormat이 불안정할 수 있으므로 프롬프트에도 JSON 지시 추가
  const jsonPrompt = options.jsonSchema
    ? `${prompt}\n\nIMPORTANT: Respond ONLY with a valid JSON object matching the provided schema. No markdown, no explanation, no code fences. Pure JSON only.`
    : prompt;

  let resultText = "";

  const stream = query({
    prompt: jsonPrompt,
    options: {
      maxTurns: 3,
      permissionMode: "dontAsk",
      outputFormat,
      model: options.claudeModel ?? "sonnet",
    },
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 120_000);

  try {
    for await (const message of stream) {
      if (message.type === "result") {
        if (message.subtype === "success") {
          resultText = message.result;
        } else {
          throw new Error(`Claude Agent SDK error: ${JSON.stringify(message)}`);
        }
      }
    }
  } finally {
    clearTimeout(timeout);
  }

  if (!resultText) {
    throw new Error("Claude Agent SDK returned no result. The model may not support outputFormat with json_schema in this configuration.");
  }

  const parsed = extractJson(resultText, "Claude");

  return { provider: "claude", raw: resultText, parsed };
}

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

async function callCodex(
  prompt: string,
  options: LocalCliOptions,
): Promise<CliResult> {
  const { Codex } = await import("@openai/codex-sdk");

  const codex = new Codex({
    codexPathOverride: process.env.CODEX_PATH || "codex",
  });
  const thread = codex.startThread({
    model: options.codexModel,
  });

  // OpenAI requires additionalProperties: false on all objects in the schema
  const schema = options.jsonSchema
    ? addAdditionalPropertiesFalse(structuredClone(options.jsonSchema))
    : undefined;

  const turn = await thread.run(prompt, {
    outputSchema: schema,
  });

  const resultText = turn.finalResponse;

  const parsed = extractJson(resultText, "Codex");

  return { provider: "codex", raw: resultText, parsed };
}

async function detectProvider(): Promise<CliProvider> {
  // Claude Code 세션 내부에서는 Claude Agent SDK가 서브프로세스 충돌하므로 Codex 우선
  const insideClaudeCode = !!process.env.CLAUDECODE;

  if (!insideClaudeCode) {
    try {
      await import("@anthropic-ai/claude-agent-sdk");
      return "claude";
    } catch {
      // fallthrough
    }
  }

  try {
    await import("@openai/codex-sdk");
    return "codex";
  } catch {
    // fallthrough
  }

  // Claude Code 세션 내부여도 SDK가 없으면 마지막으로 claude 시도
  if (insideClaudeCode) {
    try {
      await import("@anthropic-ai/claude-agent-sdk");
      return "claude";
    } catch {
      // fallthrough
    }
  }

  throw new Error(
    "No AI SDK found. Install @anthropic-ai/claude-agent-sdk or @openai/codex-sdk.",
  );
}

/**
 * 로컬 SDK를 통해 AI 호출 (구조화된 JSON 응답)
 */
export async function callLocalCli<T = unknown>(
  prompt: string,
  options: LocalCliOptions = {},
): Promise<{ provider: CliProvider; data: T }> {
  const explicitProvider = !!options.provider;
  const provider = options.provider ?? await detectProvider();

  let result: CliResult;
  if (provider === "claude") {
    try {
      result = await callClaude(prompt, options);
    } catch (err) {
      // provider가 명시적으로 지정된 경우 폴백하지 않음
      if (explicitProvider) throw err;
      console.warn(`[local-cli] Claude SDK failed, falling back to Codex: ${err instanceof Error ? err.message : err}`);
      result = await callCodex(prompt, options);
    }
  } else {
    result = await callCodex(prompt, options);
  }

  return { provider: result.provider, data: result.parsed as T };
}

/**
 * 두 provider를 병렬 호출하고 결과를 합침 (URL 기반 중복 제거)
 */
export async function callBothProviders<T extends { sources: Array<{ url: string; [k: string]: unknown }> }>(
  prompt: string,
  options: LocalCliOptions = {},
): Promise<{ providers: CliProvider[]; data: T }> {
  const results = await Promise.allSettled([
    callClaude(prompt, options).catch((err) => {
      console.warn(`[local-cli] Claude SDK failed: ${err instanceof Error ? err.message : err}`);
      throw err;
    }),
    callCodex(prompt, options).catch((err) => {
      console.warn(`[local-cli] Codex SDK failed: ${err instanceof Error ? err.message : err}`);
      throw err;
    }),
  ]);

  const succeeded: CliResult[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") succeeded.push(r.value);
  }

  if (succeeded.length === 0) {
    throw new Error("Both Claude and Codex SDKs failed. Check logs for details.");
  }

  // Merge sources arrays, deduplicate by URL
  const providers = succeeded.map((r) => r.provider);
  const seen = new Set<string>();
  const merged: Array<{ url: string; [k: string]: unknown }> = [];

  for (const result of succeeded) {
    const parsed = result.parsed as T;
    const items = parsed?.sources ?? [];
    for (const item of items) {
      const key = item.url?.toLowerCase().replace(/\/+$/, "");
      if (key && !seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }
  }

  return { providers, data: { sources: merged } as T };
}

/**
 * API 키 존재 여부
 */
export function hasApiKey(): boolean {
  return !!(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY);
}

/**
 * 범용 AI 호출 함수
 * API 키 유무에 따라 자동으로 AI SDK 또는 로컬 SDK 선택
 */
export async function callAi<T = unknown>(
  prompt: string,
  options: LocalCliOptions & {
    /** AI SDK 사용 시 호출할 함수 */
    apiFn?: () => Promise<T>;
  } = {},
): Promise<T> {
  if (options.apiFn && hasApiKey()) {
    return options.apiFn();
  }
  const { data } = await callLocalCli<T>(prompt, options);
  return data;
}
