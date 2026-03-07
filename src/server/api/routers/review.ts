import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { reviews } from "@/server/db/schema";

export const reviewRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          status: z
            .enum(["pending", "approved", "revision", "rejected"])
            .optional(),
          platform: z
            .enum(["blog", "linkedin", "twitter", "instagram"])
            .optional(),
          limit: z.number().min(1).max(100).default(50),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.reviews.findMany({
        where: input?.status ? eq(reviews.status, input.status) : undefined,
        orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
        limit: input?.limit ?? 50,
        with: {
          processedContent: true,
          pipelineRun: { with: { rawContent: true } },
        },
      });
    }),

  byId: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.reviews.findFirst({
        where: eq(reviews.id, input.id),
        with: {
          processedContent: true,
          pipelineRun: {
            with: {
              rawContent: true,
              steps: {
                orderBy: (steps, { asc }) => [asc(steps.stepOrder)],
              },
            },
          },
        },
      });
    }),

  getByContentId: publicProcedure
    .input(z.object({ processedContentId: z.uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.reviews.findMany({
        where: eq(reviews.processedContentId, input.processedContentId),
        orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
        with: { processedContent: true },
      });
    }),

  getByPipelineRun: publicProcedure
    .input(z.object({ pipelineRunId: z.uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.reviews.findMany({
        where: eq(reviews.pipelineRunId, input.pipelineRunId),
        orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
        with: { processedContent: true },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        processedContentId: z.uuid(),
        pipelineRunId: z.uuid().optional(),
        qualityScore: z.number().min(0).max(10).optional(),
        accuracyScore: z.number().min(0).max(10).optional(),
        humanLikeScore: z.number().min(0).max(10).optional(),
        platformFitScore: z.number().min(0).max(10).optional(),
        cultureFitScore: z.number().min(0).max(10).optional(),
        feedback: z.string().optional(),
        inlineComments: z
          .array(
            z.object({
              id: z.string(),
              selectedText: z.string(),
              comment: z.string(),
              position: z.object({
                start: z.number(),
                end: z.number(),
              }),
              createdAt: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [review] = await ctx.db
        .insert(reviews)
        .values({
          processedContentId: input.processedContentId,
          pipelineRunId: input.pipelineRunId,
          qualityScore: input.qualityScore,
          accuracyScore: input.accuracyScore,
          humanLikeScore: input.humanLikeScore,
          platformFitScore: input.platformFitScore,
          cultureFitScore: input.cultureFitScore,
          feedback: input.feedback,
          inlineComments: input.inlineComments,
          reviewer: "human",
          status: "pending",
        })
        .returning();
      return review;
    }),

  updateDecision: protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
        status: z.enum(["approved", "revision", "rejected"]),
        feedback: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [review] = await ctx.db
        .update(reviews)
        .set({
          status: input.status,
          feedback: input.feedback,
        })
        .where(eq(reviews.id, input.id))
        .returning();
      return review;
    }),

  addInlineComment: protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
        comment: z.object({
          id: z.string(),
          selectedText: z.string(),
          comment: z.string(),
          position: z.object({
            start: z.number(),
            end: z.number(),
          }),
          createdAt: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.reviews.findFirst({
        where: eq(reviews.id, input.id),
      });
      const comments = existing?.inlineComments ?? [];
      comments.push(input.comment);

      const [review] = await ctx.db
        .update(reviews)
        .set({ inlineComments: comments })
        .where(eq(reviews.id, input.id))
        .returning();
      return review;
    }),

  stats: publicProcedure.query(async ({ ctx }) => {
    const allReviews = await ctx.db.query.reviews.findMany();

    const total = allReviews.length;
    const approved = allReviews.filter((r) => r.status === "approved").length;
    const rejected = allReviews.filter((r) => r.status === "rejected").length;
    const revision = allReviews.filter((r) => r.status === "revision").length;
    const pending = allReviews.filter((r) => r.status === "pending").length;

    const withScores = allReviews.filter((r) => r.qualityScore != null);
    const avgScores =
      withScores.length > 0
        ? {
            quality:
              withScores.reduce((s, r) => s + (r.qualityScore ?? 0), 0) /
              withScores.length,
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

    return {
      total,
      approved,
      rejected,
      revision,
      pending,
      approvalRate: total > 0 ? approved / total : 0,
      rejectionRate: total > 0 ? rejected / total : 0,
      avgScores,
    };
  }),

  submit: protectedProcedure
    .input(
      z.object({
        processedContentId: z.uuid(),
        status: z.enum(["approved", "rejected"]),
        qualityScore: z.number().min(0).max(10).optional(),
        accuracyScore: z.number().min(0).max(10).optional(),
        humanLikeScore: z.number().min(0).max(10).optional(),
        platformFitScore: z.number().min(0).max(10).optional(),
        cultureFitScore: z.number().min(0).max(10).optional(),
        feedback: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [review] = await ctx.db
        .insert(reviews)
        .values({ ...input, reviewer: "human" })
        .returning();
      return review;
    }),
});
