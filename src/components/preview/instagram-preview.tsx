"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PreviewProps } from "@/types/preview";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type ViewMode = "feed" | "story" | "reel";

export function InstagramPreview({ content, author }: PreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("feed");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const displayName = author?.handle ?? author?.name ?? "username";
  const initials = (author?.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const images = content.images ?? [];
  const totalSlides = Math.max(images.length, 1);

  const hashtags = content.tags?.map((t) => `#${t}`).join(" ");
  const captionText = content.summary ?? content.body;
  const shortCaption =
    !expanded && captionText.length > 100
      ? captionText.slice(0, 100)
      : captionText;
  const showMore = !expanded && captionText.length > 100;

  if (viewMode === "story") {
    return (
      <div className="mx-auto max-w-[375px]">
        <div className="mb-3 flex gap-2">
          {(["feed", "story", "reel"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`rounded px-3 py-1 text-xs font-medium capitalize transition ${viewMode === m ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" : "bg-muted text-muted-foreground"}`}
            >
              {m === "reel" ? "Reel Cover" : m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gradient-to-b from-purple-900 to-pink-900">
          {images[0] ? (
            <img src={images[0]} alt="Story" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-white text-lg font-medium">
              {content.title}
            </div>
          )}
          {/* Story header */}
          <div className="absolute top-4 left-0 right-0 px-4">
            <div className="mb-2 flex gap-1">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 rounded-full ${i <= currentSlide ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                {author?.avatar && <AvatarImage src={author.avatar} />}
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-white">{displayName}</span>
              <span className="text-xs text-white/60">2분</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "reel") {
    return (
      <div className="mx-auto max-w-[375px]">
        <div className="mb-3 flex gap-2">
          {(["feed", "story", "reel"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`rounded px-3 py-1 text-xs font-medium capitalize transition ${viewMode === m ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" : "bg-muted text-muted-foreground"}`}
            >
              {m === "reel" ? "Reel Cover" : m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black">
          {images[0] ? (
            <img src={images[0]} alt="Reel" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-950">
              <span className="text-2xl font-bold text-white/20">9:16</span>
            </div>
          )}
          {/* Reel overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-2 mb-2">
              <Avatar size="sm">
                {author?.avatar && <AvatarImage src={author.avatar} />}
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-semibold text-white">{displayName}</span>
            </div>
            <p className="text-xs text-white/90 line-clamp-2">
              {captionText}
            </p>
          </div>
          {/* Side actions */}
          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4">
            {[
              { icon: Heart, label: "128" },
              { icon: MessageCircle, label: "24" },
              { icon: Send, label: "" },
              { icon: Bookmark, label: "" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <Icon className="h-6 w-6 text-white" />
                {label && <span className="text-[10px] text-white">{label}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Feed view (default)
  return (
    <div className="mx-auto max-w-[470px]">
      {/* View mode toggle */}
      <div className="mb-3 flex gap-2">
        {(["feed", "story", "reel"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setViewMode(m)}
            className={`rounded px-3 py-1 text-xs font-medium capitalize transition ${viewMode === m ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" : "bg-muted text-muted-foreground"}`}
          >
            {m === "reel" ? "Reel Cover" : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar size="sm">
            {author?.avatar && <AvatarImage src={author.avatar} />}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {displayName}
          </span>
        </div>

        {/* Carousel */}
        <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          {images.length > 0 ? (
            <img
              src={images[currentSlide] ?? images[0]}
              alt={`Slide ${currentSlide + 1}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-2xl font-bold text-muted-foreground/30">
                1080 x 1080
              </span>
            </div>
          )}
          {/* Carousel navigation */}
          {totalSlides > 1 && (
            <>
              {currentSlide > 0 && (
                <button
                  onClick={() => setCurrentSlide((p) => p - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              {currentSlide < totalSlides - 1 && (
                <button
                  onClick={() => setCurrentSlide((p) => p + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition ${i === currentSlide ? "bg-blue-500" : "bg-white/60"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex gap-4">
            <Heart className="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
            <MessageCircle className="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
            <Send className="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
          </div>
          <Bookmark className="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
        </div>

        {/* Likes */}
        <div className="px-4">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            좋아요 128개
          </p>
        </div>

        {/* Caption */}
        <div className="px-4 py-2">
          <p className="text-sm text-zinc-800 dark:text-zinc-200">
            <span className="font-semibold">{displayName}</span>{" "}
            <span className="whitespace-pre-wrap">{shortCaption}</span>
            {showMore && (
              <button
                onClick={() => setExpanded(true)}
                className="ml-1 text-muted-foreground"
              >
                ...더 보기
              </button>
            )}
          </p>
          {hashtags && (
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
              {hashtags}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
