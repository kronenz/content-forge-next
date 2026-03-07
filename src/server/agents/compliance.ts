import { generateText } from "ai";
import { getModel } from "./model";
import type { ComplianceReport, AgentResult } from "./types";

interface ComplianceInput {
  title: string;
  body: string;
  platform: string;
  images?: string[];
}

export async function runCompliance(
  input: ComplianceInput,
): Promise<AgentResult<ComplianceReport>> {
  const start = Date.now();

  const { text, usage } = await generateText({
    model: getModel(),
    system: `You are a content compliance expert reviewing digital content for legal and policy risks.
Your role is to identify copyright, trademark, privacy, defamation, and regulatory issues.

You MUST respond with valid JSON matching this exact structure:
{
  "passed": true,
  "overall_risk": "low|medium|high",
  "issues": [
    {
      "type": "copyright|trademark|privacy|defamation|disclosure|regulation",
      "severity": "critical|warning|info",
      "description": "what the issue is",
      "location": "where in the content",
      "suggestion": "how to fix it"
    }
  ],
  "disclosures_needed": ["required disclosures (AI-generated, sponsored, etc.)"],
  "recommendations": ["general compliance improvements"]
}

Rules:
- Check for copyrighted material (long quotes, reproduced content)
- Identify trademark usage issues
- Flag personal information or privacy concerns
- Check for potentially defamatory statements
- Identify missing disclosures (AI-generated content, affiliates, etc.)
- Consider platform-specific content policies
- "passed" is false if any critical issues exist
- Be thorough but avoid false positives`,
    prompt: `Review the following content for compliance issues.

Title: ${input.title}
Platform: ${input.platform}
${input.images ? `Images: ${input.images.length} attached` : "No images"}

Content:
${input.body}

Respond with JSON only, no markdown fences.`,
  });

  const output = JSON.parse(text) as ComplianceReport;

  return {
    role: "compliance",
    output,
    tokenUsage: { input: usage.inputTokens ?? 0, output: usage.outputTokens ?? 0 },
    durationMs: Date.now() - start,
  };
}
