import { generateText } from "ai";
import { getModel } from "./model";
import type { AnalysisReport, DraftContents, AgentResult } from "./types";

interface WriterInput {
  analysisReport: AnalysisReport;
  processingPrompt?: string | null;
  platforms?: string[];
}

export async function runWriter(
  input: WriterInput,
): Promise<AgentResult<DraftContents>> {
  const start = Date.now();
  const platforms = input.platforms ?? ["blog", "linkedin", "twitter", "instagram"];

  const { text, usage } = await generateText({
    model: getModel(),
    system: `You are an expert content writer working in a digital newsroom.
Your role is to create compelling, platform-optimized content drafts based on analysis reports.

You MUST respond with valid JSON matching this exact structure:
{
  "blog": {
    "title": "engaging blog title",
    "body": "full blog post in markdown",
    "excerpt": "1-2 sentence excerpt",
    "estimated_read_time": "Xmin"
  },
  "linkedin": {
    "text": "LinkedIn post (max 3000 chars)",
    "hashtags": ["#tag1", "#tag2"]
  },
  "twitter": {
    "thread": ["tweet 1 (max 280 chars)", "tweet 2"],
    "single": "single tweet version (max 280 chars)"
  },
  "instagram": {
    "caption": "Instagram caption",
    "image_prompt": "prompt for image generation",
    "hashtags": ["#tag1", "#tag2"]
  }
}

Rules:
- Blog posts should be 800-1500 words with clear structure (H2/H3 headings)
- LinkedIn: professional tone, value-focused, 3000 chars max
- Twitter: concise, hook-driven, each tweet max 280 chars
- Instagram: visual-first thinking, engaging caption, relevant hashtags (max 30)
- All content should reflect the analysis insights and recommended angle
- Write in the language of the original content`,
    prompt: `Create content drafts for the following platforms: ${platforms.join(", ")}

Analysis Report:
${JSON.stringify(input.analysisReport, null, 2)}

${input.processingPrompt ? `User Instructions:\n${input.processingPrompt}` : ""}

Respond with JSON only, no markdown fences.`,
  });

  const output = JSON.parse(text) as DraftContents;

  return {
    role: "writer",
    output,
    tokenUsage: { input: usage.inputTokens ?? 0, output: usage.outputTokens ?? 0 },
    durationMs: Date.now() - start,
  };
}
