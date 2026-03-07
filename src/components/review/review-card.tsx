"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STATUS_CONFIG = {
  pending: { label: "대기", variant: "secondary" as const },
  approved: { label: "승인", variant: "default" as const },
  revision: { label: "수정요청", variant: "outline" as const },
  rejected: { label: "반려", variant: "destructive" as const },
};

const PLATFORM_LABELS: Record<string, string> = {
  blog: "블로그",
  linkedin: "LinkedIn",
  twitter: "X/Twitter",
  instagram: "Instagram",
};

interface ReviewCardProps {
  review: {
    id: string;
    status: "pending" | "approved" | "revision" | "rejected";
    qualityScore: number | null;
    accuracyScore: number | null;
    humanLikeScore: number | null;
    platformFitScore: number | null;
    cultureFitScore: number | null;
    createdAt: Date;
    processedContent: {
      id: string;
      platform: string;
      title: string | null;
      body: string;
    } | null;
    pipelineRun: {
      rawContent: { title: string | null } | null;
    } | null;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const statusConfig = STATUS_CONFIG[review.status];

  const scores = [
    review.qualityScore,
    review.accuracyScore,
    review.humanLikeScore,
    review.platformFitScore,
    review.cultureFitScore,
  ].filter((s): s is number => s != null);

  const avgScore =
    scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;

  const title =
    review.processedContent?.title ??
    review.pipelineRun?.rawContent?.title ??
    "제목 없음";

  const platform = review.processedContent?.platform ?? "blog";

  return (
    <Link href={`/reviews/${review.id}`}>
      <Card className="hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm line-clamp-1">{title}</CardTitle>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {PLATFORM_LABELS[platform] ?? platform}
              </Badge>
              {avgScore != null && (
                <span
                  className={`font-medium ${
                    avgScore >= 8
                      ? "text-green-600"
                      : avgScore >= 6
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {avgScore.toFixed(1)}점
                </span>
              )}
            </div>
            <span>{new Date(review.createdAt).toLocaleDateString("ko-KR")}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
