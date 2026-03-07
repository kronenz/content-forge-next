"use client";

import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  RotateCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const STATUS_CONFIG = {
  scheduled: { label: "예약됨", icon: Clock, variant: "secondary" as const, color: "text-yellow-500" },
  publishing: { label: "발행 중", icon: Loader2, variant: "default" as const, color: "text-blue-500" },
  published: { label: "발행됨", icon: CheckCircle2, variant: "default" as const, color: "text-green-500" },
  failed: { label: "실패", icon: XCircle, variant: "destructive" as const, color: "text-red-500" },
};

const PLATFORM_CONFIG: Record<string, { label: string; color: string }> = {
  blog: { label: "Blog", color: "bg-blue-100 text-blue-800" },
  linkedin: { label: "LinkedIn", color: "bg-sky-100 text-sky-800" },
  twitter: { label: "X", color: "bg-slate-100 text-slate-800" },
  instagram: { label: "Instagram", color: "bg-pink-100 text-pink-800" },
};

interface PublishCardProps {
  publication: {
    id: string;
    platform: string;
    status: "scheduled" | "publishing" | "published" | "failed";
    publishedUrl: string | null;
    scheduledAt: Date | null;
    publishedAt: Date | null;
    engagementMetrics: Record<string, unknown> | null;
    createdAt: Date;
    processedContent: {
      id: string;
      title: string | null;
      body: string;
      platform: string;
    } | null;
  };
  onRefetch: () => void;
}

export function PublishCard({ publication, onRefetch }: PublishCardProps) {
  const statusConfig = STATUS_CONFIG[publication.status];
  const platformConfig = PLATFORM_CONFIG[publication.platform] ?? { label: publication.platform, color: "bg-gray-100 text-gray-800" };
  const StatusIcon = statusConfig.icon;

  const publishMutation = trpc.publish.publish.useMutation({
    onSuccess: () => {
      toast.success("발행 완료");
      onRefetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const retryMutation = trpc.publish.retry.useMutation({
    onSuccess: () => {
      toast.success("재시도 예약됨");
      onRefetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const cancelMutation = trpc.publish.cancel.useMutation({
    onSuccess: () => {
      toast.success("발행 취소됨");
      onRefetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const metrics = publication.engagementMetrics as {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  } | null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <StatusIcon
              className={`h-5 w-5 shrink-0 ${statusConfig.color} ${
                publication.status === "publishing" ? "animate-spin" : ""
              }`}
            />
            <div className="min-w-0">
              <CardTitle className="text-base truncate">
                {publication.processedContent?.title ?? "제목 없음"}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {publication.scheduledAt
                  ? `예약: ${new Date(publication.scheduledAt).toLocaleString("ko-KR")}`
                  : new Date(publication.createdAt).toLocaleString("ko-KR")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${platformConfig.color}`}>
              {platformConfig.label}
            </span>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {publication.status === "published" && metrics && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            {metrics.views != null && <span>조회 {metrics.views}</span>}
            {metrics.likes != null && <span>좋아요 {metrics.likes}</span>}
            {metrics.comments != null && <span>댓글 {metrics.comments}</span>}
            {metrics.shares != null && <span>공유 {metrics.shares}</span>}
          </div>
        )}

        <div className="flex items-center gap-2">
          {publication.status === "published" && publication.publishedUrl && (
            <Button
              variant="outline"
              size="sm"
              render={
                <a href={publication.publishedUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              보기
            </Button>
          )}
          {publication.status === "scheduled" && (
            <>
              <Button
                variant="default"
                size="sm"
                disabled={publishMutation.isPending}
                onClick={() => publishMutation.mutate({ id: publication.id })}
              >
                즉시 발행
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate({ id: publication.id })}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                취소
              </Button>
            </>
          )}
          {publication.status === "failed" && (
            <Button
              variant="outline"
              size="sm"
              disabled={retryMutation.isPending}
              onClick={() => retryMutation.mutate({ id: publication.id })}
            >
              <RotateCw className="mr-1 h-3 w-3" />
              재시도
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
