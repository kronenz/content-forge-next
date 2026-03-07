"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ReviewPanel } from "@/components/review/review-panel";

const STATUS_LABELS: Record<string, string> = {
  pending: "대기",
  approved: "승인",
  revision: "수정요청",
  rejected: "반려",
};

export default function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const {
    data: review,
    isLoading,
    refetch,
  } = trpc.review.byId.useQuery({ id });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground mb-4">
          검토를 찾을 수 없습니다
        </p>
        <Button variant="outline" onClick={() => router.push("/reviews")}>
          목록으로
        </Button>
      </div>
    );
  }

  const title =
    review.processedContent?.title ??
    review.pipelineRun?.rawContent?.title ??
    "제목 없음";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/reviews")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          목록
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>
        <Badge
          variant={
            review.status === "approved"
              ? "default"
              : review.status === "rejected"
                ? "destructive"
                : "secondary"
          }
        >
          {STATUS_LABELS[review.status] ?? review.status}
        </Badge>
      </div>

      <ReviewPanel review={review as never} onUpdate={() => refetch()} />
    </div>
  );
}
