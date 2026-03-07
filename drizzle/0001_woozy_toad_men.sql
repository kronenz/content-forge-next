ALTER TABLE "sources" ADD COLUMN "tags" jsonb;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "priority" text DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE "sources" ADD COLUMN "filters" jsonb;