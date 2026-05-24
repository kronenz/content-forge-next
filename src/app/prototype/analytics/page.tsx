"use client";

import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

/* Simple sparkline SVG */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 32;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${points} ${w},${h}`}
        fill={`url(#grad-${color})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const topContents = [
  { title: "AI 마케팅 트렌드 2026", platform: "LinkedIn", reach: "5.2K", engagement: "4.8%", trend: "+23%" },
  { title: "클라우드 비용 최적화 가이드", platform: "Blog", reach: "3.8K", engagement: "4.2min", trend: "+15%" },
  { title: "SaaS 성장 전략 핵심 정리", platform: "X", reach: "2.9K", engagement: "2.1%", trend: "+8%" },
  { title: "리더십과 AI의 만남", platform: "LinkedIn", reach: "2.1K", engagement: "3.5%", trend: "+12%" },
  { title: "스타트업 CTO가 알아야 할 것", platform: "Blog", reach: "1.8K", engagement: "3.8min", trend: "-3%" },
];

const qualityTrend = [
  { week: "W1", quality: 7.2, accuracy: 7.5, humanlike: 6.8 },
  { week: "W2", quality: 7.8, accuracy: 7.9, humanlike: 7.2 },
  { week: "W3", quality: 8.1, accuracy: 8.4, humanlike: 7.5 },
  { week: "W4", quality: 8.5, accuracy: 8.8, humanlike: 7.8 },
  { week: "W5", quality: 8.3, accuracy: 9.0, humanlike: 7.5 },
];

const platformColors: Record<string, string> = {
  LinkedIn: "text-blue-400",
  Blog: "text-violet-400",
  X: "text-zinc-400",
  Instagram: "text-pink-400",
};

export default function AnalyticsPage() {
  return (
    <div className="relative p-6 space-y-6 max-w-6xl">
      <div className="pointer-events-none fixed right-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.02] blur-[120px]" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            분석
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            콘텐츠 성과와 비용을 분석합니다
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1">
          {["7일", "30일", "90일", "전체"].map((f, i) => (
            <Button
              key={f}
              variant="ghost"
              size="sm"
              className={`rounded-lg text-xs ${
                i === 1 ? "bg-white/[0.08] text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "총 도달",
            value: "124.5K",
            change: "+23%",
            up: true,
            icon: Eye,
            gradient: "from-cyan-500/20 to-cyan-500/5",
            color: "text-cyan-400",
            sparkData: [30, 45, 38, 55, 48, 62, 75, 68, 82, 90, 85, 95],
            sparkColor: "#06b6d4",
          },
          {
            label: "발행 콘텐츠",
            value: "156건",
            change: "+12%",
            up: true,
            icon: BarChart3,
            gradient: "from-violet-500/20 to-violet-500/5",
            color: "text-violet-400",
            sparkData: [8, 12, 10, 15, 13, 18, 16, 20, 22, 19, 24, 26],
            sparkColor: "#8b5cf6",
          },
          {
            label: "평균 참여율",
            value: "3.8%",
            change: "+0.5%",
            up: true,
            icon: Users,
            gradient: "from-emerald-500/20 to-emerald-500/5",
            color: "text-emerald-400",
            sparkData: [2.5, 2.8, 3.0, 2.9, 3.2, 3.1, 3.4, 3.5, 3.3, 3.6, 3.8, 3.8],
            sparkColor: "#10b981",
          },
          {
            label: "AI 비용",
            value: "$48.20",
            change: "-8%",
            up: false,
            icon: DollarSign,
            gradient: "from-amber-500/20 to-amber-500/5",
            color: "text-amber-400",
            sparkData: [5.2, 4.8, 5.5, 4.2, 3.8, 4.5, 3.9, 3.2, 4.1, 3.5, 3.8, 3.4],
            sparkColor: "#f59e0b",
          },
        ].map((s) => (
          <GlassCard key={s.label}>
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${s.gradient} p-5`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">{s.label}</span>
                <s.icon className={`size-3.5 ${s.color}`} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{s.value}</span>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                  {s.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {s.change}
                </span>
              </div>
              <div className="mt-3">
                <Sparkline data={s.sparkData} color={s.sparkColor} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Platform Performance */}
        <GlassCard className="col-span-3">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-white mb-4">플랫폼별 성과</h2>
            <div className="space-y-4">
              {[
                { name: "LinkedIn", pct: 45, reach: "56K", engagement: "4.2%", trend: "+23%", up: true, color: "#3b82f6", barData: [35, 42, 38, 48, 52, 45, 56] },
                { name: "Blog", pct: 28, reach: "35K", engagement: "3.2min", trend: "+15%", up: true, color: "#8b5cf6", barData: [20, 25, 28, 30, 32, 35, 35] },
                { name: "X (Twitter)", pct: 17, reach: "21K", engagement: "2.1%", trend: "-5%", up: false, color: "#71717a", barData: [18, 22, 20, 25, 21, 19, 21] },
                { name: "Instagram", pct: 10, reach: "12K", engagement: "5.3%", trend: "+12%", up: true, color: "#ec4899", barData: [5, 8, 7, 10, 9, 11, 12] },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-4">
                  <div className="w-24 shrink-0">
                    <div className="text-sm font-medium text-zinc-200">{p.name}</div>
                    <div className="text-[11px] text-zinc-600">{p.pct}% of total</div>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${p.pct * 2}%`,
                          backgroundColor: p.color,
                          boxShadow: `0 0 8px ${p.color}40`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <div className="text-sm font-bold text-white">{p.reach}</div>
                  </div>
                  <div className="w-16 text-right text-xs text-zinc-500">{p.engagement}</div>
                  <div className={`w-12 text-right text-xs font-medium ${p.up ? "text-emerald-400" : "text-red-400"}`}>
                    {p.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Quality Trend */}
        <GlassCard className="col-span-2">
          <div className="p-5">
            <h2 className="text-sm font-semibold text-white mb-4">품질 추이</h2>
            <div className="space-y-3">
              {qualityTrend.map((w) => (
                <div key={w.week} className="flex items-center gap-3">
                  <span className="text-[11px] text-zinc-600 w-8">{w.week}</span>
                  <div className="flex-1 flex items-center gap-2">
                    {[
                      { label: "품질", score: w.quality, color: "#10b981" },
                      { label: "정확", score: w.accuracy, color: "#06b6d4" },
                      { label: "자연", score: w.humanlike, color: "#f59e0b" },
                    ].map((m) => (
                      <div key={m.label} className="flex-1">
                        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${m.score * 10}%`,
                              backgroundColor: m.color,
                              boxShadow: `0 0 4px ${m.color}30`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-zinc-400 w-8 text-right">
                    {((w.quality + w.accuracy + w.humanlike) / 3).toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4">
              {[
                { label: "품질", color: "#10b981" },
                { label: "정확도", color: "#06b6d4" },
                { label: "자연스러움", color: "#f59e0b" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-[10px] text-zinc-600">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Top Contents */}
      <GlassCard>
        <div className="p-5 pb-2">
          <h2 className="text-sm font-semibold text-white">인기 콘텐츠 TOP 5</h2>
        </div>
        <div className="px-2 pb-2">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-zinc-600">
                <th className="px-3 py-2 text-left font-medium">#</th>
                <th className="px-3 py-2 text-left font-medium">콘텐츠</th>
                <th className="px-3 py-2 text-left font-medium">플랫폼</th>
                <th className="px-3 py-2 text-right font-medium">도달</th>
                <th className="px-3 py-2 text-right font-medium">참여</th>
                <th className="px-3 py-2 text-right font-medium">추이</th>
              </tr>
            </thead>
            <tbody>
              {topContents.map((c, i) => (
                <tr key={i} className="group hover:bg-white/[0.03] transition-colors">
                  <td className="rounded-l-xl px-3 py-3">
                    <span className={`text-sm font-bold ${i < 3 ? "text-violet-400" : "text-zinc-600"}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="text-sm text-zinc-200 group-hover:text-white transition-colors">
                      {c.title}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs ${platformColors[c.platform] ?? "text-zinc-400"}`}>
                      {c.platform}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-medium text-zinc-300">{c.reach}</td>
                  <td className="px-3 py-3 text-right text-xs text-zinc-500">{c.engagement}</td>
                  <td className="rounded-r-xl px-3 py-3 text-right">
                    <span className={`flex items-center justify-end gap-0.5 text-xs font-medium ${
                      c.trend.startsWith("+") ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {c.trend.startsWith("+") ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                      {c.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard>
          <div className="p-5">
            <h3 className="text-xs text-zinc-400 font-medium uppercase tracking-wider">콘텐츠당 평균 비용</h3>
            <div className="text-2xl font-bold text-white mt-2">$0.31</div>
            <div className="text-xs text-emerald-400 mt-1">-12% vs 지난달</div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="p-5">
            <h3 className="text-xs text-zinc-400 font-medium uppercase tracking-wider">총 토큰 사용</h3>
            <div className="text-2xl font-bold text-white mt-2">2.4M</div>
            <div className="text-xs text-zinc-500 mt-1">입력 1.8M / 출력 0.6M</div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="p-5">
            <h3 className="text-xs text-zinc-400 font-medium uppercase tracking-wider">ROI 추정</h3>
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mt-2">
              324%
            </div>
            <div className="text-xs text-zinc-500 mt-1">도달 가치 기준</div>
          </div>
        </GlassCard>
      </div>

      <div className="h-6" />
    </div>
  );
}
