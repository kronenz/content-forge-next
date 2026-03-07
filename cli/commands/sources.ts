import { db } from "@/lib/db";
import { sources } from "@/server/db/schema";
import { desc } from "drizzle-orm";
import { header, table, info } from "../lib/output";

export async function sourcesCommand() {
  header("Registered Sources");

  const allSources = await db.select().from(sources).orderBy(desc(sources.createdAt));

  if (allSources.length === 0) {
    info("No sources registered yet.");
    return;
  }

  table(
    ["ID", "Name", "Type", "Active", "Schedule", "Group"],
    allSources.map((s) => [
      s.id.slice(0, 8) + "...",
      s.name,
      s.type,
      s.isActive ? "Yes" : "No",
      s.schedule ?? "-",
      s.groupName ?? "-",
    ]),
  );

  console.log(`\nTotal: ${allSources.length} sources`);
}
