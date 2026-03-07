CREATE TYPE "public"."agent_role" AS ENUM('analyst', 'writer', 'editor', 'designer', 'seo_optimizer', 'fact_checker', 'compliance', 'localizer', 'platform_formatter');--> statement-breakpoint
CREATE TYPE "public"."pipeline_status" AS ENUM('pending', 'running', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('blog', 'linkedin', 'twitter', 'instagram');--> statement-breakpoint
CREATE TYPE "public"."publication_status" AS ENUM('scheduled', 'publishing', 'published', 'failed');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."reviewer_type" AS ENUM('human', 'auto');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('rss', 'api', 'web', 'research');--> statement-breakpoint
CREATE TYPE "public"."step_status" AS ENUM('pending', 'running', 'completed', 'failed', 'skipped');--> statement-breakpoint
CREATE TABLE "pipeline_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"raw_content_id" uuid NOT NULL,
	"status" "pipeline_status" DEFAULT 'pending' NOT NULL,
	"config" jsonb,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipeline_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pipeline_run_id" uuid NOT NULL,
	"agent_role" "agent_role" NOT NULL,
	"step_order" integer NOT NULL,
	"input" jsonb,
	"output" jsonb,
	"status" "step_status" DEFAULT 'pending' NOT NULL,
	"metadata" jsonb,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "processed_contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pipeline_run_id" uuid NOT NULL,
	"platform" "platform" NOT NULL,
	"title" text,
	"body" text NOT NULL,
	"media" jsonb,
	"metadata" jsonb,
	"format_config" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"processed_content_id" uuid NOT NULL,
	"platform" "platform" NOT NULL,
	"status" "publication_status" DEFAULT 'scheduled' NOT NULL,
	"published_url" text,
	"engagement_metrics" jsonb,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "raw_contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_id" uuid NOT NULL,
	"title" text,
	"body" text NOT NULL,
	"metadata" jsonb,
	"hash" text NOT NULL,
	"collected_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"processed_content_id" uuid NOT NULL,
	"status" "review_status" DEFAULT 'pending' NOT NULL,
	"reviewer" "reviewer_type" DEFAULT 'human' NOT NULL,
	"quality_score" real,
	"accuracy_score" real,
	"human_like_score" real,
	"platform_fit_score" real,
	"culture_fit_score" real,
	"feedback" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "source_type" NOT NULL,
	"url" text,
	"config" jsonb,
	"schedule" text,
	"processing_prompt" text,
	"group_name" text,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pipeline_runs" ADD CONSTRAINT "pipeline_runs_raw_content_id_raw_contents_id_fk" FOREIGN KEY ("raw_content_id") REFERENCES "public"."raw_contents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_steps" ADD CONSTRAINT "pipeline_steps_pipeline_run_id_pipeline_runs_id_fk" FOREIGN KEY ("pipeline_run_id") REFERENCES "public"."pipeline_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "processed_contents" ADD CONSTRAINT "processed_contents_pipeline_run_id_pipeline_runs_id_fk" FOREIGN KEY ("pipeline_run_id") REFERENCES "public"."pipeline_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publications" ADD CONSTRAINT "publications_processed_content_id_processed_contents_id_fk" FOREIGN KEY ("processed_content_id") REFERENCES "public"."processed_contents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_contents" ADD CONSTRAINT "raw_contents_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_processed_content_id_processed_contents_id_fk" FOREIGN KEY ("processed_content_id") REFERENCES "public"."processed_contents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "raw_contents_hash_idx" ON "raw_contents" USING btree ("hash");