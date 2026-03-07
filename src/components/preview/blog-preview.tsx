"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { PreviewProps } from "@/types/preview";

export function BlogPreview({ content, author }: PreviewProps) {
  const readingTime = Math.max(1, Math.ceil(content.body.length / 1000));
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <article className="mx-auto max-w-3xl bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden">
      {/* Hero Image */}
      {content.images?.[0] ? (
        <div className="relative aspect-[1200/630] w-full bg-muted overflow-hidden">
          <Image
            src={content.images[0]}
            alt={content.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="aspect-[1200/630] w-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 flex items-center justify-center">
          <span className="text-4xl font-bold text-muted-foreground/30">
            1200 x 630
          </span>
        </div>
      )}

      <div className="px-6 py-8 sm:px-10 lg:px-16">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-zinc-900 dark:text-zinc-50">
          {content.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {author && (
            <>
              <span className="font-medium text-foreground">{author.name}</span>
              <span aria-hidden="true">&middot;</span>
            </>
          )}
          <span>{today}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{readingTime}분 읽기</span>
          {content.tags && content.tags.length > 0 && (
            <>
              <span aria-hidden="true">&middot;</span>
              <div className="flex flex-wrap gap-1">
                {content.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Separator */}
        <hr className="my-6 border-border" />

        {/* Body */}
        <div className="prose prose-zinc dark:prose-invert max-w-none text-base leading-relaxed whitespace-pre-wrap">
          {content.body}
        </div>
      </div>
    </article>
  );
}
