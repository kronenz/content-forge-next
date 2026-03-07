import { describe, it, expect, vi } from "vitest";
import type { EditedContents, FormattedContents } from "@/server/agents/types";

const mockFormatted: FormattedContents = {
  blog: {
    title: "How AI is Revolutionizing Content Marketing in 2025",
    body: "## Introduction\n\nAI-powered tools are transforming...",
    excerpt: "Discover how AI automation is reshaping content marketing strategies in 2025.",
    estimated_read_time: "5min",
    slug: "how-ai-is-revolutionizing-content-marketing-in-2025",
  },
  linkedin: {
    text: "AI is transforming content marketing.\n\nHere's what every marketer needs to know.\n\n#AI #ContentMarketing #MarTech",
    character_count: 112,
  },
  twitter: {
    thread: [
      "1/3 AI is changing content marketing forever 🧵",
      "2/3 AI-powered content tools are growing 40% year over year",
      "3/3 The future of marketing is already here",
    ],
    single: "AI content tools are growing 40% YoY. The future of marketing is already here.",
    character_counts: [48, 59, 44],
  },
  instagram: {
    caption: "The future of content is AI-powered ✨\n\nSwipe to learn more →",
    hashtags: ["#ai", "#contentmarketing", "#tech", "#martech"],
    character_count: 62,
  },
};

vi.mock("ai", () => ({
  generateText: vi.fn().mockResolvedValue({
    text: JSON.stringify(mockFormatted),
    usage: { inputTokens: 1000, outputTokens: 800, totalTokens: 1800 },
  }),
}));

vi.mock("@/server/agents/model", () => ({
  getModel: vi.fn().mockReturnValue("mock-model"),
}));

const mockEdited: EditedContents = {
  blog: { title: "Test", body: "Content", excerpt: "Excerpt", estimated_read_time: "3min" },
  linkedin: { text: "Post", hashtags: ["#test"] },
  twitter: { thread: ["tweet"], single: "tweet" },
  instagram: { caption: "Cap", image_prompt: "prompt", hashtags: ["#test"] },
};

describe("runFormatter", () => {
  it("should return platform-formatted contents", async () => {
    const { runFormatter } = await import("@/server/agents/formatter");

    const result = await runFormatter({ edited: mockEdited });

    expect(result.role).toBe("platform_formatter");
    expect(result.output.blog.slug).toBeTruthy();
    expect(result.output.blog.slug).toMatch(/^[a-z0-9-]+$/);
    expect(result.output.linkedin.character_count).toBeGreaterThan(0);
    expect(result.output.twitter.thread.length).toBe(result.output.twitter.character_counts.length);
    expect(result.output.twitter.single.length).toBeLessThanOrEqual(280);
    expect(result.output.instagram.hashtags.length).toBeLessThanOrEqual(30);
    expect(result.tokenUsage.input).toBe(1000);
    expect(result.tokenUsage.output).toBe(800);
  });
});
