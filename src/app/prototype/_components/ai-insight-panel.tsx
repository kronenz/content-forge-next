"use client";

import { useState } from "react";
import {
  Sparkles,
  X,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Target,
  Send,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Insight Types                                                      */
/* ------------------------------------------------------------------ */

type InsightType = "suggestion" | "warning" | "trend" | "action";

interface Insight {
  type: InsightType;
  title: string;
  body: string;
  action?: string;
}

interface PageInsights {
  agentName: string;
  agentRole: string;
  greeting: string;
  insights: Insight[];
}

const insightIcon: Record<InsightType, { icon: typeof Lightbulb; color: string }> = {
  suggestion: { icon: Lightbulb, color: "text-violet-400 bg-violet-500/10" },
  warning: { icon: AlertTriangle, color: "text-amber-400 bg-amber-500/10" },
  trend: { icon: TrendingUp, color: "text-cyan-400 bg-cyan-500/10" },
  action: { icon: Target, color: "text-emerald-400 bg-emerald-500/10" },
};

/* ------------------------------------------------------------------ */
/*  Page-specific insights                                             */
/* ------------------------------------------------------------------ */

const pageInsightsMap: Record<string, PageInsights> = {
  "/prototype": {
    agentName: "Forge Analyst",
    agentRole: "대시보드 인사이트 분석",
    greeting: "오늘의 파이프라인 현황을 분석했습니다.",
    insights: [
      {
        type: "trend",
        title: "LinkedIn 콘텐츠 성과 급상승",
        body: "지난 7일간 LinkedIn 도달률이 23% 증가했습니다. 'AI 트렌드' 키워드가 포함된 콘텐츠의 참여율이 특히 높습니다.",
        action: "LinkedIn 집중 전략 보기",
      },
      {
        type: "warning",
        title: "파이프라인 실패율 증가",
        body: "Fact Check 단계에서 경고가 2건 발생했습니다. 블록체인 관련 소스의 데이터 신뢰도를 확인해주세요.",
        action: "실패 로그 확인",
      },
      {
        type: "suggestion",
        title: "발행 시간 최적화 제안",
        body: "데이터 분석 결과, 화요일 오전 9-10시에 발행한 콘텐츠가 평균 35% 더 높은 참여율을 보입니다.",
      },
      {
        type: "action",
        title: "검토 대기 콘텐츠 12건",
        body: "검토 대기 중인 콘텐츠가 누적되고 있습니다. 품질 점수 8.0 이상 콘텐츠 5건은 자동 승인을 고려해보세요.",
        action: "자동 승인 설정",
      },
    ],
  },
  "/prototype/sources": {
    agentName: "Source Scout",
    agentRole: "소스 품질 모니터링",
    greeting: "소스 현황을 점검했습니다.",
    insights: [
      {
        type: "warning",
        title: "SaaS Weekly 소스 오류",
        body: "2일째 수집이 실패하고 있습니다. RSS 피드 URL 변경이 감지되었습니다. 새 URL로 업데이트가 필요합니다.",
        action: "소스 수정",
      },
      {
        type: "suggestion",
        title: "새 소스 추천: The Verge AI",
        body: "현재 수집 주제와 관련도가 높은 소스입니다. TechCrunch와 겹치지 않는 고유 콘텐츠 비율 72%로 추가 가치가 있습니다.",
        action: "소스 추가",
      },
      {
        type: "trend",
        title: "Research Agent 효율 분석",
        body: "AI Research Agent의 수집 품질 점수가 지난달 대비 15% 향상되었습니다. 주제 키워드를 세분화한 결과입니다.",
      },
      {
        type: "action",
        title: "arXiv 소스 재활성화 권장",
        body: "일시정지된 arXiv 소스에서 최근 3일간 LLM 관련 핵심 논문 4편이 발행되었습니다. 재활성화를 권장합니다.",
        action: "재활성화",
      },
    ],
  },
  "/prototype/pipeline": {
    agentName: "Pipeline Optimizer",
    agentRole: "파이프라인 성능 최적화",
    greeting: "파이프라인 실행 패턴을 분석했습니다.",
    insights: [
      {
        type: "trend",
        title: "Writer 단계 성능 개선",
        body: "프롬프트 조정 후 Writer 단계의 평균 처리 시간이 32초 → 24초로 25% 단축되었습니다. 출력 품질은 동일합니다.",
      },
      {
        type: "warning",
        title: "Fact Check 병목 감지",
        body: "블록체인 관련 콘텐츠에서 Fact Check 단계가 평균 55초 소요됩니다(전체 평균 15초). 검증 소스 추가를 권장합니다.",
        action: "Fact Check 설정",
      },
      {
        type: "suggestion",
        title: "병렬 실행 최적화",
        body: "SEO와 Fact Check 단계는 독립적이므로 병렬 실행하면 파이프라인 전체 시간을 15% 줄일 수 있습니다.",
        action: "병렬화 적용",
      },
      {
        type: "action",
        title: "비용 절감 기회",
        body: "Formatter 단계에서 불필요한 토큰 소비가 감지되었습니다. 캐싱을 적용하면 월 $12 절약이 가능합니다.",
      },
    ],
  },
  "/prototype/contents": {
    agentName: "Content Editor",
    agentRole: "콘텐츠 품질 어드바이저",
    greeting: "현재 콘텐츠를 분석했습니다.",
    insights: [
      {
        type: "suggestion",
        title: "Human-like 점수 개선 방안",
        body: "현재 콘텐츠의 자연스러움 점수가 7.5입니다. 첫 문장에 개인 경험이나 질문을 추가하면 8.0 이상으로 올릴 수 있습니다.",
        action: "자동 수정 적용",
      },
      {
        type: "warning",
        title: "AI 탐지율 주의",
        body: "'블록체인 규제' 콘텐츠의 AI 탐지율이 32%입니다. Humanizer 단계를 추가 실행하면 15% 이하로 낮출 수 있습니다.",
        action: "Humanizer 실행",
      },
      {
        type: "trend",
        title: "플랫폼별 톤 분석",
        body: "LinkedIn 콘텐츠에서 전문적 톤(Professional)이 캐주얼 톤보다 참여율이 2.3배 높은 패턴이 확인됩니다.",
      },
      {
        type: "action",
        title: "X 버전 추가 생성 제안",
        body: "현재 Blog + LinkedIn만 있는데, 이 주제는 X에서도 반응이 좋을 것으로 예측됩니다. 예상 도달 2.1K.",
        action: "X 버전 생성",
      },
    ],
  },
  "/prototype/publish": {
    agentName: "Publishing Strategist",
    agentRole: "발행 전략 최적화",
    greeting: "발행 스케줄을 분석했습니다.",
    insights: [
      {
        type: "action",
        title: "최적 발행 시간 도래",
        body: "내일 오전 9시에 예약된 LinkedIn 콘텐츠가 있습니다. 분석 결과 오전 9:15-9:30이 이 주제의 최적 시간입니다.",
        action: "시간 조정",
      },
      {
        type: "suggestion",
        title: "발행 간격 조정 제안",
        body: "이번 주 화/목에 발행이 집중되어 있습니다. 수/금에 분산하면 전체 도달률이 약 18% 향상될 수 있습니다.",
        action: "자동 분산",
      },
      {
        type: "trend",
        title: "플랫폼 크로스포스팅 효과",
        body: "Blog 발행 후 2시간 뒤 LinkedIn에 요약을 올린 콘텐츠가 동시 발행 대비 참여율이 40% 높습니다.",
      },
      {
        type: "warning",
        title: "Instagram 발행 부족",
        body: "지난 2주간 Instagram 발행이 1건뿐입니다. 인포그래픽 콘텐츠를 주 2회 이상 발행하면 팔로워 성장에 도움됩니다.",
        action: "인스타 콘텐츠 생성",
      },
    ],
  },
  "/prototype/analytics": {
    agentName: "Data Analyst",
    agentRole: "성과 데이터 분석",
    greeting: "지난 30일 성과를 심층 분석했습니다.",
    insights: [
      {
        type: "trend",
        title: "콘텐츠 ROI 급상승",
        body: "AI 비용은 8% 감소했지만 도달률은 23% 증가했습니다. 콘텐츠당 ROI가 324%로 역대 최고치입니다.",
      },
      {
        type: "suggestion",
        title: "저성과 콘텐츠 패턴 발견",
        body: "1,500단어 이상의 Blog 콘텐츠가 평균 체류 시간이 2배 높습니다. 현재 평균 1,100단어를 1,400단어 이상으로 올리는 것을 권장합니다.",
        action: "Writer 설정 변경",
      },
      {
        type: "action",
        title: "X 채널 전략 재검토 필요",
        body: "X의 참여율이 -5% 하락 추세입니다. 스레드 형식 콘텐츠로 전환하면 RT율을 개선할 수 있습니다.",
        action: "X 전략 수정",
      },
      {
        type: "trend",
        title: "품질 점수 vs 성과 상관관계",
        body: "품질 8.0 이상 콘텐츠의 평균 도달률이 8.0 미만 대비 3.2배 높습니다. 품질 기준을 8.0 이상으로 설정하는 것을 권장합니다.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AiInsightPanel({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [feedbacks, setFeedbacks] = useState<Record<number, "up" | "down">>({});

  const pageData = pageInsightsMap[pathname] ?? pageInsightsMap["/prototype"]!;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-2xl transition-all duration-300 hover:scale-105 ${
          open
            ? "bg-zinc-800 shadow-zinc-900/50"
            : "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-500/30"
        }`}
      >
        {open ? (
          <X className="size-4" />
        ) : (
          <>
            <Sparkles className="size-4" />
            <span>AI 인사이트</span>
            <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
              {pageData.insights.length}
            </span>
          </>
        )}
      </button>

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-40 h-full w-[380px] transform border-l border-white/[0.06] bg-zinc-950/95 backdrop-blur-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Panel header */}
          <div className="border-b border-white/[0.06] p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                <Sparkles className="size-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {pageData.agentName}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {pageData.agentRole}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              {pageData.greeting}
            </p>
          </div>

          {/* Insights list */}
          <div className="flex-1 overflow-auto p-3 space-y-2">
            {pageData.insights.map((insight, i) => {
              const iconConfig = insightIcon[insight.type];
              const Icon = iconConfig.icon;
              const feedback = feedbacks[i];

              return (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 space-y-2.5 transition-all hover:border-white/[0.08]"
                >
                  {/* Type + Title */}
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 rounded-lg p-1.5 ${iconConfig.color}`}>
                      <Icon className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-zinc-200">
                        {insight.title}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <p className="text-[13px] text-zinc-400 leading-relaxed pl-9">
                    {insight.body}
                  </p>

                  {/* Action + Feedback */}
                  <div className="flex items-center justify-between pl-9">
                    {insight.action ? (
                      <button className="rounded-lg bg-violet-500/10 px-3 py-1.5 text-[11px] font-medium text-violet-400 transition-colors hover:bg-violet-500/20">
                        {insight.action}
                      </button>
                    ) : (
                      <div />
                    )}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setFeedbacks((prev) => ({
                            ...prev,
                            [i]: prev[i] === "up" ? undefined as unknown as "up" : "up",
                          }))
                        }
                        className={`rounded-lg p-1.5 transition-colors ${
                          feedback === "up"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-400"
                        }`}
                      >
                        <ThumbsUp className="size-3" />
                      </button>
                      <button
                        onClick={() =>
                          setFeedbacks((prev) => ({
                            ...prev,
                            [i]: prev[i] === "down" ? undefined as unknown as "down" : "down",
                          }))
                        }
                        className={`rounded-lg p-1.5 transition-colors ${
                          feedback === "down"
                            ? "bg-red-500/10 text-red-400"
                            : "text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-400"
                        }`}
                      >
                        <ThumbsDown className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat input */}
          <div className="border-t border-white/[0.06] p-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
              <MessageSquare className="size-3.5 text-zinc-600 shrink-0" />
              <input
                type="text"
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="AI에게 추가 질문하기..."
                className="flex-1 bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 outline-none"
              />
              <button
                className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-white/[0.04] hover:text-violet-400"
              >
                <Send className="size-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {["왜 그렇게 생각해?", "더 자세히", "다른 관점은?"].map((q) => (
                <button
                  key={q}
                  className="rounded-lg bg-white/[0.04] px-2.5 py-1 text-[10px] text-zinc-500 transition-colors hover:bg-white/[0.08] hover:text-zinc-300"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
