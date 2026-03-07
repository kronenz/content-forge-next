import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createHash } from "crypto";
import * as schema from "../src/server/db/schema";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:54322/postgres";

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

function hash(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

async function seed() {
  console.log("Seeding database...");

  // 1. Sources
  const [rssSource] = await db
    .insert(schema.sources)
    .values({
      name: "TechCrunch AI",
      type: "rss",
      url: "https://techcrunch.com/category/artificial-intelligence/feed/",
      schedule: "0 */2 * * *",
      groupName: "Tech News",
      tags: ["AI", "tech", "startup"],
      priority: "high",
      filters: { keywords: ["AI", "LLM", "GPT"], exclude: ["광고"] },
    })
    .returning();

  const [webSource] = await db
    .insert(schema.sources)
    .values({
      name: "Hacker News Top",
      type: "web",
      url: "https://news.ycombinator.com",
      schedule: "0 */6 * * *",
      groupName: "Tech News",
      tags: ["dev", "community"],
      priority: "medium",
      config: { selector: ".titleline > a", mode: "list" },
    })
    .returning();

  const [researchSource] = await db
    .insert(schema.sources)
    .values({
      name: "AI 트렌드 리서치",
      type: "research",
      processingPrompt:
        "2024-2025 AI 에이전트 트렌드를 분석하고 핵심 인사이트를 추출하세요.",
      groupName: "Research",
      tags: ["AI agent", "trend"],
      priority: "high",
    })
    .returning();

  console.log(`  Sources: ${rssSource!.id}, ${webSource!.id}, ${researchSource!.id}`);

  // 2. Raw Contents
  const rawContentsData = [
    {
      sourceId: rssSource!.id,
      title: "OpenAI, GPT-5 발표 — 멀티모달 에이전트 시대 본격 개막",
      body: `OpenAI가 차세대 모델 GPT-5를 공개했다. 이번 모델은 텍스트, 이미지, 코드를 아우르는 진정한 멀티모달 에이전트로, 복잡한 태스크를 자율적으로 수행할 수 있다. CEO 샘 알트만은 "GPT-5는 단순한 챗봇이 아닌 디지털 동료"라며, 기업용 API 요금을 30% 인하한다고 발표했다. 업계 전문가들은 이 발표가 AI 에이전트 시장의 판도를 바꿀 것으로 전망했다.`,
      metadata: {
        author: "TechCrunch Staff",
        publishedAt: "2025-12-15T09:00:00Z",
        imageUrl: "https://example.com/gpt5.jpg",
        categories: ["AI", "OpenAI"],
      },
      hash: hash("openai-gpt5-announcement"),
    },
    {
      sourceId: rssSource!.id,
      title: "Anthropic Claude 4.5, 코딩 벤치마크에서 1위 달성",
      body: `Anthropic의 최신 모델 Claude 4.5가 SWE-bench와 HumanEval 벤치마크에서 경쟁 모델을 제치고 1위를 기록했다. 특히 복잡한 코드베이스 이해와 버그 수정 능력에서 두각을 나타냈다. Claude 4.5는 200K 컨텍스트 윈도우와 함께 에이전트 모드를 기본 지원하며, 개발자 도구 체인과의 통합이 강화되었다.`,
      metadata: {
        author: "AI Reporter",
        publishedAt: "2025-12-10T14:30:00Z",
        imageUrl: "https://example.com/claude45.jpg",
        categories: ["AI", "Anthropic"],
      },
      hash: hash("anthropic-claude-45-benchmark"),
    },
    {
      sourceId: webSource!.id,
      title: "Show HN: AI로 블로그 콘텐츠 자동 생성 파이프라인 구축기",
      body: `개인 개발자가 AI 에이전트 체인을 활용한 콘텐츠 자동 생성 시스템을 공개했다. RSS 수집 → 분석 → 초안 작성 → 편집 → 플랫폼별 포맷팅까지 전 과정을 자동화했으며, 품질 점수 기반 자동 승인 시스템도 포함되어 있다. Next.js + tRPC + BullMQ 기반으로 구축되었으며, 하루 평균 20개의 콘텐츠를 생산한다고 한다.`,
      metadata: {
        author: "hn_user_42",
        publishedAt: "2025-12-08T18:00:00Z",
        points: 342,
        comments: 127,
      },
      hash: hash("show-hn-ai-content-pipeline"),
    },
    {
      sourceId: researchSource!.id,
      title: "2025 AI Agent 생태계 현황 리포트",
      body: `AI 에이전트 시장은 2025년 기준 연간 450억 달러 규모로 성장했다. 주요 트렌드: 1) 멀티 에이전트 오케스트레이션 — 여러 전문 에이전트가 협업하여 복잡한 워크플로우를 처리. 2) 도구 사용 능력 향상 — API 호출, 파일 조작, 브라우저 자동화까지 범용 도구 활용. 3) 자율성 증가 — 인간 감독 최소화, 자체 판단으로 의사결정. 4) 수직 특화 — 마케팅, 법률, 의료 등 도메인별 전문 에이전트 급증.`,
      metadata: {
        researchQuery: "AI agent ecosystem 2025",
        sources: ["arxiv", "techcrunch", "venturebeat"],
      },
      hash: hash("ai-agent-ecosystem-2025-report"),
    },
  ];

  const rawContents = await db
    .insert(schema.rawContents)
    .values(rawContentsData)
    .returning();

  console.log(`  RawContents: ${rawContents.length} items`);

  // 3. Pipeline Runs + Steps (2 completed, 1 running, 1 pending)
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);

  // Pipeline 1: completed
  const [run1] = await db
    .insert(schema.pipelineRuns)
    .values({
      rawContentId: rawContents[0]!.id,
      status: "completed",
      startedAt: twoHoursAgo,
      completedAt: new Date(twoHoursAgo.getTime() + 45000),
    })
    .returning();

  const agentSteps = [
    { role: "analyst" as const, order: 1 },
    { role: "writer" as const, order: 2 },
    { role: "editor" as const, order: 3 },
    { role: "platform_formatter" as const, order: 4 },
  ];

  for (const step of agentSteps) {
    await db.insert(schema.pipelineSteps).values({
      pipelineRunId: run1!.id,
      agentRole: step.role,
      stepOrder: step.order,
      status: "completed",
      input: { rawContentId: rawContents[0]!.id },
      output: { summary: `${step.role} 결과 데이터` },
      metadata: {
        tokenUsage: { input: 1200 + step.order * 300, output: 800 + step.order * 200 },
        durationMs: 3000 + step.order * 1500,
      },
      startedAt: new Date(twoHoursAgo.getTime() + (step.order - 1) * 10000),
      completedAt: new Date(twoHoursAgo.getTime() + step.order * 10000),
    });
  }

  // Pipeline 2: completed
  const [run2] = await db
    .insert(schema.pipelineRuns)
    .values({
      rawContentId: rawContents[1]!.id,
      status: "completed",
      startedAt: oneHourAgo,
      completedAt: new Date(oneHourAgo.getTime() + 38000),
    })
    .returning();

  for (const step of agentSteps) {
    await db.insert(schema.pipelineSteps).values({
      pipelineRunId: run2!.id,
      agentRole: step.role,
      stepOrder: step.order,
      status: "completed",
      input: { rawContentId: rawContents[1]!.id },
      output: { summary: `${step.role} 결과 데이터` },
      metadata: {
        tokenUsage: { input: 1000 + step.order * 250, output: 700 + step.order * 180 },
        durationMs: 2500 + step.order * 1200,
      },
      startedAt: new Date(oneHourAgo.getTime() + (step.order - 1) * 9000),
      completedAt: new Date(oneHourAgo.getTime() + step.order * 9000),
    });
  }

  // Pipeline 3: running
  const [run3] = await db
    .insert(schema.pipelineRuns)
    .values({
      rawContentId: rawContents[2]!.id,
      status: "running",
      startedAt: new Date(now.getTime() - 30000),
    })
    .returning();

  await db.insert(schema.pipelineSteps).values([
    {
      pipelineRunId: run3!.id,
      agentRole: "analyst",
      stepOrder: 1,
      status: "completed",
      input: { rawContentId: rawContents[2]!.id },
      output: { summary: "분석 완료" },
      metadata: { tokenUsage: { input: 1500, output: 900 }, durationMs: 4200 },
      startedAt: new Date(now.getTime() - 30000),
      completedAt: new Date(now.getTime() - 25000),
    },
    {
      pipelineRunId: run3!.id,
      agentRole: "writer",
      stepOrder: 2,
      status: "running",
      input: { analysisReport: "분석 데이터" },
      metadata: {},
      startedAt: new Date(now.getTime() - 25000),
    },
  ]);

  // Pipeline 4: pending
  await db.insert(schema.pipelineRuns).values({
    rawContentId: rawContents[3]!.id,
    status: "pending",
  });

  console.log(`  PipelineRuns: 4 (2 completed, 1 running, 1 pending)`);

  // 4. Processed Contents (from completed pipelines)
  const [pc1] = await db
    .insert(schema.processedContents)
    .values({
      pipelineRunId: run1!.id,
      platform: "blog",
      title: "GPT-5 발표, AI 에이전트 시대의 서막",
      body: `## OpenAI GPT-5: 디지털 동료의 등장\n\nOpenAI가 GPT-5를 공개하며 AI 업계에 새로운 이정표를 세웠습니다.\n\n### 핵심 변화\n- **멀티모달 에이전트**: 텍스트, 이미지, 코드를 넘나드는 통합 처리\n- **자율 태스크 수행**: 복잡한 업무를 독립적으로 완수\n- **API 가격 30% 인하**: 기업 접근성 대폭 향상\n\n### 시장 영향\nAI 에이전트 시장의 판도가 바뀔 것이라는 전망이 지배적입니다. 특히 엔터프라이즈 시장에서 GPT-5 기반 자동화 솔루션 수요가 급증할 것으로 예상됩니다.\n\n> "GPT-5는 단순한 챗봇이 아닌 디지털 동료" — 샘 알트만, OpenAI CEO`,
      metadata: {
        seo: { keywords: ["GPT-5", "AI 에이전트", "OpenAI"], readingTime: 3 },
        tags: ["AI", "OpenAI", "GPT-5"],
      },
    })
    .returning();

  const [pc2] = await db
    .insert(schema.processedContents)
    .values({
      pipelineRunId: run1!.id,
      platform: "linkedin",
      title: "GPT-5가 바꿀 비즈니스의 미래",
      body: `🚀 OpenAI GPT-5 발표 — AI 에이전트 시대 본격 개막\n\nOpenAI가 차세대 모델을 공개했습니다. 이번 모델은 단순한 챗봇을 넘어 '디지털 동료'로 진화했습니다.\n\n핵심 포인트:\n✅ 멀티모달 에이전트 — 텍스트, 이미지, 코드 통합 처리\n✅ 자율 태스크 수행 — 복잡한 업무 독립 완수\n✅ API 가격 30% 인하 — 기업 도입 장벽 낮아짐\n\n여러분의 비즈니스에 AI 에이전트를 어떻게 활용하고 계신가요?\n\n#AI #GPT5 #OpenAI #AIAgent #디지털혁신`,
      metadata: { tags: ["AI", "GPT-5", "비즈니스"] },
    })
    .returning();

  const [pc3] = await db
    .insert(schema.processedContents)
    .values({
      pipelineRunId: run1!.id,
      platform: "twitter",
      title: null,
      body: `🤖 OpenAI GPT-5 발표!\n\n→ 멀티모달 에이전트: 텍스트+이미지+코드 통합\n→ 자율 태스크 수행 능력\n→ API 가격 30% 인하\n\n"단순한 챗봇이 아닌 디지털 동료" — 샘 알트만\n\nAI 에이전트 시대가 본격 시작됩니다.\n\n#GPT5 #AI #OpenAI`,
      metadata: { charCount: 180 },
    })
    .returning();

  const [pc4] = await db
    .insert(schema.processedContents)
    .values({
      pipelineRunId: run2!.id,
      platform: "blog",
      title: "Claude 4.5, 코딩 벤치마크 1위의 의미",
      body: `## Anthropic Claude 4.5: 개발자의 새로운 동반자\n\nAnthropic의 최신 모델이 SWE-bench와 HumanEval에서 동시 1위를 기록했습니다.\n\n### 차별점\n- **코드베이스 이해력**: 대규모 프로젝트의 맥락을 정확히 파악\n- **200K 컨텍스트**: 긴 코드 분석에 최적화\n- **에이전트 모드**: 도구 체인 통합 기본 지원\n\n### 개발자에게 미치는 영향\n코드 리뷰, 버그 수정, 리팩토링 등 실무 개발 작업에서의 활용도가 크게 높아질 것으로 보입니다.`,
      metadata: {
        seo: { keywords: ["Claude", "Anthropic", "코딩 AI"], readingTime: 2 },
        tags: ["AI", "Anthropic", "Claude"],
      },
    })
    .returning();

  console.log(`  ProcessedContents: 4 items (3 platforms for run1, 1 for run2)`);

  // 5. Reviews
  await db.insert(schema.reviews).values([
    {
      processedContentId: pc1!.id,
      pipelineRunId: run1!.id,
      status: "approved",
      reviewer: "auto",
      qualityScore: 8.5,
      accuracyScore: 9.0,
      humanLikeScore: 7.8,
      platformFitScore: 8.2,
      cultureFitScore: 8.0,
      feedback: "품질 양호. 핵심 정보가 잘 정리되어 있음.",
    },
    {
      processedContentId: pc2!.id,
      pipelineRunId: run1!.id,
      status: "approved",
      reviewer: "human",
      qualityScore: 8.0,
      accuracyScore: 8.5,
      humanLikeScore: 8.8,
      platformFitScore: 9.0,
      cultureFitScore: 8.5,
      feedback: "LinkedIn 톤앤매너에 잘 맞음. 이모지 활용도 적절.",
    },
    {
      processedContentId: pc3!.id,
      pipelineRunId: run1!.id,
      status: "revision",
      reviewer: "auto",
      qualityScore: 6.5,
      accuracyScore: 8.0,
      humanLikeScore: 5.5,
      platformFitScore: 7.0,
      cultureFitScore: 6.0,
      feedback: "트위터 특성상 더 간결해야 함. 해시태그 과다.",
    },
    {
      processedContentId: pc4!.id,
      pipelineRunId: run2!.id,
      status: "pending",
      reviewer: "human",
      qualityScore: 7.5,
      accuracyScore: 8.5,
      humanLikeScore: 7.0,
      platformFitScore: 8.0,
      cultureFitScore: 7.5,
    },
  ]);

  console.log(`  Reviews: 4 (2 approved, 1 revision, 1 pending)`);

  // 6. Publications
  await db.insert(schema.publications).values([
    {
      processedContentId: pc1!.id,
      platform: "blog",
      status: "published",
      publishedUrl: "/blog/gpt5-ai-agent-era",
      publishedAt: new Date(twoHoursAgo.getTime() + 60000),
    },
    {
      processedContentId: pc2!.id,
      platform: "linkedin",
      status: "published",
      publishedUrl: "https://linkedin.com/posts/example-123",
      publishedAt: new Date(twoHoursAgo.getTime() + 120000),
    },
    {
      processedContentId: pc4!.id,
      platform: "blog",
      status: "scheduled",
      scheduledAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // tomorrow
    },
  ]);

  console.log(`  Publications: 3 (2 published, 1 scheduled)`);

  // 7. Subscription for dev user
  await db.insert(schema.subscriptions).values({
    userId: "dev-user-00000000-0000-0000-0000-000000000000",
    planId: "pro",
    status: "active",
    currentPeriodStart: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
    currentPeriodEnd: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
  });

  console.log(`  Subscription: dev user (pro plan)`);

  console.log("\nSeed completed!");
  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
