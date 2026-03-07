"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { AutoApprovalSettings } from "@/components/analytics/auto-approval-settings";
import {
  Rss,
  FileText,
  Workflow,
  Layers,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const PLATFORM_LABELS: Record<string, string> = {
  blog: "Blog",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  instagram: "Instagram",
};

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } =
    trpc.analytics.overview.useQuery();
  const { data: reviewStats, isLoading: reviewLoading } =
    trpc.analytics.reviewStats.useQuery();
  const { data: pubStats, isLoading: pubLoading } =
    trpc.analytics.publishingStats.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">분석</h1>
        <p className="text-sm text-muted-foreground">
          콘텐츠 파이프라인 현황과 품질 지표를 확인합니다.
        </p>
      </div>

      {/* Overview stats */}
      {overviewLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : overview ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {[
            { label: "소스", value: overview.sources, icon: Rss },
            { label: "수집 콘텐츠", value: overview.rawContents, icon: FileText },
            { label: "파이프라인", value: overview.pipelineRuns, icon: Workflow },
            { label: "가공 콘텐츠", value: overview.processedContents, icon: Layers },
            { label: "발행", value: overview.publications, icon: Send },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 pt-4">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Review stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              검토 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviewLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : reviewStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "승인", value: reviewStats.approved, icon: CheckCircle2, color: "text-green-500" },
                    { label: "반려", value: reviewStats.rejected, icon: XCircle, color: "text-red-500" },
                    { label: "수정요청", value: reviewStats.revision, icon: Clock, color: "text-yellow-500" },
                    { label: "대기", value: reviewStats.pending, icon: Clock, color: "text-muted-foreground" },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <s.icon className={`mx-auto h-5 w-5 ${s.color}`} />
                      <p className="mt-1 text-lg font-bold">{s.value}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>

                {reviewStats.total > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>승인률</span>
                      <span className="font-medium">{reviewStats.approvalRate}%</span>
                    </div>
                    <Progress value={reviewStats.approvalRate} />
                  </div>
                )}

                {reviewStats.avgScores && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">평균 품질 점수</p>
                    {[
                      { label: "Quality", value: reviewStats.avgScores.quality },
                      { label: "Accuracy", value: reviewStats.avgScores.accuracy },
                      { label: "Human-like", value: reviewStats.avgScores.humanLike },
                      { label: "Platform-fit", value: reviewStats.avgScores.platformFit },
                      { label: "Culture-fit", value: reviewStats.avgScores.cultureFit },
                    ].map((score) => (
                      <div key={score.label} className="flex items-center gap-2">
                        <span className="w-24 text-xs text-muted-foreground">
                          {score.label}
                        </span>
                        <Progress value={score.value * 10} className="flex-1" />
                        <span className="w-10 text-right text-xs font-medium">
                          {score.value.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 text-xs">
                  <Badge variant="outline">자동: {reviewStats.autoApproved}</Badge>
                  <Badge variant="outline">수동: {reviewStats.humanApproved}</Badge>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Publishing stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              발행 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pubLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : pubStats && pubStats.length > 0 ? (
              <div className="space-y-4">
                {pubStats.map((ps) => (
                  <div key={ps.platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {PLATFORM_LABELS[ps.platform] ?? ps.platform}
                      </span>
                      <Badge variant="outline">{ps.successRate}% 성공</Badge>
                    </div>
                    <Progress value={ps.successRate} />
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>전체: {ps.total}</span>
                      <span className="text-green-600">발행: {ps.published}</span>
                      <span className="text-red-600">실패: {ps.failed}</span>
                      <span>예약: {ps.scheduled}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                발행 데이터가 없습니다.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Auto-approval settings */}
      {reviewStats && (
        <AutoApprovalSettings
          trustLevel={reviewStats.trustLevel}
          totalReviews={reviewStats.total}
        />
      )}
    </div>
  );
}
