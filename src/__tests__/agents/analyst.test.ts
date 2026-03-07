import { describe, it, expect, vi } from "vitest";
import type { AnalysisReport } from "@/server/agents/types";

const mockReport: AnalysisReport = {
  summary: "This article discusses AI automation trends in content marketing.",
  key_insights: [
    {
      insight: "AI content tools are growing 40% YoY",
      importance: "high",
      evidence: "According to the report, adoption has increased significantly",
    },
    {
      insight: "Human oversight remains critical",
      importance: "medium",
      evidence: "Quality drops without editorial review",
    },
  ],
  topics: ["AI", "content marketing", "automation"],
  sentiment: "positive",
  target_audience: "tech-savvy marketers and content creators",
  content_potential: {
    blog_post: "high",
    social_media: "medium",
    newsletter: "high",
  },
  recommended_angle: "Practical guide for marketers adopting AI tools",
  related_contexts: ["Rise of generative AI in 2024-2025"],
};

vi.mock("ai", () => ({
  generateText: vi.fn().mockResolvedValue({
    text: JSON.stringify(mockReport),
    usage: { inputTokens: 500, outputTokens: 300, totalTokens: 800 },
  }),
}));

vi.mock("@/server/agents/model", () => ({
  getModel: vi.fn().mockReturnValue("mock-model"),
}));

describe("runAnalyst", () => {
  it("should return a valid AnalysisReport", async () => {
    const { runAnalyst } = await import("@/server/agents/analyst");

    const result = await runAnalyst({
      title: "AI in Content Marketing",
      body: "AI is transforming how content is created and distributed...",
    });

    expect(result.role).toBe("analyst");
    expect(result.output.summary).toBeTruthy();
    expect(result.output.key_insights).toHaveLength(2);
    expect(result.output.key_insights[0]!.importance).toBe("high");
    expect(result.output.topics).toContain("AI");
    expect(result.output.sentiment).toBe("positive");
    expect(result.output.content_potential.blog_post).toBe("high");
    expect(result.tokenUsage.input).toBe(500);
    expect(result.tokenUsage.output).toBe(300);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });
});
