import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { rawContents, processedContents } from "@/server/db/schema";

export const contentRouter = createTRPCRouter({
  listRaw: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.rawContents.findMany({
      orderBy: (rawContents, { desc }) => [desc(rawContents.collectedAt)],
      with: { source: true },
    });
  }),

  listProcessed: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.processedContents.findMany({
      orderBy: (processedContents, { desc }) => [
        desc(processedContents.createdAt),
      ],
      with: { pipelineRun: true },
    });
  }),

  rawById: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.rawContents.findFirst({
        where: eq(rawContents.id, input.id),
        with: { source: true, pipelineRuns: true },
      });
    }),

  processedById: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.processedContents.findFirst({
        where: eq(processedContents.id, input.id),
        with: { reviews: true, publications: true },
      });
    }),
});
