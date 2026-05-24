"use client";

import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Send,
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const calendarDays = [
  { day: 1, items: [] },
  { day: 2, items: [] },
  { day: 3, items: [{ platform: "LinkedIn", title: "AI 트렌드", color: "bg-blue-500" }] },
  { day: 4, items: [{ platform: "Blog", title: "클라우드 가이드", color: "bg-violet-500" }] },
  { day: 5, items: [] },
  { day: 6, items: [{ platform: "LinkedIn", title: "SaaS 전략", color: "bg-blue-500" }, { platform: "X", title: "SaaS 전략", color: "bg-zinc-500" }] },
  { day: 7, items: [] },
  { day: 8, items: [] },
  { day: 9, items: [{ platform: "Blog", title: "마케팅 분석", color: "bg-violet-500" }] },
  { day: 10, items: [] },
  { day: 11, items: [{ platform: "LinkedIn", title: "리더십 인사이트", color: "bg-blue-500" }] },
  { day: 12, items: [{ platform: "Blog", title: "프로덕트 전략", color: "bg-violet-500" }] },
  { day: 13, items: [] },
  { day: 14, items: [{ platform: "Instagram", title: "인포그래픽", color: "bg-pink-500" }] },
];

const recentPublications = [
  {
    title: "AI 마케팅 트렌드 2026",
    platform: "LinkedIn",
    publishedAt: "오늘 14:32",
    status: "success",
    reach: "2.3K",
    engagement: "4.2%",
  },
  {
    title: "클라우드 인프라 비용 최적화",
    platform: "Blog",
    publishedAt: "오늘 14:15",
    status: "success",
    reach: "890",
    engagement: "3.1min",
  },
  {
    title: "SaaS 성장 전략 핵심 정리",
    platform: "X",
    publishedAt: "어제 18:00",
    status: "success",
    reach: "5.1K",
    engagement: "1.8%",
  },
  {
    title: "블록체인 규제 뉴스",
    platform: "Blog",
    publishedAt: "어제 12:30",
    status: "failed",
    reach: "-",
    engagement: "-",
  },
];

const scheduledItems = [
  {
    title: "SaaS 성장 전략 가이드",
    platform: "LinkedIn",
    scheduledAt: "내일 09:00",
    method: "최적 시간",
  },
  {
    title: "SaaS 성장 전략 가이드",
    platform: "X",
    scheduledAt: "내일 12:00",
    method: "수동 예약",
  },
  {
    title: "마케팅 분석 리포트",
    platform: "Blog",
    scheduledAt: "3월 9일 10:00",
    method: "자동",
  },
];

const platformColors: Record<string, string> = {
  LinkedIn: "text-blue-400",
  Blog: "text-violet-400",
  X: "text-zinc-400",
  Instagram: "text-pink-400",
};

export default function PublishPage() {
  return (
    <div className="relative p-6 space-y-6 max-w-6xl">
      <div className="pointer-events-none fixed right-0 top-0 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            발행
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            콘텐츠 발행 스케줄과 결과를 관리합니다
          </p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 rounded-xl gap-1.5">
          <Send className="size-3.5" />
          즉시 발행
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "이번 주 발행", value: "12건", icon: Send, gradient: "from-violet-500/20 to-violet-500/5", color: "text-violet-400" },
          { label: "예약 대기", value: "3건", icon: Clock, gradient: "from-blue-500/20 to-blue-500/5", color: "text-blue-400" },
          { label: "성공률", value: "96%", icon: CheckCircle2, gradient: "from-emerald-500/20 to-emerald-500/5", color: "text-emerald-400" },
          { label: "총 도달", value: "12.4K", icon: TrendingUp, gradient: "from-cyan-500/20 to-cyan-500/5", color: "text-cyan-400" },
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

      <div className="grid grid-cols-5 gap-4">
        {/* Calendar */}
        <GlassCard className="col-span-3">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Calendar className="size-4 text-violet-400" />
                2026년 3월
              </h2>
              <div className="flex items-center gap-1">
                <button className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300">
                  <ChevronLeft className="size-4" />
                </button>
                <button className="rounded-lg px-2.5 py-1 text-xs text-zinc-400 hover:bg-white/[0.04]">
                  오늘
                </button>
                <button className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
                <div key={d} className="text-center text-[11px] text-zinc-600 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => (
                <div
                  key={day.day}
                  className={`min-h-[72px] rounded-xl border p-1.5 transition-all cursor-pointer ${
                    day.day === 7
                      ? "border-violet-500/20 bg-violet-500/[0.05]"
                      : "border-white/[0.03] hover:border-white/[0.08] hover:bg-white/[0.02]"
                  }`}
                >
                  <div className={`text-[11px] mb-1 ${day.day === 7 ? "text-violet-400 font-medium" : "text-zinc-500"}`}>
                    {day.day}
                  </div>
                  <div className="space-y-0.5">
                    {day.items.map((item, i) => (
                      <div
                        key={i}
                        className={`rounded px-1 py-0.5 text-[9px] text-white truncate ${item.color}`}
                      >
                        {item.platform}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-3">
              {[
                { label: "Blog", color: "bg-violet-500" },
                { label: "LinkedIn", color: "bg-blue-500" },
                { label: "X", color: "bg-zinc-500" },
                { label: "Instagram", color: "bg-pink-500" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`size-2 rounded-full ${l.color}`} />
                  <span className="text-[10px] text-zinc-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Scheduled & Queue */}
        <div className="col-span-2 space-y-4">
          {/* Scheduled */}
          <GlassCard>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <Clock className="size-4 text-blue-400" />
                예약된 발행
              </h3>
              <div className="space-y-2">
                {scheduledItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-3"
                  >
                    <div>
                      <div className="text-sm text-zinc-300">{item.title}</div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-600">
                        <span className={platformColors[item.platform]}>{item.platform}</span>
                        <span>{item.scheduledAt}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] rounded-lg bg-white/[0.04] text-zinc-500 border-white/[0.06]">
                      {item.method}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Publishing options */}
          <GlassCard>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                <Zap className="size-4 text-amber-400" />
                발행 옵션
              </h3>
              <div className="space-y-2">
                {[
                  { label: "즉시 발행", desc: "승인 후 바로 발행", active: false },
                  { label: "최적 시간", desc: "AI가 분석한 최적 시간에 발행", active: true },
                  { label: "수동 예약", desc: "직접 날짜/시간 지정", active: false },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    className={`w-full text-left rounded-xl border p-3 transition-all ${
                      opt.active
                        ? "border-violet-500/20 bg-violet-500/[0.06]"
                        : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-200">{opt.label}</span>
                      <div className={`size-4 rounded-full border-2 flex items-center justify-center ${
                        opt.active ? "border-violet-400" : "border-zinc-600"
                      }`}>
                        {opt.active && <div className="size-2 rounded-full bg-violet-400" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-600 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Recent Publications */}
      <GlassCard>
        <div className="p-5 pb-2">
          <h2 className="text-sm font-semibold text-white">최근 발행 기록</h2>
        </div>
        <div className="px-2 pb-2">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-zinc-600">
                <th className="px-3 py-2 text-left font-medium">콘텐츠</th>
                <th className="px-3 py-2 text-left font-medium">플랫폼</th>
                <th className="px-3 py-2 text-left font-medium">발행 시간</th>
                <th className="px-3 py-2 text-left font-medium">상태</th>
                <th className="px-3 py-2 text-right font-medium">도달</th>
                <th className="px-3 py-2 text-right font-medium">참여</th>
                <th className="px-3 py-2 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {recentPublications.map((pub, i) => (
                <tr key={i} className="group hover:bg-white/[0.03] transition-colors">
                  <td className="rounded-l-xl px-3 py-3">
                    <span className="text-sm text-zinc-200 group-hover:text-white transition-colors">
                      {pub.title}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs ${platformColors[pub.platform] ?? "text-zinc-400"}`}>
                      {pub.platform}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-500">{pub.publishedAt}</td>
                  <td className="px-3 py-3">
                    {pub.status === "success" ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : (
                      <XCircle className="size-4 text-red-400" />
                    )}
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-medium text-zinc-300">{pub.reach}</td>
                  <td className="px-3 py-3 text-right text-xs text-zinc-500">{pub.engagement}</td>
                  <td className="rounded-r-xl px-3 py-3 text-right">
                    <button className="text-zinc-600 hover:text-zinc-400">
                      <ExternalLink className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="h-6" />
    </div>
  );
}
