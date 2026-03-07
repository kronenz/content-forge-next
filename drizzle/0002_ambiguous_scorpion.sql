ALTER TYPE "public"."agent_role" ADD VALUE 'researcher';--> statement-breakpoint
ALTER TYPE "public"."review_status" ADD VALUE 'revision' BEFORE 'rejected';--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "pipeline_run_id" uuid;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "inline_comments" jsonb;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_pipeline_run_id_pipeline_runs_id_fk" FOREIGN KEY ("pipeline_run_id") REFERENCES "public"."pipeline_runs"("id") ON DELETE set null ON UPDATE no action;