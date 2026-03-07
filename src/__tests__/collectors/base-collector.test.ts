import { describe, it, expect } from "vitest";
import { generateContentHash } from "@/server/collectors/base-collector";

describe("generateContentHash", () => {
  it("should generate consistent SHA-256 hash", () => {
    const hash1 = generateContentHash("test content");
    const hash2 = generateContentHash("test content");
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex
  });

  it("should generate different hashes for different content", () => {
    const hash1 = generateContentHash("content A");
    const hash2 = generateContentHash("content B");
    expect(hash1).not.toBe(hash2);
  });
});
