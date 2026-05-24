"use client";

import {
  Eye,
  ThumbsUp,
  ThumbsDown,
  Pencil,
  Filter,
  LayoutGrid,
  List,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const contents = [
  {
    id: 1,
    title: "AI 마케팅 트렌드 2026: 실무자가 알아야 할 5가지",
    status: "review",
    platforms: [
      { name: "Blog", wordCount: 1200, score: 8.5 },
      { name: "LinkedIn", wordCount: 450, score: 8.8 },
    ],
    source: "TechCrunch",
    pipelineId: "#1234",
    createdAt: "2시간 전",
    scores: {
      quality: 8.5,
      accuracy: 9.0,
      humanlike: 7.5,
      platform: 8.0,
      culture: 8.5,
    },
    aiDetection: 15,
    comments: 2,
  },
  {
    id: 2,
    title: "클라우드 인프라 비용 최적화: 실전 가이드",
    status: "approved",
    platforms: [
      { name: "Blog", wordCount: 1800, score: 9.1 },
      { name: "LinkedIn", wordCount: 380, score: 8.7 },
    ],
    source: "AWS Blog",
    pipelineId: "#1230",
    createdAt: "5시간 전",
    scores: {
      quality: 9.1,
      accuracy: 9.3,
      humanlike: 8.2,
      platform: 8.8,
      culture: 9.0,
    },
    aiDetection: 8,
    comments: 0,
  },
  {
    id: 3,
    title: "블록체인 규제의 현재와 미래",
    status: "revision",
    platforms: [{ name: "Blog", wordCount: 950, score: 6.2 }],
    source: "CoinDesk",
    pipelineId: "#1232",
    createdAt: "3시간 전",
    scores: {
      quality: 6.2,
      accuracy: 5.8,
      humanlike: 7.0,
      platform: 6.5,
      culture: 6.8,
    },
    aiDetection: 32,
    comments: 3,
  },
  {
    id: 4,
    title: "리모트 워크 생산성: 데이터로 보는 진실",
    status: "draft",
    platforms: [
      { name: "Blog", wordCount: 1400, score: null },
      { name: "LinkedIn", wordCount: 420, score: null },
      { name: "X", wordCount: 280, score: null },
    ],
    source: "Research Agent",
    pipelineId: "#1231",
    createdAt: "4시간 전",
    scores: null,
    aiDetection: null,
    comments: 0,
  },
];

function ContentStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    draft: { label: "초안", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
    review: { label: "검토 대기", className: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
    revision: { label: "수정 필요", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    approved: { label: "승인됨", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    published: { label: "발행됨", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  };
  const c = config[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={`text-[11px] rounded-lg ${c.className}`}>
      {c.label}
    </Badge>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 8 ? "#10b981" : score >= 6 ? "#f59e0b" : "#ef4444";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-zinc-500">{label}</span>
        <span className="text-[11px] font-mono text-zinc-300">{score.toFixed(1)}</span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${score * 10}%`,
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}

export default function ContentsPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const selected = contents.find((c) => c.id === selectedId) ?? contents[0]!;

  return (
    <div className="relative flex h-full">
      <div className="pointer-events-none fixed right-0 top-0 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.03] blur-[120px]" />

      {/* Left: Content List */}
      <div className="w-[420px] border-r border-white/[0.04] p-4 space-y-4 overflow-auto">
        <div>
          <h1 className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
            콘텐츠
          </h1>
          <p className="text-[11px] text-zinc-500 mt-1">검토 대기 4건</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1 flex-1">
            {["전체", "검토", "수정", "승인"].map((f, i) => (
              <button
                key={f}
                className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] transition-all ${
                  i === 0 ? "bg-white/[0.08] text-white font-medium" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-zinc-500 hover:text-zinc-300">
            <Filter className="size-3.5" />
          </button>
        </div>

        {/* Content List */}
        <div className="space-y-2">
          {contents.map((content) => (
            <button
              key={content.id}
              onClick={() => setSelectedId(content.id)}
              className={`w-full text-left rounded-xl border p-3 transition-all ${
                content.id === selectedId
                  ? "border-violet-500/20 bg-violet-500/[0.06]"
                  : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium text-zinc-200 line-clamp-2">
                  {content.title}
                </span>
                <ContentStatusBadge status={content.status} />
              </div>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-600">
                <span>{content.source}</span>
                <span>{content.createdAt}</span>
                <span className="flex gap-1">
                  {content.platforms.map((p) => (
                    <span key={p.name} className="rounded bg-white/[0.04] px-1 py-0.5 text-[10px]">
                      {p.name}
                    </span>
                  ))}
                </span>
                {content.comments > 0 && (
                  <span className="flex items-center gap-0.5">
                    <MessageSquare className="size-3" />
                    {content.comments}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Content Detail */}
      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* Title & Actions */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">{selected.title}</h2>
            <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-600">
              <span>소스: {selected.source}</span>
              <span>파이프라인: {selected.pipelineId}</span>
              <span>{selected.createdAt}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-white/[0.08] bg-white/[0.02] text-zinc-300 rounded-xl gap-1.5 text-xs">
              <Pencil className="size-3" />
              수정
            </Button>
            <Button variant="outline" className="border-red-500/20 bg-red-500/[0.05] text-red-400 hover:bg-red-500/10 rounded-xl gap-1.5 text-xs">
              <ThumbsDown className="size-3" />
              반려
            </Button>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 rounded-xl gap-1.5 text-xs">
              <ThumbsUp className="size-3" />
              승인
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Platform Preview */}
          <div className="col-span-2 space-y-3">
            {/* Platform tabs */}
            <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.03] p-1 w-fit">
              {selected.platforms.map((p, i) => (
                <button
                  key={p.name}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-all flex items-center gap-1.5 ${
                    i === 0 ? "bg-white/[0.08] text-white font-medium" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {p.name}
                  {p.score !== null && (
                    <span className={`font-mono text-[10px] ${p.score >= 8 ? "text-emerald-400" : "text-amber-400"}`}>
                      {p.score.toFixed(1)}
                    </span>
                  )}
                </button>
              ))}
              <button className="rounded-lg px-2 py-1.5 text-zinc-600 hover:text-zinc-400">
                <ExternalLink className="size-3" />
              </button>
            </div>

            {/* Preview Card */}
            <GlassCard>
              <div className="p-5 space-y-4">
                {/* LinkedIn-style preview */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600" />
                    <div>
                      <div className="text-sm font-medium text-zinc-200">사용자 이름</div>
                      <div className="text-[11px] text-zinc-600">콘텐츠 크리에이터 | AI & Tech</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-zinc-300 leading-relaxed">
                    <p>
                      {selected.title}에 대한 프리뷰 콘텐츠입니다.
                    </p>
                    <p className="text-zinc-400">
                      이 영역에 실제 가공된 콘텐츠가 플랫폼 네이티브 형태로
                      렌더링됩니다. LinkedIn의 경우 프로필 카드, 본문, 해시태그,
                      반응 버튼 등이 실제와 동일하게 표시됩니다.
                    </p>
                    <p className="text-zinc-500">
                      #AI마케팅 #콘텐츠자동화 #SaaS
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-2 border-t border-white/[0.04] text-[11px] text-zinc-600">
                    <span>좋아요</span>
                    <span>댓글</span>
                    <span>공유</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Diff view hint */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-zinc-500 text-xs rounded-lg">
                <Eye className="size-3 mr-1" />
                원본 비교
              </Button>
              <Button variant="ghost" size="sm" className="text-zinc-500 text-xs rounded-lg">
                <LayoutGrid className="size-3 mr-1" />
                단계별 변경
              </Button>
              <Button variant="ghost" size="sm" className="text-zinc-500 text-xs rounded-lg">
                <List className="size-3 mr-1" />
                전체 텍스트
              </Button>
            </div>
          </div>

          {/* Quality Scorecard */}
          <div className="space-y-3">
            <GlassCard>
              <div className="p-4 space-y-3">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  품질 점수
                </h3>
                {selected.scores ? (
                  <>
                    <ScoreBar label="품질 (Quality)" score={selected.scores.quality} />
                    <ScoreBar label="정확도 (Accuracy)" score={selected.scores.accuracy} />
                    <ScoreBar label="자연스러움 (Human-like)" score={selected.scores.humanlike} />
                    <ScoreBar label="플랫폼 적합 (Platform-fit)" score={selected.scores.platform} />
                    <ScoreBar label="문화 적합 (Culture-fit)" score={selected.scores.culture} />
                    <div className="h-px bg-white/[0.04]" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">종합</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                        {(
                          (selected.scores.quality +
                            selected.scores.accuracy +
                            selected.scores.humanlike +
                            selected.scores.platform +
                            selected.scores.culture) /
                          5
                        ).toFixed(1)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-zinc-600 text-center py-4">
                    점수 산출 전
                  </div>
                )}
              </div>
            </GlassCard>

            {/* AI Detection */}
            <GlassCard>
              <div className="p-4">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                  AI 탐지율
                </h3>
                {selected.aiDetection !== null ? (
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold font-mono ${
                        selected.aiDetection <= 20
                          ? "text-emerald-400"
                          : selected.aiDetection <= 40
                            ? "text-amber-400"
                            : "text-red-400"
                      }`}
                    >
                      {selected.aiDetection}%
                    </div>
                    <div className="text-[11px] text-zinc-600 mt-1">
                      {selected.aiDetection <= 20 ? "안전" : selected.aiDetection <= 40 ? "주의" : "위험"}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-zinc-600 text-center py-2">분석 전</div>
                )}
              </div>
            </GlassCard>

            {/* Feedback */}
            <GlassCard>
              <div className="p-4">
                <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                  피드백
                </h3>
                <textarea
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-violet-500/30 resize-none h-20"
                  placeholder="수정 요청사항을 입력하세요..."
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
