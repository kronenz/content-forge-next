"use client";

import { useState } from "react";
import { BlogPreview } from "./blog-preview";
import { LinkedInPreview } from "./linkedin-preview";
import { XPreview } from "./x-preview";
import { InstagramPreview } from "./instagram-preview";
import type { PreviewProps } from "@/types/preview";
import { X } from "lucide-react";

interface MultiPlatformPreviewProps {
  contents: Record<string, PreviewProps>;
}

const PLATFORM_LABELS: Record<string, string> = {
  blog: "Blog",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  instagram: "Instagram",
};

const PLATFORM_COMPONENTS: Record<
  string,
  React.ComponentType<PreviewProps>
> = {
  blog: BlogPreview,
  linkedin: LinkedInPreview,
  twitter: XPreview,
  instagram: InstagramPreview,
};

export function MultiPlatformPreview({ contents }: MultiPlatformPreviewProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const platforms = Object.keys(contents);

  if (expanded) {
    const Component = PLATFORM_COMPONENTS[expanded];
    const props = contents[expanded];
    if (!Component || !props) return null;

    return (
      <div className="relative">
        <button
          onClick={() => setExpanded(null)}
          className="absolute -top-2 -right-2 z-10 rounded-full bg-zinc-800 p-1 text-white shadow-lg hover:bg-zinc-700 transition"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
            {PLATFORM_LABELS[expanded] ?? expanded}
          </h3>
          <Component {...props} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {platforms.map((platform) => {
        const Component = PLATFORM_COMPONENTS[platform];
        const props = contents[platform];
        if (!Component || !props) return null;

        return (
          <div
            key={platform}
            className="cursor-pointer rounded-lg border p-3 transition hover:ring-2 hover:ring-primary/50"
            onClick={() => setExpanded(platform)}
          >
            <h3 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {PLATFORM_LABELS[platform] ?? platform}
            </h3>
            <div className="pointer-events-none origin-top-left scale-75 -mb-[25%]">
              <Component {...props} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
