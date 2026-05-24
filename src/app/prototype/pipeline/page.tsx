"use client";

import {
  CheckCircle2,
  Loader2,
  Clock,
  AlertTriangle,
  XCircle,
  Play,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.05] ${className}`}
    >
      {children}
    </div>
  );
}

const pipelines = [
  {
    id: "#1234",
    title: "AI 마케팅 트렌드 2026",
    source: "TechCrunch",
    status: "completed",
    startedAt: "14:20",
    duration: "1분 32초",
    platforms: ["Blog", "LinkedIn"],
    quality: 8.5,
    steps: [
      { name: "Analyst", status: "done", time: "12s", tokens: { in: 1200, out: 450 } },
      { name: "Writer", status: "done", time: "28s", tokens: { in: 800, out: 2400 } },
      { name: "Editor", status: "done", time: "18s", tokens: { in: 2400, out: 2200 } },
      { name: "SEO", status: "done", time: "8s", tokens: { in: 2200, out: 300 } },
      { name: "Fact Check", status: "done", time: "15s", tokens: { in: 2200, out: 200 } },
      { name: "Formatter", status: "done", time: "5s", tokens: { in: 2200, out: 2100 } },
    ],
  },
  {
    id: "#1233",
    title: "SaaS 성장 전략 가이드",
    source: "HackerNews",
    status: "running",
    startedAt: "14:28",
    duration: "45초",
    platforms: ["LinkedIn", "X"],
    quality: null,
    steps: [
      { name: "Analyst", status: "done", time: "12s", tokens: { in: 1100, out: 420 } },
      { name: "Writer", status: "done", time: "28s", tokens: { in: 750, out: 2100 } },
      { name: "Editor", status: "active", time: "5s", tokens: { in: 0, out: 0 } },
      { name: "SEO", status: "pending", time: "", tokens: { in: 0, out: 0 } },
      { name: "Fact Check", status: "pending", time: "", tokens: { in: 0, out: 0 } },
      { name: "Formatter", status: "pending", time: "", tokens: { in: 0, out: 0 } },
    ],
  },
  {
    id: "#1232",
    title: "블록체인 규제 업데이트",
    source: "CoinDesk",
    status: "warning",
    startedAt: "14:15",
    duration: "2분 10초",
    platforms: ["Blog"],
    quality: 6.2,
    steps: [
      { name: "Analyst", status: "done", time: "10s", tokens: { in: 900, out: 380 } },
      { name: "Writer", status: "done", time: "25s", tokens: { in: 680, out: 1800 } },
      { name: "Editor", status: "done", time: "20s", tokens: { in: 1800, out: 1700 } },
      { name: "SEO", status: "done", time: "7s", tokens: { in: 1700, out: 250 } },
      { name: "Fact Check", status: "warning", time: "55s", tokens: { in: 1700, out: 400 } },
      { name: "Formatter", status: "done", time: "4s", tokens: { in: 1700, out: 1650 } },
    ],
  },
];

function StepIcon({ status }: { status: string }) {
  switch (status) {
    case "done":
      return <CheckCircle2 className="size-4 text-emerald-400" />;
    case "active":
      return <Loader2 className="size-4 text-violet-400 animate-spin" />;
    case "warning":
      return <AlertTriangle className="size-4 text-amber-400" />;
    case "failed":
      return <XCircle className="size-4 text-red-400" />;
    default:
      return <Clock className="size-4 text-zinc-600" />;
  }
}

function PipelineStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    completed: { label: "완료", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    running: { label: "진행중", className: "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse" },
    warning: { label: "경고", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    failed: { label: "실패", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  };
  const c = config[status] ?? { label: "알 수 없음", className: "" };
  return (
    <Badge variant="outline" className={`text-[11px] rounded-lg ${c.className}`}>
      {c.label}
    </Badge>
  );
}

function PipelineCard({ pipeline }: { pipeline: (typeof pipelines)[0] }) {
  const [expanded, setExpanded] = useState(false);
  const completedSteps = pipeline.steps.filter((s) => s.status === "done").length;
  const progress = (completedSteps / pipeline.steps.length) * 100;

  return (
    <GlassCard className={pipeline.status === "running" ? "border-violet-500/20 shadow-lg shadow-violet-500/5" : ""}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-lg p-1 text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 transition-colors"
            >
              {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-200">{pipeline.title}</span>
                <PipelineStatusBadge status={pipeline.status} />
              </div>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-600">
                <span>{pipeline.source}</span>
                <span>시작: {pipeline.startedAt}</span>
                <span>경과: {pipeline.duration}</span>
                <span className="flex gap-1">
                  {pipeline.platforms.map((p) => (
                    <span key={p} className="rounded bg-white/[0.04] px-1 py-0.5 text-[10px] text-zinc-500">
                      {p}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pipeline.quality !== null && (
              <span className={`text-lg font-bold font-mono ${pipeline.quality >= 8 ? "text-emerald-400" : "text-amber-400"}`}>
                {pipeline.quality.toFixed(1)}
              </span>
            )}
            <Button variant="ghost" size="icon-sm" className="text-zinc-500 hover:text-zinc-300">
              <Eye className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              pipeline.status === "running"
                ? "bg-gradient-to-r from-violet-500 to-indigo-500"
                : pipeline.status === "warning"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="mt-3 flex items-center gap-1">
          {pipeline.steps.map((step, i, arr) => (
            <div key={step.name} className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <StepIcon status={step.status} />
                <span className={`text-[11px] ${step.status === "pending" ? "text-zinc-600" : step.status === "active" ? "text-violet-300" : "text-zinc-400"}`}>
                  {step.name}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`h-px w-4 mx-1 ${step.status === "done" ? "bg-emerald-500/30" : "bg-white/[0.04]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-white/[0.04] p-4 space-y-3">
          <p className="text-[11px] text-zinc-600 uppercase tracking-wider">단계별 상세</p>
          {pipeline.steps.map((step) => (
            <div
              key={step.name}
              className={`rounded-xl border p-3 ${
                step.status === "active"
                  ? "border-violet-500/20 bg-violet-500/[0.05]"
                  : step.status === "warning"
                    ? "border-amber-500/20 bg-amber-500/[0.05]"
                    : "border-white/[0.04] bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StepIcon status={step.status} />
                  <span className="text-sm font-medium text-zinc-300">{step.name}</span>
                  {step.time && (
                    <span className="text-[11px] text-zinc-600">{step.time}</span>
                  )}
                </div>
                {step.tokens.in > 0 && (
                  <div className="text-[11px] text-zinc-600">
                    토큰: {step.tokens.in.toLocaleString()} in / {step.tokens.out.toLocaleString()} out
                  </div>
                )}
              </div>
              {step.status === "warning" && (
                <div className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                  사실 검증 경고: 일부 통계 데이터의 출처를 확인할 수 없습니다
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export default function PipelinePage() {
  return (
    <div className="relative p-6 space-y-6 max-w-5xl">
      <div className="pointer-events-none fixed right-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/[0.03] blur-[120px]" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            파이프라인
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            AI Agent 파이프라인 실행 현황을 모니터링합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06] hover:text-white rounded-xl gap-1.5 text-xs">
            <RotateCcw className="size-3" />
            새로고침
          </Button>
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 rounded-xl gap-1.5">
            <Play className="size-3.5" />
            수동 실행
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "실행중", value: "1", gradient: "from-blue-500/20 to-blue-500/5", color: "text-blue-400", icon: Loader2 },
          { label: "대기중", value: "3", gradient: "from-zinc-500/20 to-zinc-500/5", color: "text-zinc-400", icon: Clock },
          { label: "완료", value: "24", gradient: "from-emerald-500/20 to-emerald-500/5", color: "text-emerald-400", icon: CheckCircle2 },
          { label: "경고/실패", value: "2", gradient: "from-amber-500/20 to-amber-500/5", color: "text-amber-400", icon: AlertTriangle },
        ].map((s) => (
          <GlassCard key={s.label}>
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${s.gradient} p-4`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">{s.label}</span>
                <s.icon className={`size-3.5 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold text-white mt-1">{s.value}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1 w-fit">
        {["전체", "실행중", "완료", "경고", "실패"].map((f, i) => (
          <button
            key={f}
            className={`rounded-lg px-3 py-1.5 text-xs transition-all ${
              i === 0 ? "bg-white/[0.08] text-white font-medium" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Pipeline Cards */}
      <div className="space-y-3">
        {pipelines.map((pipeline) => (
          <PipelineCard key={pipeline.id} pipeline={pipeline} />
        ))}
      </div>

      {/* Cost Summary */}
      <GlassCard>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/[0.04] p-2">
              <Zap className="size-4 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-200">오늘 비용</div>
              <div className="text-[11px] text-zinc-600">토큰 사용량 기준</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">$2.47</div>
            <div className="text-[11px] text-zinc-600">28개 파이프라인</div>
          </div>
        </div>
      </GlassCard>

      <div className="h-6" />
    </div>
  );
}
