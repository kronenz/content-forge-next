import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { sources } from "@/server/db/schema";

export const sourceRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.sources.findMany({
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
        type: z.enum(["rss", "api", "web", "research"]),
        url: z.string().optional(),
        config: z.record(z.string(), z.unknown()).optional(),
        schedule: z.string().optional(),
        processingPrompt: z.string().optional(),
        groupName: z.string().optional(),
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

  delete: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(sources).where(eq(sources.id, input.id));
      return { success: true };
    }),
});
