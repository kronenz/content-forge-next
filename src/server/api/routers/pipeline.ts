import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { pipelineRuns } from "@/server/db/schema";

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

  create: protectedProcedure
    .input(
      z.object({
        rawContentId: z.uuid(),
        config: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [run] = await ctx.db
        .insert(pipelineRuns)
        .values(input)
        .returning();
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
});
