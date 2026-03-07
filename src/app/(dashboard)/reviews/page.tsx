"use client";

import { useState } from "react";
import { Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { ReviewCard } from "@/components/review/review-card";

const STATUS_FILTERS = [
  { value: undefined, label: "전체" },
  { value: "pending" as const, label: "대기" },
  { value: "approved" as const, label: "승인" },
  { value: "revision" as const, label: "수정요청" },
  { value: "rejected" as const, label: "반려" },
];

export default function ReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "revision" | "rejected" | undefined
  >(undefined);

  const {
    data: reviews,
    isLoading,
  } = trpc.review.list.useQuery(
    statusFilter ? { status: statusFilter } : undefined,
  );

  const { data: stats } = trpc.review.stats.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">검토</h1>
        <p className="text-muted-foreground">
          콘텐츠 품질 검토 및 승인 관리
        </p>
      </div>

      {/* Stats summary */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">전체</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
            <p className="text-xs text-muted-foreground">대기</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold text-green-600">
              {stats.approved}
            </p>
            <p className="text-xs text-muted-foreground">승인</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {stats.revision}
            </p>
            <p className="text-xs text-muted-foreground">수정요청</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </p>
            <p className="text-xs text-muted-foreground">반려</p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              statusFilter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Review list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {statusFilter
              ? "해당 상태의 검토가 없습니다"
              : "아직 검토할 콘텐츠가 없습니다"}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review as never} />
          ))}
        </div>
      )}
    </div>
  );
}
