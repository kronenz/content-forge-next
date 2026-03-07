"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PreviewProps } from "@/types/preview";
import { ThumbsUp, MessageSquare, Repeat2, Send } from "lucide-react";

type ViewMode = "feed" | "article";

export function LinkedInPreview({ content, author }: PreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("feed");
  const [expanded, setExpanded] = useState(false);

  const displayName = author?.name ?? "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const bodyLines = content.body.split("\n");
  const truncatedBody =
    !expanded && bodyLines.length > 4
      ? bodyLines.slice(0, 4).join("\n")
      : content.body;
  const showMore = !expanded && bodyLines.length > 4;

  const hashtags = content.tags?.map((t) => `#${t}`).join(" ");

  return (
    <div className="mx-auto max-w-[555px]">
      {/* View mode toggle */}
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setViewMode("feed")}
          className={`rounded px-3 py-1 text-xs font-medium transition ${viewMode === "feed" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}
        >
          Feed View
        </button>
        <button
          onClick={() => setViewMode("article")}
          className={`rounded px-3 py-1 text-xs font-medium transition ${viewMode === "article" ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}
        >
          Article View
        </button>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-start gap-3 p-4 pb-0">
          <Avatar>
            {author?.avatar && <AvatarImage src={author.avatar} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {author?.title ?? "Professional"}
            </p>
            <p className="text-xs text-muted-foreground">1시간</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 pt-3 pb-2">
          {viewMode === "article" && (
            <h2 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {content.title}
            </h2>
          )}
          <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
            {truncatedBody}
          </p>
          {showMore && (
            <button
              onClick={() => setExpanded(true)}
              className="text-sm font-medium text-muted-foreground hover:text-blue-600 mt-1"
            >
              ...더 보기
            </button>
          )}
          {hashtags && (
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              {hashtags}
            </p>
          )}
        </div>

        {/* Attached image */}
        {content.images?.[0] && (
          <div className="mt-1">
            <img
              src={content.images[0]}
              alt="Attachment"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Engagement counts */}
        <div className="flex items-center gap-1 px-4 py-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center justify-center rounded-full bg-blue-600 p-0.5 text-white">
            <ThumbsUp className="h-2.5 w-2.5" />
          </span>
          <span>42</span>
          <span className="ml-auto">3 댓글</span>
        </div>

        {/* Action bar */}
        <div className="flex border-t border-zinc-200 dark:border-zinc-700">
          {[
            { icon: ThumbsUp, label: "좋아요" },
            { icon: MessageSquare, label: "댓글" },
            { icon: Repeat2, label: "공유" },
            { icon: Send, label: "보내기" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex flex-1 items-center justify-center gap-1.5 py-3 text-xs font-medium text-muted-foreground hover:bg-muted transition"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
