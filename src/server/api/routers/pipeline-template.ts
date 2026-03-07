import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  pipelineTemplates,
  pipelineTemplateSources,
} from "@/server/db/schema";

const agentRoles = z.enum([
  "analyst",
  "writer",
  "editor",
  "designer",
  "seo_optimizer",
  "fact_checker",
  "compliance",
  "localizer",
  "platform_formatter",
  "researcher",
]);

export const pipelineTemplateRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.query.pipelineTemplates.findMany({
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      with: {
        templateSources: {
          with: { source: true },
        },
      },
    });
    return templates.map((t) => ({
      ...t,
      sources: t.templateSources.map((ts) => ts.source),
      sourceCount: t.templateSources.length,
    }));
  }),

  byId: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const template = await ctx.db.query.pipelineTemplates.findFirst({
        where: eq(pipelineTemplates.id, input.id),
        with: {
          templateSources: {
            with: { source: true },
          },
        },
      });
      if (!template) return null;
      return {
        ...template,
        sources: template.templateSources.map((ts) => ts.source),
        sourceCount: template.templateSources.length,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        agentSteps: z.array(agentRoles).optional(),
        sourceIds: z.array(z.uuid()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { sourceIds, ...data } = input;
      return ctx.db.transaction(async (tx) => {
        const [template] = await tx
          .insert(pipelineTemplates)
          .values({
            name: data.name,
            description: data.description,
            agentSteps: data.agentSteps,
          })
          .returning();

        if (sourceIds && sourceIds.length > 0 && template) {
          await tx.insert(pipelineTemplateSources).values(
            sourceIds.map((sourceId) => ({
              pipelineTemplateId: template.id,
              sourceId,
            })),
          );
        }

        return template;
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        agentSteps: z.array(agentRoles).optional(),
        isActive: z.number().min(0).max(1).optional(),
        sourceIds: z.array(z.uuid()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, sourceIds, ...data } = input;

      await ctx.db.transaction(async (tx) => {
        const updateData: Record<string, unknown> = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.agentSteps !== undefined) updateData.agentSteps = data.agentSteps;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;

        if (Object.keys(updateData).length > 0) {
          await tx
            .update(pipelineTemplates)
            .set(updateData)
            .where(eq(pipelineTemplates.id, id));
        }

        if (sourceIds !== undefined) {
          await tx
            .delete(pipelineTemplateSources)
            .where(eq(pipelineTemplateSources.pipelineTemplateId, id));

          if (sourceIds.length > 0) {
            await tx.insert(pipelineTemplateSources).values(
              sourceIds.map((sourceId) => ({
                pipelineTemplateId: id,
                sourceId,
              })),
            );
          }
        }
      });

      return ctx.db.query.pipelineTemplates.findFirst({
        where: eq(pipelineTemplates.id, id),
        with: {
          templateSources: { with: { source: true } },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(pipelineTemplates)
        .where(eq(pipelineTemplates.id, input.id));
      return { success: true };
    }),
});
