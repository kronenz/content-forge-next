import { db } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { pipelineRuns, pipelineSteps, rawContents } from "@/server/db/schema";
import { executePipeline } from "@/server/pipeline/engine";
import {
  header, success, error, info,
  table, divider, bold, green, yellow, red, dim, validateUuid,
} from "../lib/output";

export async function pipelineCommand(args: string[]) {
  const subCommand = args[0];

  if (subCommand === "list") {
    await pipelineList();
  } else if (subCommand === "run") {
    await pipelineRun(args.slice(1));
  } else {
    error("Usage: forge pipeline <run|list> [options]");
    console.log(`\n  ${bold("run")}   --content=<rawContentId>   Run pipeline on content`);
    console.log(`  ${bold("list")}                              List recent pipeline runs`);
    process.exit(1);
  }
}

async function pipelineList() {
  header("Pipeline Runs");

  const runs = await db.query.pipelineRuns.findMany({
    orderBy: [desc(pipelineRuns.createdAt)],
    limit: 20,
    with: { rawContent: true },
  });

  if (runs.length === 0) {
    info("No pipeline runs yet.");
    return;
  }

  const statusColor = (s: string) => {
    switch (s) {
      case "completed": return green(s);
      case "running": return yellow(s);
      case "failed": return red(s);
      case "cancelled": return dim(s);
      default: return s;
    }
  };

  table(
    ["ID", "Content", "Status", "Started", "Duration"],
    runs.map((r) => {
      const duration = r.startedAt && r.completedAt
        ? `${((r.completedAt.getTime() - r.startedAt.getTime()) / 1000).toFixed(1)}s`
        : "-";
      return [
        r.id.slice(0, 8) + "...",
        ((r.rawContent as { title?: string | null })?.title ?? "(untitled)").slice(0, 30),
        statusColor(r.status),
        r.startedAt ? r.startedAt.toISOString().slice(0, 19).replace("T", " ") : "-",
        duration,
      ];
    }),
  );
}

async function pipelineRun(args: string[]) {
  header("AI Agent Pipeline");

  const contentArg = args.find(a => a.startsWith("--content="));
  if (!contentArg) {
    error("Usage: forge pipeline run --content=<rawContentId>");
    process.exit(1);
  }

  const rawContentId = validateUuid(contentArg.split("=")[1]!, "content ID");

  // Verify content exists
  const content = await db.query.rawContents.findFirst({
    where: eq(rawContents.id, rawContentId),
    with: { source: true },
  });

  if (!content) {
    error(`Raw content not found: ${rawContentId}`);
    process.exit(1);
  }

  info(`Content: ${bold((content.title ?? "(untitled)").slice(0, 60))}`);
  info(`Source: ${(content.source as { name: string })?.name ?? "unknown"}`);
  console.log("");

  // Create pipeline run
  const [run] = await db.insert(pipelineRuns).values({
    rawContentId,
    status: "pending",
  }).returning();

  if (!run) {
    error("Failed to create pipeline run");
    process.exit(1);
  }

  info(`Pipeline Run: ${dim(run.id)}`);
  divider();

  const startTime = Date.now();

  try {
    // Execute pipeline (this creates steps and runs agents)
    await executePipeline(run.id);

    // Fetch completed steps for summary
    const steps = await db.query.pipelineSteps.findMany({
      where: eq(pipelineSteps.pipelineRunId, run.id),
      orderBy: (s, { asc }) => [asc(s.stepOrder)],
    });

    console.log("");
    divider();
    header("Pipeline Results");

    for (const step of steps) {
      const meta = step.metadata as { tokenUsage?: { input: number; output: number }; durationMs?: number } | null;
      const tokens = meta?.tokenUsage ? `${meta.tokenUsage.input + meta.tokenUsage.output} tokens` : "";
      const dur = meta?.durationMs ? `${(meta.durationMs / 1000).toFixed(1)}s` : "";
      const statusIcon = step.status === "completed" ? green("✓") : red("✗");
      console.log(`  ${statusIcon} ${bold(step.agentRole.padEnd(20))} ${dim(dur.padEnd(8))} ${dim(tokens)}`);
    }

    const totalDuration = Date.now() - startTime;
    console.log("");
    success(`Pipeline completed in ${(totalDuration / 1000).toFixed(1)}s`);
  } catch (err) {
    const totalDuration = Date.now() - startTime;

    // Fetch steps to see where it failed
    const steps = await db.query.pipelineSteps.findMany({
      where: eq(pipelineSteps.pipelineRunId, run.id),
      orderBy: (s, { asc }) => [asc(s.stepOrder)],
    });

    console.log("");
    for (const step of steps) {
      const statusIcon = step.status === "completed" ? green("✓") : step.status === "failed" ? red("✗") : dim("○");
      const meta = step.metadata as { error?: string; durationMs?: number } | null;
      const dur = meta?.durationMs ? `${(meta.durationMs / 1000).toFixed(1)}s` : "";
      console.log(`  ${statusIcon} ${bold(step.agentRole.padEnd(20))} ${dim(dur)}`);
      if (step.status === "failed" && meta?.error) {
        console.log(`    ${red("Error:")} ${meta.error}`);
      }
    }

    console.log("");
    error(`Pipeline failed after ${(totalDuration / 1000).toFixed(1)}s: ${err instanceof Error ? err.message : String(err)}`);
  }
}
