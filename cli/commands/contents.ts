import { db } from "@/lib/db";
import { rawContents } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { header, table, info, dim } from "../lib/output";

export async function contentsCommand(args: string[]) {
  header("Recent Raw Contents");

  const limitArg = args.find(a => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1]!, 10) : 20;

  const contents = await db.query.rawContents.findMany({
    orderBy: [desc(rawContents.collectedAt)],
    limit,
    with: { source: true },
  });

  if (contents.length === 0) {
    info("No contents collected yet.");
    return;
  }

  table(
    ["ID", "Source", "Title", "Collected At"],
    contents.map((c) => [
      c.id.slice(0, 8) + "...",
      (c.source as { name: string })?.name ?? "-",
      (c.title ?? "(untitled)").slice(0, 40) + ((c.title ?? "").length > 40 ? "..." : ""),
      c.collectedAt.toISOString().slice(0, 19).replace("T", " "),
    ]),
  );

  console.log(`\n${dim(`Showing ${contents.length} of total (use --limit=N to change)`)}`);
}
