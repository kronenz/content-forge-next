#!/usr/bin/env bun
/**
 * AI 소스 추천 기능 테스트 스크립트
 * 실행: bun run scripts/test-suggest.ts
 */

import { callBothProviders, hasApiKey } from "@/server/ai/local-cli";

type SuggestedSource = {
  name: string;
  type: string;
  url: string;
  description: string;
  tags: string[];
  groupName: string;
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
        },
        required: ["name", "type", "url", "description", "tags", "groupName"],
      },
    },
  },
  required: ["sources"],
};

async function main() {
  console.log("=== AI 소스 추천 테스트 (SDK 기반) ===\n");
  console.log(`API Key 존재: ${hasApiKey()}`);
  console.log("로컬 SDK를 사용하여 추천을 요청합니다...\n");

  const prompt = `사용자가 콘텐츠 수집 소스를 찾고 있습니다. 다음 요청에 맞는 데이터 소스를 3개 추천해주세요.

요청: AI/LLM 기술 트렌드 관련 영문 RSS 피드

각 소스에 대해:
- name: 소스의 한국어 이름
- type: "rss"
- url: 실제 접근 가능한 RSS 피드 URL
- description: 이 소스가 어떤 콘텐츠를 제공하는지 간단한 설명
- tags: 관련 태그 2~4개
- groupName: "AI 트렌드"

실제로 존재하는 유명 사이트/서비스를 우선 추천하세요. JSON schema에 맞춰 응답하세요.`;

  const start = Date.now();
  const { providers, data } = await callBothProviders<{ sources: SuggestedSource[] }>(prompt, {
    jsonSchema: SUGGEST_JSON_SCHEMA,
  });
  const elapsed = Date.now() - start;

  console.log(`Providers: ${providers.join(" + ")}`);
  console.log(`소요 시간: ${(elapsed / 1000).toFixed(1)}초`);
  console.log(`추천 소스: ${data.sources?.length ?? 0}개\n`);

  if (data.sources) {
    for (const [i, s] of data.sources.entries()) {
      console.log(`[${i + 1}] ${s.name} (${s.type})`);
      console.log(`    URL: ${s.url}`);
      console.log(`    설명: ${s.description}`);
      console.log(`    그룹: ${s.groupName} | 태그: ${s.tags.join(", ")}`);
      console.log();
    }
  }

  console.log("=== 테스트 완료 ===");
}

main().catch((err) => {
  console.error("테스트 실패:", err);
  process.exit(1);
});
