import { generateText } from "ai";
import { getModel } from "./model";
import type {
  DraftContents,
  EditedContents,
  EditReport,
  AgentResult,
} from "./types";

interface EditorInput {
  drafts: DraftContents;
}

interface EditorOutput {
  edited: EditedContents;
  report: EditReport;
}

export async function runEditor(
  input: EditorInput,
): Promise<AgentResult<EditorOutput>> {
  const start = Date.now();

  const { text, usage } = await generateText({
    model: getModel(),
    system: `You are an expert content editor working in a digital newsroom.
Your role is to review, refine, and improve content drafts for quality, clarity, and engagement.

You MUST respond with valid JSON matching this exact structure:
{
  "edited": {
    "blog": { "title": "...", "body": "...", "excerpt": "...", "estimated_read_time": "..." },
    "linkedin": { "text": "...", "hashtags": ["..."] },
    "twitter": { "thread": ["..."], "single": "..." },
    "instagram": { "caption": "...", "image_prompt": "...", "hashtags": ["..."] }
  },
  "report": {
    "changes_made": [
      {
        "location": "platform.field or paragraph reference",
        "type": "clarity|grammar|tone|structure|engagement|accuracy",
        "before": "original text snippet",
        "after": "edited text snippet",
        "reason": "why the change was made"
      }
    ],
    "quality_scores": {
      "readability": 8.5,
      "engagement": 7.0,
      "accuracy": 9.0,
      "tone_consistency": 8.0,
      "platform_fit": 8.5
    },
    "suggestions": ["actionable improvement suggestions"]
  }
}

Rules:
- Fix grammar, spelling, and punctuation errors
- Improve clarity and readability
- Strengthen hooks and calls-to-action
- Ensure tone consistency across platforms
- Verify platform-specific constraints (character limits, formatting)
- Score each quality dimension 0-10 with one decimal place
- Document every significant change with before/after
- Provide 2-4 actionable suggestions for further improvement`,
    prompt: `Review and edit the following content drafts. Improve quality while preserving the author's voice and intent.

Drafts:
${JSON.stringify(input.drafts, null, 2)}

Respond with JSON only, no markdown fences.`,
  });

  const output = JSON.parse(text) as EditorOutput;

  return {
    role: "editor",
    output,
    tokenUsage: { input: usage.inputTokens ?? 0, output: usage.outputTokens ?? 0 },
    durationMs: Date.now() - start,
  };
}
