import { db } from "@/lib/db";
import { sources, rawContents, pipelineRuns, processedContents, reviews, publications } from "@/server/db/schema";
import { count } from "drizzle-orm";
import { header, success, error, table, info, green, red } from "../lib/output";

export async function statusCommand() {
  header("Content Forge - System Status");

  // DB connection check
  try {
    const [srcCount] = await db.select({ count: count() }).from(sources);
    const [rawCount] = await db.select({ count: count() }).from(rawContents);
    const [runCount] = await db.select({ count: count() }).from(pipelineRuns);
    const [procCount] = await db.select({ count: count() }).from(processedContents);
    const [revCount] = await db.select({ count: count() }).from(reviews);
    const [pubCount] = await db.select({ count: count() }).from(publications);

    success(`Database: ${green("connected")}`);

    console.log("");
    table(
      ["Entity", "Count"],
      [
        ["Sources", String(srcCount?.count ?? 0)],
        ["Raw Contents", String(rawCount?.count ?? 0)],
        ["Pipeline Runs", String(runCount?.count ?? 0)],
        ["Processed Contents", String(procCount?.count ?? 0)],
        ["Reviews", String(revCount?.count ?? 0)],
        ["Publications", String(pubCount?.count ?? 0)],
      ],
    );
  } catch (err) {
    error(`Database: ${red("connection failed")} - ${err instanceof Error ? err.message : String(err)}`);
  }

  // Redis check
  try {
    const { getRedisConnectionOpts } = await import("@/server/queue/connection");
    const opts = getRedisConnectionOpts();
    info(`Redis: configured at ${opts.host}:${opts.port}`);
  } catch {
    error(`Redis: ${red("not configured")}`);
  }

  console.log("");
}
