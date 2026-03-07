import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  pipelineRuns,
  pipelineSteps,
  processedContents,
} from "@/server/db/schema";
import { runAnalyst } from "@/server/agents/analyst";
import { runWriter } from "@/server/agents/writer";
import { runEditor } from "@/server/agents/editor";
import { runFormatter } from "@/server/agents/formatter";
import type {
  AgentRole,
  AnalysisReport,
  DraftContents,
  FormattedContents,
} from "@/server/agents/types";

const DEFAULT_STEPS: { role: AgentRole; order: number }[] = [
  { role: "analyst", order: 1 },
  { role: "writer", order: 2 },
  { role: "editor", order: 3 },
  { role: "platform_formatter", order: 4 },
];

export async function executePipeline(pipelineRunId: string): Promise<void> {
  const run = await db.query.pipelineRuns.findFirst({
    where: eq(pipelineRuns.id, pipelineRunId),
    with: { rawContent: { with: { source: true } } },
  });

  if (!run) throw new Error(`Pipeline run ${pipelineRunId} not found`);

  await db
    .update(pipelineRuns)
    .set({ status: "running", startedAt: new Date() })
    .where(eq(pipelineRuns.id, pipelineRunId));

  // Create step records upfront
  for (const step of DEFAULT_STEPS) {
    await db.insert(pipelineSteps).values({
      pipelineRunId,
      agentRole: step.role,
      stepOrder: step.order,
      status: "pending",
    });
  }

  try {
    const rawContent = run.rawContent;
    const processingPrompt = (rawContent as { source?: { processingPrompt?: string } })
      .source?.processingPrompt;

    // Step 1: Analyst
    const analysisReport = await executeStep<AnalysisReport>(
      pipelineRunId,
      "analyst",
      () =>
        runAnalyst({
          title: rawContent.title,
          body: rawContent.body,
          metadata: rawContent.metadata ?? undefined,
        }),
    );

    // Step 2: Writer
    const drafts = await executeStep<DraftContents>(
      pipelineRunId,
      "writer",
      () => runWriter({ analysisReport, processingPrompt }),
    );

    // Step 3: Editor
    const editorOutput = await executeStep<{ edited: DraftContents }>(
      pipelineRunId,
      "editor",
      () => runEditor({ drafts }),
    );

    // Step 4: Platform Formatter
    const formatted = await executeStep<FormattedContents>(
      pipelineRunId,
      "platform_formatter",
      () => runFormatter({ edited: editorOutput.edited }),
    );

    // Save processed contents for each platform
    const platforms = [
      {
        platform: "blog" as const,
        title: formatted.blog.title,
        body: formatted.blog.body,
        metadata: {
          excerpt: formatted.blog.excerpt,
          estimated_read_time: formatted.blog.estimated_read_time,
          slug: formatted.blog.slug,
        },
      },
      {
        platform: "linkedin" as const,
        title: null,
        body: formatted.linkedin.text,
        metadata: { character_count: formatted.linkedin.character_count },
      },
      {
        platform: "twitter" as const,
        title: null,
        body: formatted.twitter.single,
        metadata: {
          thread: formatted.twitter.thread,
          character_counts: formatted.twitter.character_counts,
        },
      },
      {
        platform: "instagram" as const,
        title: null,
        body: formatted.instagram.caption,
        metadata: {
          hashtags: formatted.instagram.hashtags,
          character_count: formatted.instagram.character_count,
        },
      },
    ];

    for (const p of platforms) {
      await db.insert(processedContents).values({
        pipelineRunId,
        platform: p.platform,
        title: p.title,
        body: p.body,
        metadata: p.metadata,
      });
    }

    await db
      .update(pipelineRuns)
      .set({ status: "completed", completedAt: new Date() })
      .where(eq(pipelineRuns.id, pipelineRunId));
  } catch (error) {
    await db
      .update(pipelineRuns)
      .set({ status: "failed", completedAt: new Date() })
      .where(eq(pipelineRuns.id, pipelineRunId));
    throw error;
  }
}

async function executeStep<T>(
  pipelineRunId: string,
  role: AgentRole,
  fn: () => Promise<{ output: T; tokenUsage: { input: number; output: number }; durationMs: number }>,
): Promise<T> {
  const stepWhere = and(
    eq(pipelineSteps.pipelineRunId, pipelineRunId),
    eq(pipelineSteps.agentRole, role),
  );

  await db
    .update(pipelineSteps)
    .set({ status: "running", startedAt: new Date() })
    .where(stepWhere);

  try {
    const result = await fn();

    await db
      .update(pipelineSteps)
      .set({
        status: "completed",
        output: result.output as Record<string, unknown>,
        metadata: {
          tokenUsage: result.tokenUsage,
          durationMs: result.durationMs,
        },
        completedAt: new Date(),
      })
      .where(stepWhere);

    return result.output;
  } catch (error) {
    await db
      .update(pipelineSteps)
      .set({
        status: "failed",
        metadata: { error: error instanceof Error ? error.message : "Unknown error" },
        completedAt: new Date(),
      })
      .where(stepWhere);

    throw error;
  }
}
