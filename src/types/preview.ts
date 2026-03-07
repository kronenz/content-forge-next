export interface PreviewContent {
  title: string;
  body: string;
  summary?: string;
  tags?: string[];
  images?: string[];
  platform: "blog" | "linkedin" | "twitter" | "instagram";
}

export interface PreviewAuthor {
  name: string;
  handle?: string;
  avatar?: string;
  title?: string;
}

export interface PreviewProps {
  content: PreviewContent;
  author?: PreviewAuthor;
}

export type Viewport = "desktop" | "tablet" | "mobile";
export type Theme = "light" | "dark";

export interface PreviewToolbarProps {
  viewport: Viewport;
  onViewportChange: (v: Viewport) => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  zoom: number;
  onZoomChange: (z: number) => void;
}

export interface QualityScores {
  quality: number;
  accuracy: number;
  humanLike: number;
  platformFit: number;
  cultureFit: number;
}

export interface QualityOverlayProps {
  scores: QualityScores;
  charCount: number;
  charLimit?: number;
  hashtagCount: number;
  imageRatio?: "fit" | "unfit";
}
