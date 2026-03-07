import { createHash } from "crypto";

export interface CollectedItem {
  title: string | null;
  body: string;
  url: string | null;
  author: string | null;
  publishedAt: Date | null;
  imageUrl: string | null;
  metadata: Record<string, unknown>;
}

export interface CollectResult {
  items: CollectedItem[];
  errors: string[];
}

export function generateContentHash(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}
