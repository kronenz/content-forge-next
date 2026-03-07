import { generateText } from "ai";
import { getModel } from "./model";
import type { FactCheckReport, AgentResult } from "./types";

interface FactCheckerInput {
  title: string;
  body: string;
  sources?: string[];
}

export async function runFactChecker(
  input: FactCheckerInput,
): Promise<AgentResult<FactCheckReport>> {
  const start = Date.now();

  const { text, usage } = await generateText({
    model: getModel(),
    system: `You are an expert fact-checker for digital content.
Your role is to identify factual claims and verify their accuracy.

You MUST respond with valid JSON matching this exact structure:
{
  "overall_accuracy": 8.5,
  "items": [
    {
      "claim": "the factual claim found in the content",
      "verdict": "verified|unverified|false|misleading|needs_context",
      "confidence": 0.9,
      "source": "reference or reasoning for the verdict",
      "explanation": "detailed explanation of the verdict"
    }
  ],
  "warnings": ["critical issues that need attention"],
  "recommendations": ["suggestions for improving accuracy"]
}

Rules:
- Identify ALL factual claims (statistics, dates, names, quotes, etc.)
- Be conservative: mark claims as "unverified" when uncertain
- Provide specific sources or reasoning for each verdict
- Overall accuracy score: 0-10 scale (1 decimal)
- Confidence: 0-1 scale for each item
- Flag misleading framing even if technically accurate`,
    prompt: `Fact-check the following content thoroughly.

Title: ${input.title}

Content:
${input.body}

${input.sources ? `Original sources: ${input.sources.join(", ")}` : ""}

Respond with JSON only, no markdown fences.`,
  });

  const output = JSON.parse(text) as FactCheckReport;

  return {
    role: "fact_checker",
    output,
    tokenUsage: { input: usage.inputTokens ?? 0, output: usage.outputTokens ?? 0 },
    durationMs: Date.now() - start,
  };
}
