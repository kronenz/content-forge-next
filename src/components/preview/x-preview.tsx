"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PreviewProps } from "@/types/preview";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share,
} from "lucide-react";

type ViewMode = "single" | "thread";

interface TweetProps {
  content: string;
  author: {
    name: string;
    handle: string;
    avatar?: string;
  };
  index?: number;
  total?: number;
  isThread?: boolean;
  images?: string[];
}

function Tweet({ content, author, index, total, isThread, images }: TweetProps) {
  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const threadIndicator =
    index != null && total != null && total > 1
      ? ` (${index + 1}/${total})`
      : "";

  return (
    <div className="flex gap-3 p-4">
      <div className="flex flex-col items-center">
        <Avatar>
          {author.avatar && <AvatarImage src={author.avatar} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {isThread && (
          <div className="mt-1 w-0.5 flex-1 bg-zinc-300 dark:bg-zinc-600" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
            {author.name}
          </span>
          <span className="text-sm text-muted-foreground truncate">
            @{author.handle}
          </span>
          <span className="text-sm text-muted-foreground">&middot;</span>
          <span className="text-sm text-muted-foreground">방금</span>
        </div>
        <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">
          {content}
          {threadIndicator && (
            <span className="text-muted-foreground">{threadIndicator}</span>
          )}
        </p>
        {/* Character count warning */}
        {content.length > 280 && (
          <p className="mt-1 text-xs text-red-500">
            {content.length}/280 (초과)
          </p>
        )}
        {images && images.length > 0 && (
          <div className="mt-3 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
            <img
              src={images[0]}
              alt="Media"
              className="w-full object-cover max-h-72"
            />
          </div>
        )}
        {/* Action bar */}
        <div className="mt-3 flex max-w-[300px] justify-between text-muted-foreground">
          {[
            { icon: MessageCircle, count: "2" },
            { icon: Repeat2, count: "5" },
            { icon: Heart, count: "18" },
            { icon: Share, count: "" },
          ].map(({ icon: Icon, count }, i) => (
            <button
              key={i}
              className="flex items-center gap-1 text-xs hover:text-blue-500 transition"
            >
              <Icon className="h-4 w-4" />
              {count && <span>{count}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function XPreview({ content, author }: PreviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("single");

  const displayName = author?.name ?? "User";
  const handle = author?.handle ?? "user";

  // Split body into thread parts by double newline or "---"
  const threadParts = content.body
    .split(/\n---\n|\n\n\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-[500px]">
      {/* View mode toggle */}
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setViewMode("single")}
          className={`rounded px-3 py-1 text-xs font-medium transition ${viewMode === "single" ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" : "bg-muted text-muted-foreground"}`}
        >
          Single Tweet
        </button>
        {threadParts.length > 1 && (
          <button
            onClick={() => setViewMode("thread")}
            className={`rounded px-3 py-1 text-xs font-medium transition ${viewMode === "thread" ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900" : "bg-muted text-muted-foreground"}`}
          >
            Thread View
          </button>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700">
        {viewMode === "single" || threadParts.length <= 1 ? (
          <Tweet
            content={content.body}
            author={{ name: displayName, handle, avatar: author?.avatar }}
            images={content.images}
          />
        ) : (
          threadParts.map((part, i) => (
            <Tweet
              key={i}
              content={part}
              author={{ name: displayName, handle, avatar: author?.avatar }}
              index={i}
              total={threadParts.length}
              isThread={i < threadParts.length - 1}
              images={i === 0 ? content.images : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
