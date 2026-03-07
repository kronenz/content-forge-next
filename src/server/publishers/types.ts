export interface PublishRequest {
  title: string;
  body: string;
  platform: "blog" | "linkedin" | "twitter" | "instagram";
  media?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface PublishResult {
  success: boolean;
  publishedUrl?: string;
  platformPostId?: string;
  error?: string;
}

export interface PlatformPublisher {
  publish(request: PublishRequest): Promise<PublishResult>;
}
