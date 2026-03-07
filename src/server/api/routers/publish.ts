import { z } from "zod/v4";
import { eq, and, sql, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { publications, processedContents } from "@/server/db/schema";
import { getPublisher } from "@/server/publishers";

const platformEnum = z.enum(["blog", "linkedin", "twitter", "instagram"]);

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
        platform: platformEnum,
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

  publish: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const pub = await ctx.db.query.publications.findFirst({
        where: eq(publications.id, input.id),
        with: { processedContent: true },
      });
      if (!pub) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Publication not found" });
      }
      if (pub.status === "published") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Already published" });
      }

      // Update status to publishing
      await ctx.db
        .update(publications)
        .set({ status: "publishing" })
        .where(eq(publications.id, input.id));

      const content = pub.processedContent;
      const publisher = getPublisher(pub.platform);
      const result = await publisher.publish({
        title: content.title ?? "Untitled",
        body: content.body,
        platform: pub.platform,
        media: content.media ?? undefined,
        tags:
          typeof content.metadata === "object" && content.metadata !== null
            ? (content.metadata as Record<string, unknown>).tags as string[] | undefined
            : undefined,
        metadata: content.metadata ?? undefined,
      });

      if (result.success) {
        const [updated] = await ctx.db
          .update(publications)
          .set({
            status: "published",
            publishedUrl: result.publishedUrl,
            publishedAt: new Date(),
          })
          .where(eq(publications.id, input.id))
          .returning();
        return updated;
      } else {
        await ctx.db
          .update(publications)
          .set({ status: "failed" })
          .where(eq(publications.id, input.id));
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error ?? "Publishing failed",
        });
      }
    }),

  crossPost: protectedProcedure
    .input(
      z.object({
        processedContentId: z.uuid(),
        platforms: z.array(platformEnum).min(1),
        scheduledAt: z.coerce.date().optional(),
        delayMinutes: z.number().min(0).default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const content = await ctx.db.query.processedContents.findFirst({
        where: eq(processedContents.id, input.processedContentId),
      });
      if (!content) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Content not found" });
      }

      const results = [];
      const baseTime = input.scheduledAt ?? new Date();

      for (let i = 0; i < input.platforms.length; i++) {
        const platform = input.platforms[i]!;
        const scheduledAt = new Date(
          baseTime.getTime() + i * input.delayMinutes * 60 * 1000,
        );

        const useSchedule = input.scheduledAt || input.delayMinutes > 0;
        const [pub] = await ctx.db
          .insert(publications)
          .values({
            processedContentId: input.processedContentId,
            platform,
            scheduledAt: useSchedule ? scheduledAt : undefined,
          })
          .returning();
        results.push(pub);
      }

      return results;
    }),

  getByPlatform: publicProcedure
    .input(z.object({ platform: platformEnum }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.publications.findMany({
        where: eq(publications.platform, input.platform),
        orderBy: (publications, { desc }) => [desc(publications.createdAt)],
        with: { processedContent: true },
      });
    }),

  getScheduled: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.publications.findMany({
      where: eq(publications.status, "scheduled"),
      orderBy: (publications, { asc }) => [asc(publications.scheduledAt)],
      with: { processedContent: true },
    });
  }),

  getByDateRange: publicProcedure
    .input(
      z.object({
        start: z.coerce.date(),
        end: z.coerce.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.publications.findMany({
        where: and(
          gte(publications.scheduledAt, input.start),
          lte(publications.scheduledAt, input.end),
        ),
        orderBy: (publications, { asc }) => [asc(publications.scheduledAt)],
        with: { processedContent: true },
      });
    }),

  stats: publicProcedure.query(async ({ ctx }) => {
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

  reschedule: protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
        scheduledAt: z.coerce.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [pub] = await ctx.db
        .update(publications)
        .set({ scheduledAt: input.scheduledAt })
        .where(
          and(
            eq(publications.id, input.id),
            eq(publications.status, "scheduled"),
          ),
        )
        .returning();
      if (!pub) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Scheduled publication not found" });
      }
      return pub;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
        status: z.enum(["scheduled", "publishing", "published", "failed"]),
        publishedUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [pub] = await ctx.db
        .update(publications)
        .set({
          status: input.status,
          publishedUrl: input.publishedUrl,
          ...(input.status === "published" ? { publishedAt: new Date() } : {}),
        })
        .where(eq(publications.id, input.id))
        .returning();
      return pub;
    }),

  processedContents: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.processedContents.findMany({
      orderBy: (pc, { desc }) => [desc(pc.createdAt)],
    });
  }),

  retry: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const pub = await ctx.db.query.publications.findFirst({
        where: eq(publications.id, input.id),
      });
      if (!pub) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Publication not found" });
      }
      if (pub.status !== "failed") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Can only retry failed publications" });
      }

      const [updated] = await ctx.db
        .update(publications)
        .set({ status: "scheduled" })
        .where(eq(publications.id, input.id))
        .returning();
      return updated;
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
