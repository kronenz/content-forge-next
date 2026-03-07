import { sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  sources,
  rawContents,
  pipelineRuns,
  processedContents,
  publications,
} from "@/server/db/schema";

export const analyticsRouter = createTRPCRouter({
  overview: publicProcedure.query(async ({ ctx }) => {
    const [sourceCount] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(sources);
    const [rawCount] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(rawContents);
    const [pipelineCount] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(pipelineRuns);
    const [contentCount] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(processedContents);
    const [pubCount] = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(publications);

    return {
      sources: Number(sourceCount?.count ?? 0),
      rawContents: Number(rawCount?.count ?? 0),
      pipelineRuns: Number(pipelineCount?.count ?? 0),
      processedContents: Number(contentCount?.count ?? 0),
      publications: Number(pubCount?.count ?? 0),
    };
  }),
});
