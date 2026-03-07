import type { PlatformPublisher } from "./types";
import { BlogPublisher } from "./blog-publisher";
import { LinkedInPublisher } from "./linkedin-publisher";
import { XPublisher } from "./x-publisher";
import { InstagramPublisher } from "./instagram-publisher";

export type { PublishRequest, PublishResult, PlatformPublisher } from "./types";

const publishers: Record<string, PlatformPublisher> = {
  blog: new BlogPublisher(),
  linkedin: new LinkedInPublisher(),
  twitter: new XPublisher(),
  instagram: new InstagramPublisher(),
};

export function getPublisher(platform: string): PlatformPublisher {
  const publisher = publishers[platform];
  if (!publisher) {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  return publisher;
}
