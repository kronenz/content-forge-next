import { db } from "@/lib/db";
import { sources } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { callBothProviders } from "@/server/ai/local-cli";
import { header, table, info, success, error, stepStart, stepDone, bold, cyan, dim, yellow } from "../lib/output";

type SuggestedSource = {
  name: string;
  type: "rss" | "api" | "web" | "research";
  url: string;
  description: string;
  tags: string[];
  groupName: string;
  processingPrompt: string;
};

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

export async function sourcesCommand(subArgs?: string[]) {
  const sub = subArgs?.[0];

  if (sub === "suggest") {
    const prompt = subArgs?.slice(1).filter((a) => !a.startsWith("--")).join(" ");
    if (!prompt) {
      error("Usage: forge sources suggest <프롬프트>");
      error('Example: forge sources suggest "AI 기술 트렌드 RSS 피드 10개"');
      process.exit(1);
    }
    await suggestSources(prompt);
    return;
  }

  // Default: list sources
  header("Registered Sources");

  const allSources = await db.select().from(sources).orderBy(desc(sources.createdAt));

  if (allSources.length === 0) {
    info("No sources registered yet.");
    return;
  }

  table(
    ["ID", "Name", "Type", "Active", "Schedule", "Group"],
    allSources.map((s) => [
      s.id.slice(0, 8) + "...",
      s.name,
      s.type,
      s.isActive ? "Yes" : "No",
      s.schedule ?? "-",
      s.groupName ?? "-",
    ]),
  );

  console.log(`\nTotal: ${allSources.length} sources`);
}

async function suggestSources(prompt: string) {
  header("AI Source Suggestion");
  info(`Prompt: ${prompt}`);
  console.log();

  stepStart("로컬 AI CLI로 소스 추천 요청 중");
  const start = Date.now();

  const aiPrompt = `사용자가 콘텐츠 수집 소스를 찾고 있습니다. 다음 요청에 맞는 데이터 소스를 추천해주세요.

요청: ${prompt}

각 소스에 대해:
- name: 소스의 한국어 이름
- type: "rss" (RSS 피드), "api" (API 엔드포인트), "web" (웹 스크래핑 대상), "research" (리서치 주제) 중 하나
- url: 실제 접근 가능한 URL (RSS는 피드 URL, web은 페이지 URL). 정확한 URL을 모르면 가장 합리적인 URL을 제시
- description: 이 소스가 어떤 콘텐츠를 제공하는지 간단한 설명
- tags: 관련 태그 2~4개
- groupName: 소스를 그룹으로 묶을 카테고리명
- processingPrompt: 이 소스에서 콘텐츠를 수집할 때 사용할 AI 프롬프트. 소스 특성(언어, 콘텐츠 유형, 구조)에 맞게 구체적으로 작성

실제로 존재하는 유명 사이트/서비스를 우선 추천하세요. JSON schema에 맞춰 응답하세요.`;

  const { providers, data } = await callBothProviders<{ sources: SuggestedSource[] }>(aiPrompt, {
    jsonSchema: SUGGEST_JSON_SCHEMA,
  });

  const suggestions = data.sources ?? [];
  stepDone(Date.now() - start, `${suggestions.length}개 추천 (${providers.join(" + ")})`);
  console.log();

  if (suggestions.length === 0) {
    info("추천된 소스가 없습니다.");
    return;
  }

  // Display suggestions
  for (let i = 0; i < suggestions.length; i++) {
    const s = suggestions[i]!;
    console.log(`${bold(cyan(`[${i + 1}]`))} ${bold(s.name)} ${dim(`(${s.type})`)}`);
    console.log(`    ${dim("URL:")} ${s.url}`);
    console.log(`    ${dim("설명:")} ${s.description}`);
    console.log(`    ${dim("그룹:")} ${s.groupName}  ${dim("태그:")} ${s.tags.join(", ")}`);
    console.log(`    ${dim("프롬프트:")} ${s.processingPrompt}`);
    console.log();
  }

  // Check flags for adding
  const addAll = process.argv.includes("--add-all");
  const addFlag = process.argv.find((a) => a.startsWith("--add="));

  let toAdd: SuggestedSource[];

  if (addAll) {
    toAdd = suggestions;
  } else if (addFlag) {
    const indices = addFlag
      .replace("--add=", "")
      .split(",")
      .map((s) => parseInt(s.trim(), 10) - 1)
      .filter((i) => i >= 0 && i < suggestions.length);
    toAdd = indices.map((i) => suggestions[i]!);
  } else {
    console.log(yellow("소스를 추가하려면 다음 옵션을 사용하세요:"));
    console.log(dim("  --add-all          모든 추천 소스를 추가"));
    console.log(dim('  --add=1,3,5        선택한 번호의 소스만 추가'));
    return;
  }

  if (toAdd.length === 0) {
    info("추가할 소스가 없습니다.");
    return;
  }

  stepStart(`${toAdd.length}개 소스 DB에 추가`);
  const created = await db
    .insert(sources)
    .values(
      toAdd.map((s) => ({
        name: s.name,
        type: s.type,
        url: s.url,
        groupName: s.groupName,
        tags: s.tags,
        processingPrompt: s.processingPrompt,
      })),
    )
    .returning();
  stepDone();

  for (const s of created) {
    success(`${s.name} (${s.id.slice(0, 8)}...)`);
  }
  console.log(`\n${bold(`${created.length}개 소스가 추가되었습니다.`)}`);
}
