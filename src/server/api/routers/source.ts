import { z } from "zod/v4";
import { eq, ilike, isNotNull, SQL } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { sources } from "@/server/db/schema";

const priorityEnum = z.enum(["low", "medium", "high", "critical"]);
const sourceTypeEnum = z.enum(["rss", "api", "web", "research"]);
const filtersSchema = z.object({
  keywords: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
});

export const sourceRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z.object({
        type: sourceTypeEnum.optional(),
        groupName: z.string().optional(),
        isActive: z.number().min(0).max(1).optional(),
        search: z.string().optional(),
      }).optional(),
    )
    .query(async ({ ctx, input }) => {
      const conditions: SQL[] = [];
      if (input?.type) conditions.push(eq(sources.type, input.type));
      if (input?.groupName) conditions.push(eq(sources.groupName, input.groupName));
      if (input?.isActive !== undefined) conditions.push(eq(sources.isActive, input.isActive));
      if (input?.search) conditions.push(ilike(sources.name, `%${input.search}%`));

      return ctx.db.query.sources.findMany({
        where: conditions.length > 0 ? (_, { and }) => and(...conditions) : undefined,
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
        type: sourceTypeEnum,
        url: z.string().optional(),
        config: z.record(z.string(), z.unknown()).optional(),
        schedule: z.string().optional(),
        processingPrompt: z.string().optional(),
        groupName: z.string().optional(),
        tags: z.array(z.string()).optional(),
        priority: priorityEnum.optional(),
        filters: filtersSchema.optional(),
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
        tags: z.array(z.string()).optional(),
        priority: priorityEnum.optional(),
        filters: filtersSchema.optional(),
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

  toggleActive: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.sources.findFirst({
        where: eq(sources.id, input.id),
      });
      if (!existing) throw new Error("Source not found");
      const [source] = await ctx.db
        .update(sources)
        .set({ isActive: existing.isActive === 1 ? 0 : 1 })
        .where(eq(sources.id, input.id))
        .returning();
      return source;
    }),

  listGroups: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .selectDistinct({ groupName: sources.groupName })
      .from(sources)
      .where(isNotNull(sources.groupName))
      .orderBy(sources.groupName);
    return rows.map((r) => r.groupName as string);
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(sources).where(eq(sources.id, input.id));
      return { success: true };
    }),
});
