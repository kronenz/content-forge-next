"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, Loader2, ClipboardCheck, Send, ExternalLink } from "lucide-react";
import { trpc } from "@/lib/trpc";

const statusColors: Record<string, string> = {
  completed: "text-green-600",
  running: "text-blue-600",
  pending: "text-muted-foreground",
  failed: "text-red-600",
  cancelled: "text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  completed: "완료",
  running: "실행중",
  pending: "대기",
  failed: "실패",
  cancelled: "취소",
};

export default function DashboardPage() {
  const { data, isLoading } = trpc.analytics.dashboard.useQuery();

  const statCards = [
    { label: "수집됨", icon: Inbox, value: data?.stats.collected ?? 0 },
    { label: "가공중", icon: Loader2, value: data?.stats.processing ?? 0 },
    { label: "검토대기", icon: ClipboardCheck, value: data?.stats.pendingReview ?? 0 },
    { label: "발행됨", icon: Send, value: data?.stats.published ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="text-sm text-muted-foreground mt-1">
          콘텐츠 수집, 가공, 발행 현황을 한눈에 확인합니다.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "—" : card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline status + Recent publications */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">파이프라인 현황</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">로딩중...</p>
            ) : data?.recentPipelines.length === 0 ? (
              <p className="text-sm text-muted-foreground">파이프라인이 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {data?.recentPipelines.map((run) => (
                  <div key={run.id} className="flex items-center justify-between text-sm">
                    <span className="truncate max-w-[200px]">
                      {run.rawContent?.title ?? "제목 없음"}
                    </span>
                    <span className={`text-xs font-medium ${statusColors[run.status] ?? ""}`}>
                      {statusLabels[run.status] ?? run.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 발행</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">로딩중...</p>
            ) : data?.recentPublications.length === 0 ? (
              <p className="text-sm text-muted-foreground">발행된 콘텐츠가 없습니다.</p>
            ) : (
              <div className="space-y-3">
                {data?.recentPublications.map((pub) => (
                  <div key={pub.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 truncate max-w-[200px]">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted font-medium">
                        {pub.platform}
                      </span>
                      <span className="truncate">
                        {pub.processedContent?.title ?? "제목 없음"}
                      </span>
                    </div>
                    {pub.publishedUrl && (
                      <a
                        href={pub.publishedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
