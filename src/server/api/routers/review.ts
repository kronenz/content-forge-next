import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { reviews } from "@/server/db/schema";

export const reviewRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.reviews.findMany({
      orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
      with: { processedContent: true },
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.reviews.findFirst({
        where: eq(reviews.id, input.id),
        with: { processedContent: true },
      });
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
