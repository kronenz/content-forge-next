"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  Inbox,
  Loader2,
  ClipboardCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  TrendingUp,
  Sparkles,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  {
    label: "Collected",
    value: "47",
    change: "+12%",
    up: true,
    icon: Inbox,
    gradient: "from-violet-500/20 to-violet-500/5",
    iconColor: "text-violet-400",
    borderColor: "border-violet-500/10",
  },
  {
    label: "Processing",
    value: "5",
    change: "",
    up: true,
    icon: Loader2,
    gradient: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-400",
    borderColor: "border-blue-500/10",
  },
  {
    label: "Pending Review",
    value: "12",
    change: "-3%",
    up: false,
    icon: ClipboardCheck,
    gradient: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/10",
  },
  {
    label: "Published",
    value: "31",
    change: "+8%",
    up: true,
    icon: Send,
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/10",
  },
];

const pipelineRuns = [
  {
    id: "#1234",
    title: "AI Marketing Trends 2026",
    status: "completed",
    source: "TechCrunch",
    duration: "1m 32s",
    platforms: ["Blog", "LinkedIn"],
    quality: 8.5,
  },
  {
    id: "#1233",
    title: "SaaS Growth Strategies",
    status: "running",
    source: "HackerNews",
    duration: "45s",
    platforms: ["LinkedIn", "X"],
    quality: null,
  },
  {
    id: "#1232",
    title: "Blockchain Regulation Updates",
    status: "warning",
    source: "CoinDesk",
    duration: "2m 10s",
    platforms: ["Blog"],
    quality: 6.2,
  },
  {
    id: "#1231",
    title: "Remote Work Productivity",
    status: "failed",
    source: "Research Agent",
    duration: "3m 05s",
    platforms: ["Blog", "LinkedIn", "X"],
    quality: null,
  },
  {
    id: "#1230",
    title: "Cloud Infrastructure Cost Optimization",
    status: "completed",
    source: "AWS Blog",
    duration: "1m 48s",
    platforms: ["Blog", "LinkedIn"],
    quality: 9.1,
  },
];

const feedItems = [
  {
    time: "14:32",
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    glowColor: "shadow-emerald-500/20",
    text: '"AI Marketing Trends" published to LinkedIn',
  },
  {
    time: "14:28",
    icon: Activity,
    iconColor: "text-blue-400",
    glowColor: "shadow-blue-500/20",
    text: '"SaaS Growth Strategies" — Editor processing',
  },
  {
    time: "14:25",
    icon: Inbox,
    iconColor: "text-violet-400",
    glowColor: "shadow-violet-500/20",
    text: "3 articles collected from TechCrunch",
  },
  {
    time: "14:20",
    icon: AlertTriangle,
    iconColor: "text-amber-400",
    glowColor: "shadow-amber-500/20",
    text: '"Blockchain Regulation" — Fact Check warning (1)',
  },
  {
    time: "14:15",
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    glowColor: "shadow-emerald-500/20",
    text: '"Cloud Infrastructure" published to Blog',
  },
  {
    time: "14:10",
    icon: TrendingUp,
    iconColor: "text-cyan-400",
    glowColor: "shadow-cyan-500/20",
    text: "LinkedIn engagement +23% this week",
  },
];

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

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

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    completed: {
      label: "Completed",
      className:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    running: {
      label: "Running",
      className:
        "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse",
    },
    warning: {
      label: "Warning",
      className:
        "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    failed: {
      label: "Failed",
      className:
        "bg-red-500/10 text-red-400 border-red-500/20",
    },
  };
  const c = config[status] ?? { label: "Unknown", className: "" };
  return (
    <Badge variant="outline" className={`text-[11px] ${c.className}`}>
      {c.label}
    </Badge>
  );
}

function QualityScore({ score }: { score: number | null }) {
  if (score === null)
    return <span className="text-zinc-600">--</span>;
  const color =
    score >= 8
      ? "text-emerald-400"
      : score >= 6
        ? "text-amber-400"
        : "text-red-400";
  return (
    <span className={`font-mono font-semibold ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PrototypeDashboard() {
  return (
    <div className="relative p-6 space-y-6 max-w-7xl">
      {/* Background decoration */}
      <div className="pointer-events-none fixed right-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/[0.03] blur-[120px]" />
      <div className="pointer-events-none fixed left-1/3 bottom-0 h-[400px] w-[400px] rounded-full bg-indigo-500/[0.03] blur-[100px]" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Content pipeline overview
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg bg-white/[0.08] text-white text-xs hover:bg-white/[0.12]"
          >
            Today
          </Button>
          <Button variant="ghost" size="sm" className="rounded-lg text-zinc-500 text-xs hover:text-zinc-300">
            Week
          </Button>
          <Button variant="ghost" size="sm" className="rounded-lg text-zinc-500 text-xs hover:text-zinc-300">
            Month
          </Button>
        </div>
      </div>

      {/* Stats Cards - Bento style */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <GlassCard key={stat.label}>
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${stat.gradient} p-5`}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`rounded-lg bg-white/[0.06] p-1.5 ${stat.iconColor}`}>
                  <stat.icon className="size-3.5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </span>
                {stat.change && (
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      stat.up ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {stat.up ? (
                      <ArrowUpRight className="size-3" />
                    ) : (
                      <ArrowDownRight className="size-3" />
                    )}
                    {stat.change}
                  </span>
                )}
              </div>
              {/* Decorative gradient circle */}
              <div className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-full bg-white/[0.03] blur-xl" />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Grid: Pipeline + Feed */}
      <div className="grid grid-cols-5 gap-3">
        {/* Pipeline Runs Table */}
        <GlassCard className="col-span-3">
          <div className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">
                Recent Pipelines
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                View All
              </Button>
            </div>
          </div>
          <div className="px-2 pb-2">
            <table className="w-full">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-zinc-600">
                  <th className="px-3 py-2 text-left font-medium">Title</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Platforms</th>
                  <th className="px-3 py-2 text-right font-medium">Quality</th>
                  <th className="px-3 py-2 text-right font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {pipelineRuns.map((run) => (
                  <tr
                    key={run.id}
                    className="group cursor-pointer rounded-xl transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="rounded-l-xl px-3 py-3">
                      <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                        {run.title}
                      </div>
                      <div className="text-[11px] text-zinc-600">{run.source}</div>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1">
                        {run.platforms.map((p) => (
                          <span
                            key={p}
                            className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-zinc-400"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <QualityScore score={run.quality} />
                    </td>
                    <td className="rounded-r-xl px-3 py-3 text-right">
                      <span className="flex items-center justify-end gap-1 text-xs text-zinc-500">
                        <Clock className="size-3" />
                        {run.duration}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Live Feed */}
        <GlassCard className="col-span-2">
          <div className="p-5 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Live Feed
            </h2>
          </div>
          <div className="space-y-0.5 px-2 pb-2">
            {feedItems.map((item, i) => (
              <div
                key={i}
                className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-white/[0.03]"
              >
                <div className={`mt-0.5 rounded-lg bg-white/[0.04] p-1 shadow-sm ${item.glowColor}`}>
                  <item.icon className={`size-3.5 ${item.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug text-zinc-300 group-hover:text-zinc-200 transition-colors">
                    {item.text}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Pipeline Visualization */}
      <GlassCard>
        <div className="p-5 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">
                Pipeline Run #1233
              </h2>
              <StatusBadge status="running" />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              SaaS Growth Strategies — HackerNews | Elapsed: 45s
            </p>
          </div>
          <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 text-xs gap-1.5">
            <Play className="size-3" />
            Re-run
          </Button>
        </div>
        <div className="px-5 pb-5">
          <div className="flex items-center gap-0 overflow-x-auto py-3">
            {[
              { name: "Analyst", status: "done", time: "12s" },
              { name: "Writer", status: "done", time: "28s" },
              { name: "Editor", status: "active", time: "5s" },
              { name: "Designer", status: "pending", time: "" },
              { name: "SEO", status: "pending", time: "" },
              { name: "Fact Check", status: "pending", time: "" },
              { name: "Formatter", status: "pending", time: "" },
            ].map((step, i, arr) => (
              <div key={step.name} className="flex items-center">
                <div
                  className={`relative flex flex-col items-center gap-1.5 rounded-xl border px-5 py-3.5 min-w-[110px] transition-all ${
                    step.status === "done"
                      ? "border-emerald-500/20 bg-emerald-500/[0.06]"
                      : step.status === "active"
                        ? "border-violet-500/30 bg-violet-500/[0.08] shadow-lg shadow-violet-500/10"
                        : "border-white/[0.04] bg-white/[0.02]"
                  }`}
                >
                  {step.status === "active" && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 animate-pulse" />
                  )}
                  <div className="relative flex items-center gap-1.5">
                    {step.status === "done" ? (
                      <CheckCircle2 className="size-3.5 text-emerald-400" />
                    ) : step.status === "active" ? (
                      <Loader2 className="size-3.5 text-violet-400 animate-spin" />
                    ) : (
                      <Clock className="size-3.5 text-zinc-600" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        step.status === "done"
                          ? "text-emerald-400"
                          : step.status === "active"
                            ? "text-violet-300"
                            : "text-zinc-600"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {step.time && (
                    <span className="relative text-[10px] text-zinc-500">
                      {step.time}
                    </span>
                  )}
                </div>
                {i < arr.length - 1 && (
                  <div className="flex items-center px-0.5">
                    <div
                      className={`h-px w-8 ${
                        step.status === "done"
                          ? "bg-gradient-to-r from-emerald-500/40 to-emerald-500/10"
                          : "bg-white/[0.06]"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Platform Performance - Bento */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            platform: "LinkedIn",
            gradient: "from-blue-600 to-blue-500",
            reach: "56K",
            engagement: "4.2%",
            pct: 45,
            trend: "+23%",
          },
          {
            platform: "Blog",
            gradient: "from-violet-600 to-violet-500",
            reach: "35K",
            engagement: "3.2min",
            pct: 28,
            trend: "+15%",
          },
          {
            platform: "X (Twitter)",
            gradient: "from-zinc-600 to-zinc-500",
            reach: "21K",
            engagement: "2.1% RT",
            pct: 17,
            trend: "-5%",
          },
          {
            platform: "Instagram",
            gradient: "from-pink-600 to-rose-500",
            reach: "12K",
            engagement: "5.3% save",
            pct: 10,
            trend: "+12%",
          },
        ].map((p) => (
          <GlassCard key={p.platform}>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-200">
                  {p.platform}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    p.trend.startsWith("+")
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {p.trend}
                </span>
              </div>
              <div className="mt-3 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${p.gradient} transition-all`}
                  style={{ width: `${p.pct * 2.2}%` }}
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-white">{p.reach}</span>
                <span className="text-[11px] text-zinc-500">
                  {p.engagement}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 gap-1.5 rounded-xl">
          <Sparkles className="size-3.5" />
          New Pipeline
        </Button>
        <Button variant="outline" className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06] hover:text-white rounded-xl">
          Add Source
        </Button>
        <Button variant="outline" className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06] hover:text-white rounded-xl">
          View Reports
        </Button>
      </div>

      {/* Bottom spacing */}
      <div className="h-6" />
    </div>
  );
}
