import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { publications } from "@/server/db/schema";

export const publishRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.publications.findMany({
      orderBy: (publications, { desc }) => [desc(publications.createdAt)],
      with: { processedContent: true },
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.publications.findFirst({
        where: eq(publications.id, input.id),
        with: { processedContent: true },
      });
    }),

  schedule: protectedProcedure
    .input(
      z.object({
        processedContentId: z.uuid(),
        platform: z.enum(["blog", "linkedin", "twitter", "instagram"]),
        scheduledAt: z.coerce.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [pub] = await ctx.db
        .insert(publications)
        .values(input)
        .returning();
      return pub;
    }),

  cancel: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(publications)
        .where(eq(publications.id, input.id));
      return { success: true };
    }),
});
