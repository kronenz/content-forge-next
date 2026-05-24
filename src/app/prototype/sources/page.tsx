"use client";

import {
  Plus,
  Search,
  Rss,
  Globe,
  FlaskConical,
  MoreHorizontal,
  Pause,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
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

const sourceGroups = [
  {
    name: "AI / Tech",
    sources: [
      {
        name: "TechCrunch AI",
        type: "RSS",
        icon: Rss,
        status: "active",
        interval: "1시간",
        lastCollected: "3분 전",
        todayCount: 12,
        url: "techcrunch.com/ai",
      },
      {
        name: "Hacker News",
        type: "API",
        icon: Globe,
        status: "active",
        interval: "30분",
        lastCollected: "15분 전",
        todayCount: 8,
        url: "news.ycombinator.com",
      },
      {
        name: "AI Research Agent",
        type: "Research",
        icon: FlaskConical,
        status: "active",
        interval: "매일 09:00",
        lastCollected: "오늘 09:01",
        todayCount: 5,
        url: "LLM agent 최신 동향",
      },
      {
        name: "arXiv AI Papers",
        type: "API",
        icon: Globe,
        status: "paused",
        interval: "매일 06:00",
        lastCollected: "어제 06:00",
        todayCount: 0,
        url: "arxiv.org/cs.AI",
      },
    ],
  },
  {
    name: "Marketing / Business",
    sources: [
      {
        name: "HubSpot Blog",
        type: "RSS",
        icon: Rss,
        status: "active",
        interval: "2시간",
        lastCollected: "45분 전",
        todayCount: 4,
        url: "blog.hubspot.com",
      },
      {
        name: "SaaS Weekly",
        type: "RSS",
        icon: Rss,
        status: "error",
        interval: "매일 08:00",
        lastCollected: "2일 전",
        todayCount: 0,
        url: "saasweekly.com",
      },
      {
        name: "Market Research Agent",
        type: "Research",
        icon: FlaskConical,
        status: "active",
        interval: "매주 월",
        lastCollected: "3일 전",
        todayCount: 0,
        url: "SaaS 시장 트렌드 분석",
      },
    ],
  },
];

function StatusDot({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    active: { color: "bg-emerald-500", label: "정상" },
    paused: { color: "bg-zinc-500", label: "일시정지" },
    error: { color: "bg-red-500", label: "오류" },
  };
  const c = config[status] ?? config.active!;
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        {status === "active" && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c.color} opacity-40`} />
        )}
        <span className={`relative inline-flex size-2 rounded-full ${c.color}`} />
      </div>
      <span className="text-[11px] text-zinc-500">{c.label}</span>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    RSS: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    API: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    Research: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  };
  return (
    <Badge variant="outline" className={`text-[10px] rounded-lg ${colors[type] ?? ""}`}>
      {type}
    </Badge>
  );
}

export default function SourcesPage() {
  return (
    <div className="relative p-6 space-y-6 max-w-5xl">
      <div className="pointer-events-none fixed right-0 top-0 h-[500px] w-[500px] rounded-full bg-orange-500/[0.02] blur-[120px]" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
            소스 관리
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            콘텐츠 수집 소스를 등록하고 관리합니다
          </p>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 rounded-xl gap-1.5">
          <Plus className="size-3.5" />
          소스 추가
        </Button>
      </div>

      {/* Filter / Search */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
          <Search className="size-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="소스 검색..."
            className="flex-1 bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 outline-none"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1">
          {["전체", "RSS", "API", "Research"].map((f, i) => (
            <button
              key={f}
              className={`rounded-lg px-3 py-1.5 text-xs transition-all ${
                i === 0
                  ? "bg-white/[0.08] text-white font-medium"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Source Groups */}
      {sourceGroups.map((group) => (
        <div key={group.name} className="space-y-2">
          <button className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider hover:text-zinc-300 transition-colors">
            <ChevronDown className="size-3.5" />
            {group.name}
            <span className="text-zinc-600">({group.sources.length})</span>
          </button>
          <div className="space-y-2">
            {group.sources.map((source) => (
              <GlassCard key={source.name}>
                <div className="flex items-center gap-4 p-4">
                  {/* Icon */}
                  <div className="flex size-10 items-center justify-center rounded-xl bg-white/[0.04]">
                    <source.icon className="size-4 text-zinc-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-200">
                        {source.name}
                      </span>
                      <TypeBadge type={source.type} />
                      <StatusDot status={source.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-600">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="size-3" />
                        {source.interval}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        최근: {source.lastCollected}
                      </span>
                      <span className="flex items-center gap-1">
                        <ExternalLink className="size-3" />
                        {source.url}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {source.todayCount}
                    </div>
                    <div className="text-[10px] text-zinc-600">오늘 수집</div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-2 text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-400 transition-colors">
                      {source.status === "paused" ? (
                        <RefreshCw className="size-3.5" />
                      ) : (
                        <Pause className="size-3.5" />
                      )}
                    </button>
                    <button className="rounded-lg p-2 text-zinc-600 hover:bg-white/[0.04] hover:text-zinc-400 transition-colors">
                      <MoreHorizontal className="size-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "활성 소스", value: "5", icon: CheckCircle2, color: "text-emerald-400" },
          { label: "오늘 수집", value: "29건", icon: RefreshCw, color: "text-blue-400" },
          { label: "오류", value: "1", icon: AlertCircle, color: "text-red-400" },
        ].map((s) => (
          <GlassCard key={s.label}>
            <div className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-white/[0.04] p-2">
                <s.icon className={`size-4 ${s.color}`} />
              </div>
              <div>
                <div className="text-xs text-zinc-500">{s.label}</div>
                <div className="text-lg font-bold text-white">{s.value}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="h-6" />
    </div>
  );
}
