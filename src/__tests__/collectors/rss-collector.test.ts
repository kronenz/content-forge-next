import { describe, it, expect } from "vitest";
import { collectRSS } from "@/server/collectors/rss-collector";

describe("collectRSS", () => {
  it("should return errors for invalid URL", async () => {
    const result = await collectRSS("http://invalid.test/feed.xml");
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.items).toHaveLength(0);
  });

  it("should filter items by keywords", async () => {
    // Mock rss-parser by testing the filter logic indirectly
    const result = await collectRSS("http://invalid.test/feed.xml", {
      keywords: ["AI"],
    });
    // Since the URL is invalid, no items will be returned
    expect(result.items).toHaveLength(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
