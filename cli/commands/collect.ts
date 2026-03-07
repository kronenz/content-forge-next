import { db } from "@/lib/db";
import { sources } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { collectFromSource } from "@/server/collectors";
import { header, error, warn, info, stepStart, stepDone, stepFail, divider, bold, green, yellow, red, validateUuid } from "../lib/output";

export async function collectCommand(args: string[]) {
  header("Source Collection");

  const sourceArg = args.find(a => a.startsWith("--source="));
  const collectAll = args.includes("--all");

  if (!sourceArg && !collectAll) {
    error("Usage: forge collect --source=<id> or forge collect --all");
    process.exit(1);
  }

  if (collectAll) {
    // Collect from all active sources
    const activeSources = await db.select().from(sources).where(eq(sources.isActive, 1));

    if (activeSources.length === 0) {
      warn("No active sources found.");
      return;
    }

    info(`Found ${bold(String(activeSources.length))} active sources\n`);

    let totalCollected = 0;
    let totalDuplicates = 0;
    let totalErrors = 0;

    for (const source of activeSources) {
      stepStart(`Collecting from "${source.name}" (${source.type})`);
      const start = Date.now();
      const result = await collectFromSource(source.id);

      if (result.errors.length > 0) {
        stepFail(result.errors[0]);
        totalErrors += result.errors.length;
      } else {
        stepDone(Date.now() - start, `${result.collected} new, ${result.duplicates} dups`);
      }
      totalCollected += result.collected;
      totalDuplicates += result.duplicates;
    }

    divider();
    console.log(`\n${bold("Summary:")}`);
    console.log(`  ${green("Collected:")} ${totalCollected}`);
    console.log(`  ${yellow("Duplicates:")} ${totalDuplicates}`);
    if (totalErrors > 0) console.log(`  ${red("Errors:")} ${totalErrors}`);
  } else {
    const sourceId = validateUuid(sourceArg!.split("=")[1]!, "source ID");

    // Verify source exists
    const source = await db.query.sources.findFirst({
      where: eq(sources.id, sourceId),
    });

    if (!source) {
      error(`Source not found: ${sourceId}`);
      process.exit(1);
    }

    info(`Source: ${bold(source.name)} (${source.type})`);
    stepStart("Collecting");
    const start = Date.now();
    const result = await collectFromSource(sourceId);

    if (result.errors.length > 0) {
      stepFail();
      for (const e of result.errors) {
        error(e);
      }
    } else {
      stepDone(Date.now() - start);
    }

    console.log(`\n  ${green("Collected:")} ${result.collected}`);
    console.log(`  ${yellow("Duplicates:")} ${result.duplicates}`);
  }

  console.log("");
}
