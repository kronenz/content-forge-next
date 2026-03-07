import { load, type Cheerio } from "cheerio";
import type { Element } from "domhandler";
import type { CollectedItem, CollectResult } from "./base-collector";

export interface WebScrapingConfig {
  selectors: {
    container?: string;
    title?: string;
    body: string;
    url?: string;
    author?: string;
    date?: string;
    image?: string;
  };
}

const DEFAULT_CONFIG: WebScrapingConfig = {
  selectors: {
    title: "h1, h2, .title, [class*='title']",
    body: "article, .content, .post-body, main, .entry-content",
    author: ".author, [rel='author'], .byline",
    date: "time[datetime], .date, .published",
    image: "article img, .content img, .featured-image img",
  },
};

export async function collectWeb(
  url: string,
  config?: Partial<WebScrapingConfig>,
  filters?: { keywords?: string[]; exclude?: string[] },
): Promise<CollectResult> {
  const items: CollectedItem[] = [];
  const errors: string[] = [];
  const cfg = { ...DEFAULT_CONFIG, ...config };

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ContentForge/1.0; +https://contentforge.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      errors.push(`HTTP ${response.status} for ${url}`);
      return { items, errors };
    }

    const html = await response.text();
    const $ = load(html);

    // Remove script/style tags
    $("script, style, nav, footer, header, aside").remove();

    const selectors = cfg.selectors;

    if (selectors.container) {
      $(selectors.container).each((_, el) => {
        const item = extractItem($(el) as Cheerio<Element>, selectors, url);
        if (item && matchesFilters(item, filters)) {
          items.push(item);
        }
      });
    } else {
      const item = extractItem($("body") as Cheerio<Element>, selectors, url);
      if (item && matchesFilters(item, filters)) {
        items.push(item);
      }
    }
  } catch (err) {
    errors.push(
      `Web scraping failed for ${url}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return { items, errors };
}

function extractItem(
  context: Cheerio<Element>,
  selectors: WebScrapingConfig["selectors"],
  pageUrl: string,
): CollectedItem | null {
  const body = selectors.body
    ? context.find(selectors.body).first().text().trim() ||
      context.text().trim()
    : context.text().trim();

  if (!body || body.length < 50) return null;

  const title = selectors.title
    ? context.find(selectors.title).first().text().trim() || null
    : null;

  const author = selectors.author
    ? context.find(selectors.author).first().text().trim() || null
    : null;

  const dateEl = selectors.date
    ? context.find(selectors.date).first()
    : null;
  const dateStr =
    dateEl?.attr("datetime") || dateEl?.text().trim() || null;
  const publishedAt = dateStr ? new Date(dateStr) : null;

  const linkEl = selectors.url
    ? context.find(selectors.url).first()
    : null;
  const itemUrl = linkEl?.attr("href") || pageUrl;

  const imageUrl = selectors.image
    ? context.find(selectors.image).first().attr("src") || null
    : null;

  return {
    title,
    body,
    url: resolveUrl(itemUrl, pageUrl),
    author,
    publishedAt: publishedAt && !isNaN(publishedAt.getTime()) ? publishedAt : null,
    imageUrl: imageUrl ? resolveUrl(imageUrl, pageUrl) : null,
    metadata: { scrapedFrom: pageUrl },
  };
}

function resolveUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

function matchesFilters(
  item: CollectedItem,
  filters?: { keywords?: string[]; exclude?: string[] },
): boolean {
  if (!filters) return true;

  const text = `${item.title || ""} ${item.body}`.toLowerCase();

  if (filters.keywords?.length) {
    if (!filters.keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return false;
    }
  }

  if (filters.exclude?.length) {
    if (filters.exclude.some((ex) => text.includes(ex.toLowerCase()))) {
      return false;
    }
  }

  return true;
}
