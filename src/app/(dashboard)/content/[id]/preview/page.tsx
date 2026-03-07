"use client";

import { useState, use } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BlogPreview } from "@/components/preview/blog-preview";
import { LinkedInPreview } from "@/components/preview/linkedin-preview";
import { XPreview } from "@/components/preview/x-preview";
import { InstagramPreview } from "@/components/preview/instagram-preview";
import { MultiPlatformPreview } from "@/components/preview/multi-platform-preview";
import { PreviewToolbar } from "@/components/preview/preview-toolbar";
import { QualityOverlay } from "@/components/preview/quality-overlay";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import type { PreviewProps, Viewport, Theme, QualityScores } from "@/types/preview";

const PLATFORM_COMPONENTS: Record<string, React.ComponentType<PreviewProps>> = {
  blog: BlogPreview,
  linkedin: LinkedInPreview,
  twitter: XPreview,
  instagram: InstagramPreview,
};

const PLATFORM_LABELS: Record<string, string> = {
  blog: "Blog",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  instagram: "Instagram",
  all: "All Platforms",
};

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: "max-w-full",
  tablet: "max-w-2xl",
  mobile: "max-w-sm",
};

const CHAR_LIMITS: Record<string, number> = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200,
};

export default function ContentPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [theme, setTheme] = useState<Theme>("light");
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState("all");

  const { data: content, isLoading } = trpc.content.processedById.useQuery({
    id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        콘텐츠를 찾을 수 없습니다.
      </div>
    );
  }

  const platform = content.platform;
  const previewProps: PreviewProps = {
    content: {
      title: content.title ?? "Untitled",
      body: content.body,
      summary:
        typeof content.metadata === "object" && content.metadata !== null
          ? (content.metadata as Record<string, unknown>).summary as string | undefined
          : undefined,
      tags:
        typeof content.metadata === "object" && content.metadata !== null
          ? (content.metadata as Record<string, unknown>).tags as string[] | undefined
          : undefined,
      images: content.media ?? undefined,
      platform,
    },
  };

  // Build quality scores from reviews
  const review = content.reviews?.[0];
  const scores: QualityScores = review
    ? {
        quality: review.qualityScore ?? 0,
        accuracy: review.accuracyScore ?? 0,
        humanLike: review.humanLikeScore ?? 0,
        platformFit: review.platformFitScore ?? 0,
        cultureFit: review.cultureFitScore ?? 0,
      }
    : {
        quality: 0,
        accuracy: 0,
        humanLike: 0,
        platformFit: 0,
        cultureFit: 0,
      };

  const charLimit = CHAR_LIMITS[platform];
  const hashtagCount = previewProps.content.tags?.length ?? 0;

  // Build multi-platform view data (just show current platform for single content)
  const multiContents: Record<string, PreviewProps> = {
    [platform]: previewProps,
  };

  const Component = PLATFORM_COMPONENTS[platform];
  const availableTabs = [platform];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">
            {content.title ?? "Untitled"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {PLATFORM_LABELS[platform] ?? platform} 프리뷰
          </p>
        </div>
        <PreviewToolbar
          viewport={viewport}
          onViewportChange={setViewport}
          theme={theme}
          onThemeChange={setTheme}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      </div>

      {/* Main content */}
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* Preview area */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as string)}
        >
          <TabsList>
            {availableTabs.map((p) => (
              <TabsTrigger key={p} value={p}>
                {PLATFORM_LABELS[p] ?? p}
              </TabsTrigger>
            ))}
            {Object.keys(multiContents).length > 1 && (
              <TabsTrigger value="all">All</TabsTrigger>
            )}
          </TabsList>

          <div
            className={`mx-auto mt-4 transition-all ${VIEWPORT_WIDTHS[viewport]} ${theme === "dark" ? "dark" : ""}`}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          >
            {availableTabs.map((p) => (
              <TabsContent key={p} value={p}>
                {Component && <Component {...previewProps} />}
              </TabsContent>
            ))}
            {Object.keys(multiContents).length > 1 && (
              <TabsContent value="all">
                <MultiPlatformPreview contents={multiContents} />
              </TabsContent>
            )}
          </div>
        </Tabs>

        {/* Quality overlay sidebar */}
        <div className="space-y-4">
          <QualityOverlay
            scores={scores}
            charCount={content.body.length}
            charLimit={charLimit}
            hashtagCount={hashtagCount}
            imageRatio={content.media && content.media.length > 0 ? "fit" : undefined}
          />
        </div>
      </div>
    </div>
  );
}
