"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Zap,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export type InsightType = "suggestion" | "warning" | "trend" | "action";

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

const INSIGHT_CONFIG: Record<
  InsightType,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  suggestion: { icon: Lightbulb, color: "text-blue-500", bg: "bg-blue-500/10" },
  warning: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  trend: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  action: { icon: Zap, color: "text-purple-500", bg: "bg-purple-500/10" },
};

const QUICK_QUESTIONS = [
  "왜 그렇게 생각해?",
  "더 자세히",
  "다른 관점은?",
];

interface AIInsightPanelProps {
  context: string;
  insights?: Insight[];
}

export function AIInsightPanel({ context, insights: externalInsights }: AIInsightPanelProps) {
  const [open, setOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});

  // Demo insights based on context
  const insights: Insight[] = externalInsights ?? getContextInsights(context);

  function handleFeedback(id: string, type: "up" | "down") {
    setFeedback((prev) => ({ ...prev, [id]: type }));
  }

  return (
    <>
      {/* Floating trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="fixed bottom-6 right-20 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/80"
        >
          <Sparkles className="h-4 w-4" />
          {insights.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
            >
              {insights.length}
            </Badge>
          )}
        </SheetTrigger>

        <SheetContent className="w-96 flex flex-col p-0">
          <SheetHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                AI 인사이트
              </SheetTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {getContextLabel(context)} 화면 기반 분석
            </p>
          </SheetHeader>

          {/* Insights list */}
          <ScrollArea className="flex-1">
            <div className="space-y-3 p-4">
              {insights.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                  현재 화면에 대한 인사이트가 없습니다.
                </div>
              ) : (
                insights.map((insight) => {
                  const config = INSIGHT_CONFIG[insight.type];
                  const Icon = config.icon;
                  const fb = feedback[insight.id];

                  return (
                    <div
                      key={insight.id}
                      className={`rounded-lg border p-3 space-y-2 ${config.bg}`}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${config.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{insight.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {insight.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {insight.actionLabel && (
                          <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                            {insight.actionLabel}
                          </Button>
                        )}
                        <div className="flex gap-1 ml-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 ${fb === "up" ? "text-green-500" : ""}`}
                            onClick={() => handleFeedback(insight.id, "up")}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 w-6 p-0 ${fb === "down" ? "text-red-500" : ""}`}
                            onClick={() => handleFeedback(insight.id, "down")}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {/* Quick questions + chat */}
          <div className="border-t p-3 space-y-2">
            <div className="flex flex-wrap gap-1">
              {QUICK_QUESTIONS.map((q) => (
                <Badge
                  key={q}
                  variant="outline"
                  className="cursor-pointer text-xs hover:bg-muted"
                  onClick={() => setChatInput(q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setChatInput("");
              }}
              className="flex gap-2"
            >
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="추가 질문..."
                className="flex-1 text-sm h-8"
              />
              <Button type="submit" size="sm" className="h-8" disabled={!chatInput.trim()}>
                <MessageCircle className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function getContextLabel(context: string): string {
  const labels: Record<string, string> = {
    dashboard: "대시보드",
    sources: "소스 관리",
    pipelines: "파이프라인",
    reviews: "콘텐츠 검토",
    publish: "발행",
    analytics: "분석",
  };
  return labels[context] ?? context;
}

function getContextInsights(context: string): Insight[] {
  const insightMap: Record<string, Insight[]> = {
    dashboard: [
      {
        id: "d1",
        type: "trend",
        title: "콘텐츠 생산 트렌드",
        description: "지난 7일간 파이프라인 실행이 증가 추세입니다. 주간 평균 대비 15% 높습니다.",
      },
      {
        id: "d2",
        type: "suggestion",
        title: "소스 다양화 제안",
        description: "현재 RSS 소스만 등록되어 있습니다. API나 Research Agent를 추가하면 콘텐츠 다양성을 높일 수 있습니다.",
        actionLabel: "소스 추가",
        actionHref: "/sources",
      },
    ],
    sources: [
      {
        id: "s1",
        type: "warning",
        title: "비활성 소스 감지",
        description: "3개 소스에서 7일 이상 새 콘텐츠가 수집되지 않았습니다. 소스 URL이나 설정을 확인해주세요.",
        actionLabel: "확인하기",
      },
      {
        id: "s2",
        type: "action",
        title: "트렌딩 토픽 소스 추천",
        description: "AI/ML 분야에서 높은 관심을 받는 새 소스 3개를 추천합니다.",
        actionLabel: "추천 보기",
      },
    ],
    pipelines: [
      {
        id: "p1",
        type: "suggestion",
        title: "파이프라인 병렬화 제안",
        description: "Writer → Editor 단계를 병렬로 실행하면 평균 처리 시간을 30% 단축할 수 있습니다.",
      },
      {
        id: "p2",
        type: "warning",
        title: "높은 실패율 감지",
        description: "최근 24시간 파이프라인 실패율이 20%를 초과했습니다. Editor Agent의 타임아웃 설정을 확인하세요.",
        actionLabel: "로그 보기",
      },
    ],
    reviews: [
      {
        id: "r1",
        type: "suggestion",
        title: "품질 개선 패턴",
        description: "Human-like 점수가 가장 낮은 지표입니다. Writer Agent 프롬프트에 자연스러운 어조 관련 지시를 추가하세요.",
      },
      {
        id: "r2",
        type: "trend",
        title: "승인률 변화",
        description: "지난 주 대비 승인률이 12% 향상되었습니다. Editor Agent 프롬프트 업데이트가 효과를 보이고 있습니다.",
      },
    ],
    publish: [
      {
        id: "pb1",
        type: "action",
        title: "최적 발행 시간 제안",
        description: "LinkedIn: 화-목 오전 9-10시, X: 월-금 오후 1-3시가 가장 높은 참여율을 기록했습니다.",
        actionLabel: "스케줄 조정",
      },
    ],
    analytics: [
      {
        id: "a1",
        type: "trend",
        title: "ROI 분석",
        description: "Blog 콘텐츠의 비용 대비 참여도가 가장 높습니다. Blog 발행 비중을 늘리는 것을 고려하세요.",
      },
      {
        id: "a2",
        type: "suggestion",
        title: "자동 승인 확대 가능",
        description: "현재 평균 Quality 점수가 8.2로 자동 승인 임계값을 초과합니다. Trust Level 상향을 검토하세요.",
        actionLabel: "설정 보기",
        actionHref: "/analytics",
      },
    ],
  };

  return insightMap[context] ?? insightMap.dashboard ?? [];
}
