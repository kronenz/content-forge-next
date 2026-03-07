import { generateText } from "ai";
import { getModel } from "./model";
import type { ResearchReport, AgentResult } from "./types";

interface ResearcherInput {
  topic: string;
  context?: string;
  analysisReport?: Record<string, unknown>;
}

export async function runResearcher(
  input: ResearcherInput,
): Promise<AgentResult<ResearchReport>> {
  const start = Date.now();

  const { text, usage } = await generateText({
    model: getModel(),
    system: `You are an expert research agent specializing in deep content research.
Your role is to find relevant sources, synthesize information, and identify key facts and data points.

You MUST respond with valid JSON matching this exact structure:
{
  "query": "the research query used",
  "sources": [
    {
      "title": "source title",
      "url": "source URL or reference",
      "relevance": "high|medium|low",
      "snippet": "key excerpt from the source"
    }
  ],
  "synthesis": "2-3 paragraph synthesis of findings",
  "key_facts": ["fact 1", "fact 2"],
  "data_points": [
    { "label": "metric name", "value": "metric value", "source": "where this came from" }
  ],
  "gaps": ["information gaps that couldn't be filled"]
}

Rules:
- Identify 3-8 relevant sources
- Synthesize findings into coherent narrative
- Extract concrete data points with attribution
- Be transparent about information gaps
- Focus on recent, authoritative sources`,
    prompt: `Research the following topic thoroughly.

Topic: ${input.topic}

${input.context ? `Context: ${input.context}` : ""}
${input.analysisReport ? `Analysis Report: ${JSON.stringify(input.analysisReport)}` : ""}

Respond with JSON only, no markdown fences.`,
  });

  const output = JSON.parse(text) as ResearchReport;

  return {
    role: "researcher",
    output,
    tokenUsage: { input: usage.inputTokens ?? 0, output: usage.outputTokens ?? 0 },
    durationMs: Date.now() - start,
  };
}
