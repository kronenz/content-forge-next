import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sources, rawContents } from "@/server/db/schema";
import { generateContentHash } from "./base-collector";
import { collectRSS } from "./rss-collector";
import { collectWeb } from "./web-collector";
import type { CollectedItem } from "./base-collector";
import type { WebScrapingConfig } from "./web-collector";

export type { CollectedItem, CollectResult } from "./base-collector";
export { collectRSS } from "./rss-collector";
export { collectWeb } from "./web-collector";

export interface CollectSourceResult {
  sourceId: string;
  collected: number;
  duplicates: number;
  errors: string[];
}

export async function collectFromSource(
  sourceId: string,
): Promise<CollectSourceResult> {
  const source = await db.query.sources.findFirst({
    where: eq(sources.id, sourceId),
  });

  if (!source) {
    return { sourceId, collected: 0, duplicates: 0, errors: ["Source not found"] };
  }

  const filters = source.filters as
    | { keywords?: string[]; exclude?: string[] }
    | undefined;

  let items: CollectedItem[] = [];
  let errors: string[] = [];

  switch (source.type) {
    case "rss": {
      if (!source.url) {
        errors.push("RSS source requires a URL");
        break;
      }
      const result = await collectRSS(source.url, filters ?? undefined);
      items = result.items;
      errors = result.errors;
      break;
    }
    case "web": {
      if (!source.url) {
        errors.push("Web source requires a URL");
        break;
      }
      const config = source.config as Partial<WebScrapingConfig> | undefined;
      const result = await collectWeb(
        source.url,
        config ?? undefined,
        filters ?? undefined,
      );
      items = result.items;
      errors = result.errors;
      break;
    }
    default:
      errors.push(`Collector for type "${source.type}" is not yet implemented`);
  }

  let collected = 0;
  let duplicates = 0;

  for (const item of items) {
    const hash = generateContentHash(
      `${item.url || ""}:${item.title || ""}:${item.body}`,
    );

    try {
      await db.insert(rawContents).values({
        sourceId: source.id,
        title: item.title,
        body: item.body,
        hash,
        metadata: {
          url: item.url,
          author: item.author,
          publishedAt: item.publishedAt?.toISOString(),
          imageUrl: item.imageUrl,
          ...item.metadata,
        },
      });
      collected++;
    } catch (err) {
      // Unique constraint violation = duplicate
      if (
        err instanceof Error &&
        err.message.includes("raw_contents_hash_idx")
      ) {
        duplicates++;
      } else {
        errors.push(
          `Failed to save item "${item.title}": ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
  }

  return { sourceId, collected, duplicates, errors };
}
