import { generateText } from "ai";
import { getModel } from "./model";
import type { AnalysisReport, AgentResult } from "./types";

interface AnalystInput {
  title: string | null;
  body: string;
  metadata?: Record<string, unknown>;
}

export async function runAnalyst(
  input: AnalystInput,
): Promise<AgentResult<AnalysisReport>> {
  const start = Date.now();

  const { text, usage } = await generateText({
    model: getModel(),
    system: `You are an expert content analyst working in a digital newsroom.
Your role is to analyze raw content and extract key insights for content creation.

You MUST respond with valid JSON matching this exact structure:
{
  "summary": "2-3 sentence core summary",
  "key_insights": [
    { "insight": "...", "importance": "high|medium|low", "evidence": "quote from source" }
  ],
  "topics": ["topic1", "topic2"],
  "sentiment": "positive|negative|neutral|mixed",
  "target_audience": "description of ideal audience",
  "content_potential": {
    "blog_post": "high|medium|low",
    "social_media": "high|medium|low",
    "newsletter": "high|medium|low"
  },
  "recommended_angle": "suggested perspective for content",
  "related_contexts": ["connections to broader trends"]
}

Rules:
- Extract 3-5 key insights with evidence from the source
- Be specific about target audience
- Evaluate content potential honestly
- Suggest a unique angle that adds value beyond the original`,
    prompt: `Analyze the following content and produce a structured analysis report.

Title: ${input.title ?? "(untitled)"}

Content:
${input.body}

${input.metadata ? `Metadata: ${JSON.stringify(input.metadata)}` : ""}

Respond with JSON only, no markdown fences.`,
  });

  const output = JSON.parse(text) as AnalysisReport;

  return {
    role: "analyst",
    output,
    tokenUsage: { input: usage.inputTokens ?? 0, output: usage.outputTokens ?? 0 },
    durationMs: Date.now() - start,
  };
}
