// Agent input/output types based on PRD 03-ai-agent-pipeline.md YAML specs

// ============================================================
// Analyst Agent
// ============================================================

export interface KeyInsight {
  insight: string;
  importance: "high" | "medium" | "low";
  evidence: string;
}

export interface ContentPotential {
  blog_post: "high" | "medium" | "low";
  social_media: "high" | "medium" | "low";
  newsletter: "high" | "medium" | "low";
}

export interface AnalysisReport {
  summary: string;
  key_insights: KeyInsight[];
  topics: string[];
  sentiment: "positive" | "negative" | "neutral" | "mixed";
  target_audience: string;
  content_potential: ContentPotential;
  recommended_angle: string;
  related_contexts: string[];
}

// ============================================================
// Writer Agent
// ============================================================

export interface BlogDraft {
  title: string;
  body: string;
  excerpt: string;
  estimated_read_time: string;
}

export interface LinkedInDraft {
  text: string;
  hashtags: string[];
}

export interface TwitterDraft {
  thread: string[];
  single: string;
}

export interface InstagramDraft {
  caption: string;
  image_prompt: string;
  hashtags: string[];
}

export interface DraftContents {
  blog: BlogDraft;
  linkedin: LinkedInDraft;
  twitter: TwitterDraft;
  instagram: InstagramDraft;
}

// ============================================================
// Editor Agent
// ============================================================

export interface EditChange {
  location: string;
  type: "clarity" | "grammar" | "tone" | "structure" | "engagement" | "accuracy";
  before: string;
  after: string;
  reason: string;
}

export interface QualityScores {
  readability: number;
  engagement: number;
  accuracy: number;
  tone_consistency: number;
  platform_fit: number;
}

export interface EditReport {
  changes_made: EditChange[];
  quality_scores: QualityScores;
  suggestions: string[];
}

export interface EditedContents {
  blog: BlogDraft;
  linkedin: LinkedInDraft;
  twitter: TwitterDraft;
  instagram: InstagramDraft;
}

// ============================================================
// Platform Formatter Agent
// ============================================================

export interface FormattedBlog {
  title: string;
  body: string;
  excerpt: string;
  estimated_read_time: string;
  slug: string;
}

export interface FormattedLinkedIn {
  text: string;
  character_count: number;
}

export interface FormattedTwitter {
  thread: string[];
  single: string;
  character_counts: number[];
}

export interface FormattedInstagram {
  caption: string;
  hashtags: string[];
  character_count: number;
}

export interface FormattedContents {
  blog: FormattedBlog;
  linkedin: FormattedLinkedIn;
  twitter: FormattedTwitter;
  instagram: FormattedInstagram;
}

// ============================================================
// Agent common types
// ============================================================

export type AgentRole = "analyst" | "writer" | "editor" | "platform_formatter";

export interface AgentResult<T> {
  role: AgentRole;
  output: T;
  tokenUsage: { input: number; output: number };
  durationMs: number;
}
