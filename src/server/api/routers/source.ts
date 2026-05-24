import { z } from "zod/v4";
import { eq, ilike, isNotNull, desc, SQL } from "drizzle-orm";
import { generateText, Output } from "ai";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { sources, rawContents } from "@/server/db/schema";
import { addCollectJob, registerSchedule, removeSchedule } from "@/server/queue/collect-queue";
import { callLocalCli, callBothProviders, hasApiKey, type CliProvider } from "@/server/ai/local-cli";

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

const suggestedSourceSchema = z.object({
  name: z.string(),
  type: z.enum(["rss", "api", "web", "research"]),
  url: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  groupName: z.string(),
  processingPrompt: z.string(),
});

async function suggestSources(
  prompt: string,
  provider?: CliProvider,
): Promise<{ sources: SuggestedSource[]; provider: string; error?: string }> {
  // 프로덕션: API 키로 AI SDK 사용
  if (hasApiKey()) {
    const { getModel } = await import("@/server/agents/model");
    const result = await generateText({
      model: getModel(),
      output: Output.array({ element: suggestedSourceSchema }),
      prompt,
    });
    return { sources: (result.output ?? []) as SuggestedSource[], provider: "api" };
  }

  // 특정 provider 지정 시 해당 provider만 호출
  if (provider) {
    try {
      const { data } = await callLocalCli<{ sources: SuggestedSource[] }>(prompt, {
        jsonSchema: SUGGEST_JSON_SCHEMA,
        provider,
      });
      return { sources: data.sources ?? [], provider };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[suggest] ${provider} failed: ${msg}`);
      return { sources: [], provider, error: msg };
    }
  }

  // 로컬: Claude + Codex 병렬 호출, 결과 합침
  const { providers, data } = await callBothProviders<{ sources: SuggestedSource[] }>(prompt, {
    jsonSchema: SUGGEST_JSON_SCHEMA,
  });
  return { sources: data.sources ?? [], provider: providers.join("+") };
}

const priorityEnum = z.enum(["low", "medium", "high", "critical"]);
const sourceTypeEnum = z.enum(["rss", "api", "web", "research"]);
const filtersSchema = z.object({
  keywords: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
});

export const sourceRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        type: sourceTypeEnum.nullish(),
        groupName: z.string().nullish(),
        isActive: z.number().min(0).max(1).nullish(),
        search: z.string().nullish(),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const conditions: SQL[] = [];
      if (input?.type) conditions.push(eq(sources.type, input.type));
      if (input?.groupName) conditions.push(eq(sources.groupName, input.groupName));
      if (input?.isActive != null) conditions.push(eq(sources.isActive, input.isActive));
      if (input?.search) conditions.push(ilike(sources.name, `%${input.search}%`));

      return ctx.db.query.sources.findMany({
        where: conditions.length > 0 ? (_, { and }) => and(...conditions) : undefined,
        orderBy: (sources, { desc }) => [desc(sources.createdAt)],
      });
    }),

  byId: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.sources.findFirst({
        where: eq(sources.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: sourceTypeEnum,
        url: z.string().optional(),
        config: z.record(z.string(), z.unknown()).optional(),
        schedule: z.string().optional(),
        processingPrompt: z.string().optional(),
        groupName: z.string().optional(),
        tags: z.array(z.string()).optional(),
        priority: priorityEnum.optional(),
        filters: filtersSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [source] = await ctx.db.insert(sources).values(input).returning();
      return source;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
        name: z.string().min(1).optional(),
        url: z.string().optional(),
        config: z.record(z.string(), z.unknown()).optional(),
        schedule: z.string().optional(),
        processingPrompt: z.string().optional(),
        groupName: z.string().optional(),
        isActive: z.number().min(0).max(1).optional(),
        tags: z.array(z.string()).optional(),
        priority: priorityEnum.optional(),
        filters: filtersSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [source] = await ctx.db
        .update(sources)
        .set(data)
        .where(eq(sources.id, id))
        .returning();
      return source;
    }),

  toggleActive: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.sources.findFirst({
        where: eq(sources.id, input.id),
      });
      if (!existing) throw new Error("Source not found");
      const [source] = await ctx.db
        .update(sources)
        .set({ isActive: existing.isActive === 1 ? 0 : 1 })
        .where(eq(sources.id, input.id))
        .returning();
      return source;
    }),

  listGroups: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .selectDistinct({ groupName: sources.groupName })
      .from(sources)
      .where(isNotNull(sources.groupName))
      .orderBy(sources.groupName);
    return rows.map((r) => r.groupName as string);
  }),

  renameGroup: protectedProcedure
    .input(z.object({ oldName: z.string().min(1), newName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db
        .update(sources)
        .set({ groupName: input.newName })
        .where(eq(sources.groupName, input.oldName))
        .returning();
      return { count: updated.length };
    }),

  deleteGroup: protectedProcedure
    .input(z.object({ groupName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db
        .update(sources)
        .set({ groupName: null })
        .where(eq(sources.groupName, input.groupName))
        .returning();
      return { count: updated.length };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      await removeSchedule(input.id);
      await ctx.db.delete(sources).where(eq(sources.id, input.id));
      return { success: true };
    }),

  collect: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ input }) => {
      const jobId = await addCollectJob(input.id, "manual");
      return { jobId };
    }),

  syncSchedules: protectedProcedure.mutation(async ({ ctx }) => {
    const activeSources = await ctx.db.query.sources.findMany({
      where: eq(sources.isActive, 1),
    });
    let registered = 0;
    for (const source of activeSources) {
      if (source.schedule) {
        await registerSchedule(source.id, source.schedule);
        registered++;
      }
    }
    return { registered };
  }),

  rawContents: publicProcedure
    .input(
      z.object({
        sourceId: z.uuid(),
        limit: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.rawContents.findMany({
        where: eq(rawContents.sourceId, input.sourceId),
        orderBy: [desc(rawContents.collectedAt)],
        limit: input.limit,
      });
    }),

  suggest: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1).max(500),
        count: z.number().min(1).max(20).default(10),
        provider: z.enum(["claude", "codex"]).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const prompt = `사용자가 콘텐츠 수집 소스를 찾고 있습니다. 다음 요청에 맞는 데이터 소스를 ${input.count}개 추천해주세요.

요청: ${input.prompt}

각 소스에 대해:
- name: 소스의 한국어 이름
- type: "rss" (RSS 피드), "api" (API 엔드포인트), "web" (웹 스크래핑 대상), "research" (리서치 주제) 중 하나
- url: 실제 접근 가능한 URL (RSS는 피드 URL, web은 페이지 URL). 정확한 URL을 모르면 가장 합리적인 URL을 제시
- description: 이 소스가 어떤 콘텐츠를 제공하는지 간단한 설명
- tags: 관련 태그 2~4개
- groupName: 소스를 그룹으로 묶을 카테고리명
- processingPrompt: 이 소스에서 콘텐츠를 수집/스크랩할 때 사용할 AI 프롬프트. 소스 타입에 맞게 작성:
  - RSS: "피드에서 제목, 요약, 링크, 발행일을 추출하고 핵심 키워드를 태깅하세요"
  - Web: "페이지에서 본문 텍스트, 제목, 작성자, 날짜를 추출하고 CSS 셀렉터 기반으로 구조화하세요"
  - API: "API 응답에서 주요 데이터 필드를 매핑하고 변환 규칙을 적용하세요"
  - Research: "주제에 대한 최신 논문/기사를 검색하고 핵심 인사이트를 요약하세요"
  각 소스의 특성(언어, 콘텐츠 유형, 구조)에 맞게 구체적으로 작성하세요.

실제로 존재하는 유명 사이트/서비스를 우선 추천하세요. JSON schema에 맞춰 응답하세요.`;

      return suggestSources(prompt, input.provider);
    }),

  bulkCreate: protectedProcedure
    .input(
      z.object({
        sources: z.array(
          z.object({
            name: z.string().min(1),
            type: sourceTypeEnum,
            url: z.string().optional(),
            groupName: z.string().optional(),
            tags: z.array(z.string()).optional(),
            priority: priorityEnum.optional(),
            processingPrompt: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.sources.length === 0) return [];
      const created = await ctx.db
        .insert(sources)
        .values(input.sources)
        .returning();
      return created;
    }),
});
