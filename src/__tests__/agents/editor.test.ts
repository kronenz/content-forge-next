import { describe, it, expect, vi } from "vitest";
import type { DraftContents } from "@/server/agents/types";

const mockEditorOutput = {
  edited: {
    blog: {
      title: "How AI is Revolutionizing Content Marketing in 2025",
      body: "## Introduction\n\nAI-powered tools are transforming the game...",
      excerpt: "Discover how AI automation is reshaping content marketing strategies.",
      estimated_read_time: "5min",
    },
    linkedin: {
      text: "AI is transforming content marketing—here's what every marketer needs to know.",
      hashtags: ["#AI", "#ContentMarketing", "#MarTech"],
    },
    twitter: {
      thread: [
        "AI is changing content marketing forever. A thread 🧵",
        "1/ AI-powered content tools are growing 40% year over year",
      ],
      single: "AI content tools are growing 40% YoY. The future of marketing is already here.",
    },
    instagram: {
      caption: "The future of content is AI-powered ✨\n\nSwipe to learn more →",
      image_prompt: "Futuristic workspace with AI holographic displays, clean minimal style",
      hashtags: ["#ai", "#contentmarketing", "#tech"],
    },
  },
  report: {
    changes_made: [
      {
        location: "blog.title",
        type: "engagement",
        before: "How AI is Revolutionizing Content Marketing",
        after: "How AI is Revolutionizing Content Marketing in 2025",
        reason: "Added year for timeliness and SEO",
      },
    ],
    quality_scores: {
      readability: 8.5,
      engagement: 7.5,
      accuracy: 9.0,
      tone_consistency: 8.0,
      platform_fit: 8.5,
    },
    suggestions: [
      "Add a stronger call-to-action at the end of the blog post",
      "Consider adding statistics to the LinkedIn post",
    ],
  },
};

vi.mock("ai", () => ({
  generateText: vi.fn().mockResolvedValue({
    text: JSON.stringify(mockEditorOutput),
    usage: { inputTokens: 1500, outputTokens: 2000, totalTokens: 3500 },
  }),
}));

vi.mock("@/server/agents/model", () => ({
  getModel: vi.fn().mockReturnValue("mock-model"),
}));

const mockDrafts: DraftContents = {
  blog: { title: "Test", body: "Content", excerpt: "Excerpt", estimated_read_time: "3min" },
  linkedin: { text: "Post", hashtags: ["#test"] },
  twitter: { thread: ["tweet"], single: "tweet" },
  instagram: { caption: "Cap", image_prompt: "prompt", hashtags: ["#test"] },
};

describe("runEditor", () => {
  it("should return edited contents and quality report", async () => {
    const { runEditor } = await import("@/server/agents/editor");

    const result = await runEditor({ drafts: mockDrafts });

    expect(result.role).toBe("editor");
    expect(result.output.edited.blog.title).toBeTruthy();
    expect(result.output.report.changes_made.length).toBeGreaterThan(0);
    expect(result.output.report.quality_scores.readability).toBeGreaterThanOrEqual(0);
    expect(result.output.report.quality_scores.readability).toBeLessThanOrEqual(10);
    expect(result.output.report.quality_scores.engagement).toBeGreaterThanOrEqual(0);
    expect(result.output.report.quality_scores.accuracy).toBeGreaterThanOrEqual(0);
    expect(result.output.report.quality_scores.tone_consistency).toBeGreaterThanOrEqual(0);
    expect(result.output.report.quality_scores.platform_fit).toBeGreaterThanOrEqual(0);
    expect(result.output.report.suggestions.length).toBeGreaterThan(0);
  });
});
