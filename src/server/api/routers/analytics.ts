import { sql, eq, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  sources,
  rawContents,
  pipelineRuns,
  processedContents,
  publications,
  reviews,
} from "@/server/db/schema";
import { computeTrustLevel } from "@/server/services/auto-approval";

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

  dashboard: publicProcedure.query(async ({ ctx }) => {
    const [rawCount] = await ctx.db
      .select({ count: sql<number>`count(*)::int` })
      .from(rawContents);
    const [processingCount] = await ctx.db
      .select({ count: sql<number>`count(*)::int` })
      .from(pipelineRuns)
      .where(sql`${pipelineRuns.status} in ('pending', 'running')`);
    const [pendingReviewCount] = await ctx.db
      .select({ count: sql<number>`count(*)::int` })
      .from(reviews)
      .where(eq(reviews.status, "pending"));
    const [publishedCount] = await ctx.db
      .select({ count: sql<number>`count(*)::int` })
      .from(publications)
      .where(eq(publications.status, "published"));

    const recentPipelines = await ctx.db.query.pipelineRuns.findMany({
      orderBy: [desc(pipelineRuns.createdAt)],
      limit: 5,
      with: { rawContent: true },
    });

    const recentPublications = await ctx.db.query.publications.findMany({
      where: eq(publications.status, "published"),
      orderBy: [desc(publications.publishedAt)],
      limit: 5,
      with: { processedContent: true },
    });

    return {
      stats: {
        collected: Number(rawCount?.count ?? 0),
        processing: Number(processingCount?.count ?? 0),
        pendingReview: Number(pendingReviewCount?.count ?? 0),
        published: Number(publishedCount?.count ?? 0),
      },
      recentPipelines,
      recentPublications,
    };
  }),

  reviewStats: publicProcedure.query(async ({ ctx }) => {
    const allReviews = await ctx.db.query.reviews.findMany();

    const total = allReviews.length;
    const approved = allReviews.filter((r) => r.status === "approved").length;
    const rejected = allReviews.filter((r) => r.status === "rejected").length;
    const revision = allReviews.filter((r) => r.status === "revision").length;
    const pending = allReviews.filter((r) => r.status === "pending").length;
    const autoApproved = allReviews.filter(
      (r) => r.status === "approved" && r.reviewer === "auto",
    ).length;
    const humanApproved = approved - autoApproved;

    const withScores = allReviews.filter((r) => r.qualityScore != null);
    const avgQuality =
      withScores.length > 0
        ? withScores.reduce((s, r) => s + (r.qualityScore ?? 0), 0) /
          withScores.length
        : 0;

    const avgScores =
      withScores.length > 0
        ? {
            quality: avgQuality,
            accuracy:
              withScores.reduce((s, r) => s + (r.accuracyScore ?? 0), 0) /
              withScores.length,
            humanLike:
              withScores.reduce((s, r) => s + (r.humanLikeScore ?? 0), 0) /
              withScores.length,
            platformFit:
              withScores.reduce((s, r) => s + (r.platformFitScore ?? 0), 0) /
              withScores.length,
            cultureFit:
              withScores.reduce((s, r) => s + (r.cultureFitScore ?? 0), 0) /
              withScores.length,
          }
        : null;

    const trustLevel = computeTrustLevel(total, avgQuality);

    return {
      total,
      approved,
      rejected,
      revision,
      pending,
      autoApproved,
      humanApproved,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      avgScores,
      trustLevel,
    };
  }),

  publishingStats: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        platform: publications.platform,
        total: sql<number>`count(*)::int`,
        published: sql<number>`count(*) filter (where ${publications.status} = 'published')::int`,
        failed: sql<number>`count(*) filter (where ${publications.status} = 'failed')::int`,
        scheduled: sql<number>`count(*) filter (where ${publications.status} = 'scheduled')::int`,
      })
      .from(publications)
      .groupBy(publications.platform);

    return result.map((r) => ({
      ...r,
      successRate: r.total > 0 ? Math.round((r.published / r.total) * 100) : 0,
    }));
  }),
});
