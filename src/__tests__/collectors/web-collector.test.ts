import { describe, it, expect, vi, beforeEach } from "vitest";
import { collectWeb } from "@/server/collectors/web-collector";

describe("collectWeb", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should handle HTTP errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    const result = await collectWeb("https://example.com/notfound");
    expect(result.items).toHaveLength(0);
    expect(result.errors).toContain("HTTP 404 for https://example.com/notfound");
  });

  it("should extract content from HTML", async () => {
    const html = `
      <html>
        <body>
          <article>
            <h1>Test Article Title</h1>
            <div class="content">
              This is a test article with enough content to pass the minimum length check for extraction purposes.
            </div>
            <span class="author">John Doe</span>
            <time datetime="2026-01-01T00:00:00Z">Jan 1, 2026</time>
          </article>
        </body>
      </html>
    `;

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(html),
      }),
    );

    const result = await collectWeb("https://example.com/article");
    expect(result.errors).toHaveLength(0);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]!.title).toBe("Test Article Title");
    expect(result.items[0]!.author).toBe("John Doe");
  });

  it("should skip content shorter than 50 chars", async () => {
    const html = `<html><body><p>Short</p></body></html>`;

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(html),
      }),
    );

    const result = await collectWeb("https://example.com/short");
    expect(result.items).toHaveLength(0);
  });

  it("should apply keyword filters", async () => {
    const html = `
      <html><body>
        <article>
          <h1>Machine Learning Guide</h1>
          <div class="content">
            This is a comprehensive guide about machine learning and deep neural networks with plenty of content.
          </div>
        </article>
      </body></html>
    `;

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(html),
      }),
    );

    const noMatch = await collectWeb("https://example.com", undefined, {
      keywords: ["blockchain"],
    });
    expect(noMatch.items).toHaveLength(0);

    const match = await collectWeb("https://example.com", undefined, {
      keywords: ["machine learning"],
    });
    expect(match.items).toHaveLength(1);
  });

  it("should handle network errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error")),
    );

    const result = await collectWeb("https://example.com");
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain("Network error");
  });
});
