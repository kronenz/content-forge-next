import RSSParser from "rss-parser";
import type { CollectedItem, CollectResult } from "./base-collector";

const parser = new RSSParser({
  timeout: 30_000,
  headers: {
    "User-Agent": "ContentForge/1.0",
  },
});

export async function collectRSS(
  url: string,
  filters?: { keywords?: string[]; exclude?: string[] },
): Promise<CollectResult> {
  const items: CollectedItem[] = [];
  const errors: string[] = [];

  try {
    const feed = await parser.parseURL(url);

    for (const entry of feed.items) {
      const body =
        entry["content:encoded"] || entry.content || entry.summary || "";
      if (!body) continue;

      if (filters && !matchesFilters(entry.title || "", body, filters)) {
        continue;
      }

      items.push({
        title: entry.title || null,
        body,
        url: entry.link || null,
        author: entry.creator || entry.author || null,
        publishedAt: entry.isoDate ? new Date(entry.isoDate) : null,
        imageUrl: extractImageUrl(entry) || null,
        metadata: {
          feedTitle: feed.title,
          feedUrl: url,
          categories: entry.categories || [],
          guid: entry.guid || entry.id || null,
        },
      });
    }
  } catch (err) {
    errors.push(
      `RSS fetch failed for ${url}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return { items, errors };
}

function matchesFilters(
  title: string,
  body: string,
  filters: { keywords?: string[]; exclude?: string[] },
): boolean {
  const text = `${title} ${body}`.toLowerCase();

  if (filters.keywords?.length) {
    const hasKeyword = filters.keywords.some((kw) =>
      text.includes(kw.toLowerCase()),
    );
    if (!hasKeyword) return false;
  }

  if (filters.exclude?.length) {
    const hasExcluded = filters.exclude.some((ex) =>
      text.includes(ex.toLowerCase()),
    );
    if (hasExcluded) return false;
  }

  return true;
}

function extractImageUrl(
  entry: Record<string, unknown>,
): string | undefined {
  const enclosure = entry.enclosure as
    | { url?: string; type?: string }
    | undefined;
  if (enclosure?.url && enclosure.type?.startsWith("image/")) {
    return enclosure.url;
  }

  const content = (entry["content:encoded"] || entry.content || "") as string;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/);
  return imgMatch?.[1];
}
