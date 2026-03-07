import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { sources, rawContents, pipelineRuns, pipelineSteps, processedContents, reviews } from "@/server/db/schema";
import { collectFromSource } from "@/server/collectors";
import { executePipeline } from "@/server/pipeline/engine";
import { generateText } from "ai";
import { getModel } from "@/server/agents/model";
import {
  header, success, error, warn, info, stepStart, stepDone, stepFail,
  divider, bold, green, yellow, red, dim, validateUuid,
} from "../lib/output";

export async function flowCommand(args: string[]) {
  const sourceArg = args.find(a => a.startsWith("--source="));
  const autoApprove = args.includes("--auto-approve");
  const dryRun = args.includes("--dry-run");

  if (!sourceArg) {
    error("Usage: forge flow --source=<id> [--auto-approve] [--dry-run]");
    process.exit(1);
  }

  const sourceId = validateUuid(sourceArg.split("=")[1]!, "source ID");

  header("Full Content Flow");

  if (dryRun) warn("DRY RUN MODE - no actual changes will be made\n");

  const flowStart = Date.now();

  // Verify source
  const source = await db.query.sources.findFirst({
    where: eq(sources.id, sourceId),
  });

  if (!source) {
    error(`Source not found: ${sourceId}`);
    process.exit(1);
  }

  info(`Source: ${bold(source.name)} (${source.type})`);
  if (autoApprove) info(`Auto-approve: ${green("enabled")}`);
  divider();

  // ── Phase 1: Collection ──────────────────────────────────
  console.log(`\n${bold("Phase 1: Collection")}`);

  let collectedContentIds: string[] = [];

  if (dryRun) {
    // In dry-run, get existing unprocessed content
    const existing = await db.query.rawContents.findMany({
      where: eq(rawContents.sourceId, sourceId),
      limit: 5,
    });
    collectedContentIds = existing.map(c => c.id);
    info(`[DRY RUN] Would collect from source. Using ${existing.length} existing contents.`);
  } else {
    stepStart("Collecting from source");
    const collectStart = Date.now();
    const result = await collectFromSource(sourceId);
    stepDone(Date.now() - collectStart, `${result.collected} new, ${result.duplicates} dups`);

    if (result.errors.length > 0) {
      for (const e of result.errors) warn(e);
    }

    if (result.collected === 0) {
      warn("No new content collected. Using latest existing content.");
      const existing = await db.query.rawContents.findMany({
        where: eq(rawContents.sourceId, sourceId),
        limit: 5,
        orderBy: (rc, { desc }) => [desc(rc.collectedAt)],
      });
      collectedContentIds = existing.map(c => c.id);
    } else {
      // Get newly collected content IDs
      const recent = await db.query.rawContents.findMany({
        where: eq(rawContents.sourceId, sourceId),
        orderBy: (rc, { desc }) => [desc(rc.collectedAt)],
        limit: result.collected,
      });
      collectedContentIds = recent.map(c => c.id);
    }
  }

  if (collectedContentIds.length === 0) {
    error("No content available to process.");
    process.exit(1);
  }

  info(`${collectedContentIds.length} contents to process\n`);

  // ── Phase 2: Pipeline ────────────────────────────────────
  let processedContentIds: string[] = [];

  for (let i = 0; i < collectedContentIds.length; i++) {
    const contentId = collectedContentIds[i]!;
    console.log(`${bold(`Phase 2: Pipeline (${i + 1}/${collectedContentIds.length})`)}`);

    if (dryRun) {
      info(`[DRY RUN] Would run pipeline on content ${contentId.slice(0, 8)}...`);
      // Get existing processed content if any
      const existingRuns = await db.query.pipelineRuns.findMany({
        where: eq(pipelineRuns.rawContentId, contentId),
        with: { processedContents: true },
        limit: 1,
      });
      if (existingRuns[0]) {
        const pcs = existingRuns[0].processedContents as Array<{ id: string }>;
        processedContentIds.push(...pcs.map(pc => pc.id));
      }
    } else {
      // Create pipeline run
      const [run] = await db.insert(pipelineRuns).values({
        rawContentId: contentId,
        status: "pending",
      }).returning();

      if (!run) {
        error("Failed to create pipeline run");
        continue;
      }

      const pipelineStart = Date.now();

      try {
        await executePipeline(run.id);

        // Get steps for summary
        const steps = await db.query.pipelineSteps.findMany({
          where: eq(pipelineSteps.pipelineRunId, run.id),
          orderBy: (s, { asc }) => [asc(s.stepOrder)],
        });

        for (const step of steps) {
          const meta = step.metadata as { durationMs?: number; tokenUsage?: { input: number; output: number } } | null;
          const dur = meta?.durationMs ? `${(meta.durationMs / 1000).toFixed(1)}s` : "";
          const statusIcon = step.status === "completed" ? green("✓") : red("✗");
          console.log(`  ${statusIcon} ${step.agentRole.padEnd(20)} ${dim(dur)}`);
        }

        success(`Pipeline completed in ${((Date.now() - pipelineStart) / 1000).toFixed(1)}s`);

        // Collect processed content IDs
        const pcs = await db.query.processedContents.findMany({
          where: eq(processedContents.pipelineRunId, run.id),
        });
        processedContentIds.push(...pcs.map(pc => pc.id));
      } catch (err) {
        error(`Pipeline failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    divider();
  }

  // ── Phase 3: Review ──────────────────────────────────────
  if (processedContentIds.length > 0) {
    console.log(`\n${bold("Phase 3: Review")}`);

    if (autoApprove && !dryRun) {
      for (const pcId of processedContentIds) {
        const content = await db.query.processedContents.findFirst({
          where: eq(processedContents.id, pcId),
        });
        if (!content) continue;

        stepStart(`Auto-reviewing ${content.platform} content`);
        const reviewStart = Date.now();

        try {
          const { text } = await generateText({
            model: getModel(),
            system: `You are a content quality reviewer. Evaluate and score the content.
Respond with JSON: {"qualityScore":8.5,"accuracyScore":9.0,"humanLikeScore":7.5,"platformFitScore":8.0,"cultureFitScore":7.0,"feedback":"assessment","status":"approved"}
Scores 0-10, one decimal. Status: "approved" if all >= 7.0, else "revision".`,
            prompt: `Review this ${content.platform} content:\nTitle: ${content.title ?? "(no title)"}\nBody: ${content.body}\nRespond JSON only.`,
          });

          let result: {
            qualityScore: number;
            accuracyScore: number;
            humanLikeScore: number;
            platformFitScore: number;
            cultureFitScore: number;
            feedback: string;
            status: "approved" | "revision";
          };

          try {
            result = JSON.parse(text);
          } catch {
            stepFail("AI returned invalid JSON");
            continue;
          }

          await db.insert(reviews).values({
            processedContentId: pcId,
            pipelineRunId: content.pipelineRunId,
            reviewer: "auto",
            status: result.status,
            qualityScore: result.qualityScore,
            accuracyScore: result.accuracyScore,
            humanLikeScore: result.humanLikeScore,
            platformFitScore: result.platformFitScore,
            cultureFitScore: result.cultureFitScore,
            feedback: result.feedback,
          });

          stepDone(Date.now() - reviewStart, `${result.status} (${result.qualityScore.toFixed(1)}/10)`);
        } catch (err) {
          stepFail(err instanceof Error ? err.message : String(err));
        }
      }
    } else if (dryRun) {
      info(`[DRY RUN] Would review ${processedContentIds.length} processed contents`);
    } else {
      info(`${processedContentIds.length} contents ready for review.`);
      info(`Run: forge review list`);
      info(`Or: forge flow --source=${sourceId} --auto-approve`);
    }
  }

  // ── Summary ──────────────────────────────────────────────
  console.log("");
  divider();
  header("Flow Summary");

  const totalDuration = Date.now() - flowStart;
  console.log(`  ${bold("Source:")}      ${source.name}`);
  console.log(`  ${bold("Collected:")}   ${collectedContentIds.length} contents`);
  console.log(`  ${bold("Processed:")}   ${processedContentIds.length} contents`);
  console.log(`  ${bold("Duration:")}    ${(totalDuration / 1000).toFixed(1)}s`);
  if (dryRun) console.log(`  ${yellow("Mode:")}        DRY RUN (no changes made)`);
  console.log("");
}
