import { generateText } from "ai";
import { getModel } from "./model";
import type { SEOReport, AgentResult } from "./types";

interface SEOOptimizerInput {
  title: string;
  body: string;
  platform: string;
  tags?: string[];
}

export async function runSEOOptimizer(
  input: SEOOptimizerInput,
): Promise<AgentResult<SEOReport>> {
  const start = Date.now();

  const { text, usage } = await generateText({
    model: getModel(),
    system: `You are an expert SEO optimizer for digital content.
Your role is to analyze content and provide comprehensive SEO recommendations.

You MUST respond with valid JSON matching this exact structure:
{
  "meta_title": "optimized title (50-60 chars)",
  "meta_description": "compelling description (150-160 chars)",
  "primary_keyword": "main target keyword",
  "secondary_keywords": ["keyword1", "keyword2"],
  "keyword_analysis": [
    {
      "keyword": "keyword",
      "search_volume": "high|medium|low",
      "difficulty": "high|medium|low",
      "placement": "where to use this keyword"
    }
  ],
  "content_suggestions": ["suggestion for SEO improvement"],
  "readability_score": 8.5,
  "seo_score": 7.5,
  "internal_links": ["suggested internal link topics"],
  "schema_markup": "recommended schema type (Article, HowTo, etc.)"
}

Rules:
- Optimize for both search engines and human readers
- Suggest natural keyword placement, not keyword stuffing
- Score readability and SEO on 0-10 scale (1 decimal)
- Provide actionable suggestions
- Consider platform-specific SEO (blog vs social)`,
    prompt: `Analyze and optimize the following content for SEO.

Title: ${input.title}
Platform: ${input.platform}
${input.tags ? `Tags: ${input.tags.join(", ")}` : ""}

Content:
${input.body}

Respond with JSON only, no markdown fences.`,
  });

  const output = JSON.parse(text) as SEOReport;

  return {
    role: "seo_optimizer",
    output,
    tokenUsage: { input: usage.inputTokens ?? 0, output: usage.outputTokens ?? 0 },
    durationMs: Date.now() - start,
  };
}
