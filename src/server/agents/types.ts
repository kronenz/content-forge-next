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

// ============================================================
// Research Agent
// ============================================================

export interface ResearchSource {
  title: string;
  url: string;
  relevance: "high" | "medium" | "low";
  snippet: string;
}

export interface ResearchReport {
  query: string;
  sources: ResearchSource[];
  synthesis: string;
  key_facts: string[];
  data_points: { label: string; value: string; source: string }[];
  gaps: string[];
}

// ============================================================
// SEO Optimizer Agent
// ============================================================

export interface SEOKeyword {
  keyword: string;
  search_volume: "high" | "medium" | "low";
  difficulty: "high" | "medium" | "low";
  placement: string;
}

export interface SEOReport {
  meta_title: string;
  meta_description: string;
  primary_keyword: string;
  secondary_keywords: string[];
  keyword_analysis: SEOKeyword[];
  content_suggestions: string[];
  readability_score: number;
  seo_score: number;
  internal_links: string[];
  schema_markup: string;
}

// ============================================================
// Fact Checker Agent
// ============================================================

export interface FactCheckItem {
  claim: string;
  verdict: "verified" | "unverified" | "false" | "misleading" | "needs_context";
  confidence: number;
  source: string;
  explanation: string;
}

export interface FactCheckReport {
  overall_accuracy: number;
  items: FactCheckItem[];
  warnings: string[];
  recommendations: string[];
}

// ============================================================
// Compliance Agent
// ============================================================

export interface ComplianceIssue {
  type: "copyright" | "trademark" | "privacy" | "defamation" | "disclosure" | "regulation";
  severity: "critical" | "warning" | "info";
  description: string;
  location: string;
  suggestion: string;
}

export interface ComplianceReport {
  passed: boolean;
  overall_risk: "low" | "medium" | "high";
  issues: ComplianceIssue[];
  disclosures_needed: string[];
  recommendations: string[];
}

// ============================================================
// Agent common types
// ============================================================

export type AgentRole =
  | "analyst"
  | "writer"
  | "editor"
  | "platform_formatter"
  | "researcher"
  | "seo_optimizer"
  | "fact_checker"
  | "compliance";

export interface AgentResult<T> {
  role: AgentRole;
  output: T;
  tokenUsage: { input: number; output: number };
  durationMs: number;
}
