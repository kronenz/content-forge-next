import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
  real,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// Enums
// ============================================================

export const sourceTypeEnum = pgEnum("source_type", [
  "rss",
  "api",
  "web",
  "research",
]);

export const pipelineStatusEnum = pgEnum("pipeline_status", [
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
]);

export const stepStatusEnum = pgEnum("step_status", [
  "pending",
  "running",
  "completed",
  "failed",
  "skipped",
]);

export const agentRoleEnum = pgEnum("agent_role", [
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

export const platformEnum = pgEnum("platform", [
  "blog",
  "linkedin",
  "twitter",
  "instagram",
]);

export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "approved",
  "revision",
  "rejected",
]);

export const reviewerTypeEnum = pgEnum("reviewer_type", ["human", "auto"]);

export const publicationStatusEnum = pgEnum("publication_status", [
  "scheduled",
  "publishing",
  "published",
  "failed",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
  "trialing",
  "incomplete",
]);

// ============================================================
// Tables
// ============================================================

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: sourceTypeEnum("type").notNull(),
  url: text("url"),
  config: jsonb("config").$type<Record<string, unknown>>(),
  schedule: text("schedule"), // cron expression
  processingPrompt: text("processing_prompt"),
  groupName: text("group_name"),
  tags: jsonb("tags").$type<string[]>(),
  priority: text("priority").notNull().default("medium"),
  filters: jsonb("filters").$type<{ keywords?: string[]; exclude?: string[] }>(),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const rawContents = pgTable(
  "raw_contents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    title: text("title"),
    body: text("body").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    hash: text("hash").notNull(),
    collectedAt: timestamp("collected_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("raw_contents_hash_idx").on(table.hash)],
);

export const pipelineRuns = pgTable("pipeline_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  rawContentId: uuid("raw_content_id")
    .notNull()
    .references(() => rawContents.id, { onDelete: "cascade" }),
  status: pipelineStatusEnum("status").notNull().default("pending"),
  config: jsonb("config").$type<Record<string, unknown>>(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const pipelineSteps = pgTable("pipeline_steps", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineRunId: uuid("pipeline_run_id")
    .notNull()
    .references(() => pipelineRuns.id, { onDelete: "cascade" }),
  agentRole: agentRoleEnum("agent_role").notNull(),
  stepOrder: integer("step_order").notNull(),
  input: jsonb("input").$type<Record<string, unknown>>(),
  output: jsonb("output").$type<Record<string, unknown>>(),
  status: stepStatusEnum("status").notNull().default("pending"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const processedContents = pgTable("processed_contents", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineRunId: uuid("pipeline_run_id")
    .notNull()
    .references(() => pipelineRuns.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  title: text("title"),
  body: text("body").notNull(),
  media: jsonb("media").$type<string[]>(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  formatConfig: jsonb("format_config").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  pipelineRunId: uuid("pipeline_run_id").references(() => pipelineRuns.id, {
    onDelete: "set null",
  }),
  processedContentId: uuid("processed_content_id")
    .notNull()
    .references(() => processedContents.id, { onDelete: "cascade" }),
  status: reviewStatusEnum("status").notNull().default("pending"),
  reviewer: reviewerTypeEnum("reviewer").notNull().default("human"),
  qualityScore: real("quality_score"),
  accuracyScore: real("accuracy_score"),
  humanLikeScore: real("human_like_score"),
  platformFitScore: real("platform_fit_score"),
  cultureFitScore: real("culture_fit_score"),
  feedback: text("feedback"),
  inlineComments:
    jsonb("inline_comments").$type<
      Array<{
        id: string;
        selectedText: string;
        comment: string;
        position: { start: number; end: number };
        createdAt: string;
      }>
    >(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const publications = pgTable("publications", {
  id: uuid("id").primaryKey().defaultRandom(),
  processedContentId: uuid("processed_content_id")
    .notNull()
    .references(() => processedContents.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  status: publicationStatusEnum("status").notNull().default("scheduled"),
  publishedUrl: text("published_url"),
  engagementMetrics: jsonb("engagement_metrics").$type<Record<string, unknown>>(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(),
  planId: text("plan_id").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripePriceId: text("stripe_price_id"),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: integer("cancel_at_period_end").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ============================================================
// Relations
// ============================================================

export const sourcesRelations = relations(sources, ({ many }) => ({
  rawContents: many(rawContents),
}));

export const rawContentsRelations = relations(rawContents, ({ one, many }) => ({
  source: one(sources, {
    fields: [rawContents.sourceId],
    references: [sources.id],
  }),
  pipelineRuns: many(pipelineRuns),
}));

export const pipelineRunsRelations = relations(
  pipelineRuns,
  ({ one, many }) => ({
    rawContent: one(rawContents, {
      fields: [pipelineRuns.rawContentId],
      references: [rawContents.id],
    }),
    steps: many(pipelineSteps),
    processedContents: many(processedContents),
  }),
);

export const pipelineStepsRelations = relations(pipelineSteps, ({ one }) => ({
  pipelineRun: one(pipelineRuns, {
    fields: [pipelineSteps.pipelineRunId],
    references: [pipelineRuns.id],
  }),
}));

export const processedContentsRelations = relations(
  processedContents,
  ({ one, many }) => ({
    pipelineRun: one(pipelineRuns, {
      fields: [processedContents.pipelineRunId],
      references: [pipelineRuns.id],
    }),
    reviews: many(reviews),
    publications: many(publications),
  }),
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  processedContent: one(processedContents, {
    fields: [reviews.processedContentId],
    references: [processedContents.id],
  }),
  pipelineRun: one(pipelineRuns, {
    fields: [reviews.pipelineRunId],
    references: [pipelineRuns.id],
  }),
}));

export const publicationsRelations = relations(publications, ({ one }) => ({
  processedContent: one(processedContents, {
    fields: [publications.processedContentId],
    references: [processedContents.id],
  }),
}));
