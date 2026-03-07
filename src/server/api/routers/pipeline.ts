import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { pipelineRuns, pipelineSteps } from "@/server/db/schema";
import { executePipeline } from "@/server/pipeline/engine";

export const pipelineRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.pipelineRuns.findMany({
      orderBy: (pipelineRuns, { desc }) => [desc(pipelineRuns.createdAt)],
      with: { rawContent: true },
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.pipelineRuns.findFirst({
        where: eq(pipelineRuns.id, input.id),
        with: {
          rawContent: true,
          steps: {
            orderBy: (pipelineSteps, { asc }) => [asc(pipelineSteps.stepOrder)],
          },
          processedContents: true,
        },
      });
    }),

  run: protectedProcedure
    .input(
      z.object({
        rawContentId: z.uuid(),
        config: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [run] = await ctx.db
        .insert(pipelineRuns)
        .values({
          rawContentId: input.rawContentId,
          config: input.config,
          status: "pending",
        })
        .returning();

      // Execute pipeline asynchronously (don't await)
      executePipeline(run!.id).catch((err) => {
        console.error(`[pipeline] Run ${run!.id} failed:`, err);
      });

      return run;
    }),

  cancel: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [run] = await ctx.db
        .update(pipelineRuns)
        .set({ status: "cancelled" })
        .where(eq(pipelineRuns.id, input.id))
        .returning();
      return run;
    }),

  rawContents: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.rawContents.findMany({
        orderBy: (rawContents, { desc }) => [desc(rawContents.collectedAt)],
        limit: input?.limit ?? 50,
        with: { source: true },
      });
    }),

  stats: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const steps = await ctx.db.query.pipelineSteps.findMany({
        where: eq(pipelineSteps.pipelineRunId, input.id),
        orderBy: (pipelineSteps, { asc }) => [asc(pipelineSteps.stepOrder)],
      });

      let totalTokensInput = 0;
      let totalTokensOutput = 0;
      let totalDurationMs = 0;

      for (const step of steps) {
        const meta = step.metadata as {
          tokenUsage?: { input: number; output: number };
          durationMs?: number;
        } | null;
        if (meta?.tokenUsage) {
          totalTokensInput += meta.tokenUsage.input;
          totalTokensOutput += meta.tokenUsage.output;
        }
        if (meta?.durationMs) {
          totalDurationMs += meta.durationMs;
        }
      }

      return {
        steps,
        totals: {
          tokensInput: totalTokensInput,
          tokensOutput: totalTokensOutput,
          tokensTotal: totalTokensInput + totalTokensOutput,
          durationMs: totalDurationMs,
        },
      };
    }),
});
