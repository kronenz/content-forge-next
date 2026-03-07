import { generateText } from "ai";
import { getModel } from "./model";
import type { EditedContents, FormattedContents, AgentResult } from "./types";

interface FormatterInput {
  edited: EditedContents;
}

export async function runFormatter(
  input: FormatterInput,
): Promise<AgentResult<FormattedContents>> {
  const start = Date.now();

  const { text, usage } = await generateText({
    model: getModel(),
    system: `You are a platform formatting specialist.
Your role is to convert edited content into platform-ready formats with strict compliance to each platform's requirements.

You MUST respond with valid JSON matching this exact structure:
{
  "blog": {
    "title": "SEO-friendly title",
    "body": "full markdown body with proper heading hierarchy",
    "excerpt": "meta description length excerpt (150-160 chars)",
    "estimated_read_time": "Xmin",
    "slug": "url-friendly-slug"
  },
  "linkedin": {
    "text": "final LinkedIn post with line breaks and formatting",
    "character_count": 1234
  },
  "twitter": {
    "thread": ["tweet 1", "tweet 2"],
    "single": "single tweet",
    "character_counts": [120, 95]
  },
  "instagram": {
    "caption": "final caption with line breaks",
    "hashtags": ["#tag1", "#tag2"],
    "character_count": 567
  }
}

Platform constraints:
- Blog: proper markdown, H1 for title only, H2/H3 for sections, slug in kebab-case
- LinkedIn: max 3000 chars, line breaks for readability, hashtags at end, no markdown
- Twitter: max 280 chars per tweet, thread numbered (1/N format if >1), no hashtags in thread
- Instagram: max 2200 chars caption, max 30 hashtags, line breaks between sections

Rules:
- Enforce character limits strictly (truncate if needed)
- Add proper line breaks and spacing for each platform
- Generate URL-friendly slug from blog title
- Count characters accurately
- Format hashtags consistently`,
    prompt: `Format the following edited content for each platform, enforcing all platform constraints.

Edited Content:
${JSON.stringify(input.edited, null, 2)}

Respond with JSON only, no markdown fences.`,
  });

  const output = JSON.parse(text) as FormattedContents;

  return {
    role: "platform_formatter",
    output,
    tokenUsage: { input: usage.inputTokens ?? 0, output: usage.outputTokens ?? 0 },
    durationMs: Date.now() - start,
  };
}
