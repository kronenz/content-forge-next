import { describe, it, expect, vi } from "vitest";
import type { AnalysisReport, DraftContents } from "@/server/agents/types";

const mockDrafts: DraftContents = {
  blog: {
    title: "How AI is Revolutionizing Content Marketing",
    body: "## Introduction\n\nAI tools are changing the game...",
    excerpt: "Discover how AI automation is transforming content marketing.",
    estimated_read_time: "5min",
  },
  linkedin: {
    text: "AI is transforming content marketing. Here's what you need to know...",
    hashtags: ["#AI", "#ContentMarketing"],
  },
  twitter: {
    thread: [
      "AI is changing content marketing forever. A thread 🧵",
      "1/ Content creation tools powered by AI are growing 40% YoY",
    ],
    single: "AI content tools are growing 40% YoY. The future of marketing is here.",
  },
  instagram: {
    caption: "The future of content is AI-powered ✨",
    image_prompt: "Futuristic workspace with AI holographic displays",
    hashtags: ["#ai", "#contentmarketing", "#tech"],
  },
};

vi.mock("ai", () => ({
  generateText: vi.fn().mockResolvedValue({
    text: JSON.stringify(mockDrafts),
    usage: { inputTokens: 800, outputTokens: 1200, totalTokens: 2000 },
  }),
}));

vi.mock("@/server/agents/model", () => ({
  getModel: vi.fn().mockReturnValue("mock-model"),
}));

const analysisReport: AnalysisReport = {
  summary: "AI content tools are rapidly growing.",
  key_insights: [{ insight: "40% YoY growth", importance: "high", evidence: "report data" }],
  topics: ["AI"],
  sentiment: "positive",
  target_audience: "marketers",
  content_potential: { blog_post: "high", social_media: "medium", newsletter: "high" },
  recommended_angle: "practical guide",
  related_contexts: [],
};

describe("runWriter", () => {
  it("should return valid DraftContents for all platforms", async () => {
    const { runWriter } = await import("@/server/agents/writer");

    const result = await runWriter({ analysisReport });

    expect(result.role).toBe("writer");
    expect(result.output.blog.title).toBeTruthy();
    expect(result.output.blog.body).toContain("##");
    expect(result.output.linkedin.text).toBeTruthy();
    expect(result.output.linkedin.hashtags.length).toBeGreaterThan(0);
    expect(result.output.twitter.thread.length).toBeGreaterThan(0);
    expect(result.output.twitter.single).toBeTruthy();
    expect(result.output.instagram.caption).toBeTruthy();
    expect(result.output.instagram.image_prompt).toBeTruthy();
    expect(result.tokenUsage.input).toBe(800);
    expect(result.tokenUsage.output).toBe(1200);
  });
});
