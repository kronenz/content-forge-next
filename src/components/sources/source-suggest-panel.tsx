"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Loader2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Bot,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type SuggestedSource = {
  name: string;
  type: "rss" | "api" | "web" | "research";
  url: string;
  description: string;
  tags: string[];
  groupName: string;
  processingPrompt: string;
};

type ProviderStatus = "idle" | "loading" | "done" | "error";

type ProviderState = {
  status: ProviderStatus;
  sources: SuggestedSource[];
  error?: string;
  elapsed?: number;
  progressMsg?: string;
};

const TYPE_LABELS: Record<string, string> = {
  rss: "RSS",
  api: "API",
  web: "Web",
  research: "Research",
};

const EXAMPLE_PROMPTS = [
  "AI/LLM 기술 트렌드를 다루는 영문 RSS 피드 5개",
  "React, Next.js 프론트엔드 개발 블로그 RSS 5개",
  "한국 스타트업 투자 뉴스를 볼 수 있는 소스 5개",
  "UI/UX 디자인 영감을 얻을 수 있는 해외 사이트 5개",
  "머신러닝 논문과 리서치를 추적할 수 있는 소스 5개",
  "DevOps와 클라우드 인프라 관련 기술 블로그 5개",
  "개인 브랜딩과 뉴스레터 비즈니스 관련 소스 5개",
  "글로벌 테크 기업 공식 블로그 RSS 피드 5개",
];

export function SourceSuggestPanel() {
  const [prompt, setPrompt] = useState("");
  const [providers, setProviders] = useState<Record<string, ProviderState>>({
    claude: { status: "idle", sources: [] },
    codex: { status: "idle", sources: [] },
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<"idle" | "searching" | "results">("idle");
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const bulkCreateMutation = trpc.source.bulkCreate.useMutation({
    onSuccess: (created) => {
      toast.success(`${created.length}개 소스가 추가되었습니다.`);
      utils.source.list.invalidate();
      handleReset();
    },
    onError: (err) => {
      toast.error(`소스 추가 실패: ${err.message}`);
    },
  });

  const mergedSources = useCallback((): SuggestedSource[] => {
    const seen = new Set<string>();
    const result: SuggestedSource[] = [];
    for (const p of Object.values(providers)) {
      for (const s of p.sources) {
        const key = s.url?.toLowerCase().replace(/\/+$/, "");
        if (key && !seen.has(key)) {
          seen.add(key);
          result.push(s);
        }
      }
    }
    return result;
  }, [providers]);

  function handleReset() {
    abortRef.current?.abort();
    setPrompt("");
    setProviders({
      claude: { status: "idle", sources: [] },
      codex: { status: "idle", sources: [] },
    });
    setSelected(new Set());
    setPhase("idle");
  }

  async function handleSuggest(text?: string) {
    const promptText = (text ?? prompt).trim();
    if (!promptText) return;
    if (text) setPrompt(text);

    // Abort previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase("searching");
    setSelected(new Set());
    setProviders({
      claude: { status: "loading", sources: [] },
      codex: { status: "loading", sources: [] },
    });

    try {
      const res = await fetch("/api/suggest-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const msg = JSON.parse(line);
            handleSSEEvent(msg.event, msg);
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error("[suggest-stream] fetch error:", err);
    }

    if (!controller.signal.aborted) {
      setPhase("results");
    }
  }

  function handleSSEEvent(event: string, data: Record<string, unknown>) {
    const provider = data.provider as string;

    if (event === "status") {
      setProviders((prev) => ({
        ...prev,
        [provider]: { ...prev[provider]!, status: "loading" as const, progressMsg: "시작..." },
      }));
    } else if (event === "progress") {
      setProviders((prev) => ({
        ...prev,
        [provider]: { ...prev[provider]!, progressMsg: data.message as string },
      }));
    } else if (event === "result") {
      setProviders((prev) => ({
        ...prev,
        [provider]: {
          status: "done" as const,
          sources: data.sources as SuggestedSource[],
          elapsed: data.elapsed as number,
        },
      }));
    } else if (event === "error") {
      setProviders((prev) => ({
        ...prev,
        [provider]: {
          status: "error" as const,
          sources: [],
          error: data.error as string,
          elapsed: data.elapsed as number,
        },
      }));
    }
  }

  function toggleSelect(url: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  function toggleAll() {
    const all = mergedSources();
    if (selected.size === all.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(all.map((s) => s.url)));
    }
  }

  function handleAdd() {
    const all = mergedSources();
    const toCreate = all
      .filter((s) => selected.has(s.url))
      .map((s) => ({ name: s.name, type: s.type, url: s.url, groupName: s.groupName, tags: s.tags, processingPrompt: s.processingPrompt }));
    if (toCreate.length === 0) return;
    bulkCreateMutation.mutate({ sources: toCreate });
  }

  function scrollExamples(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  }

  const anyLoading = Object.values(providers).some((p) => p.status === "loading");
  const totalSources = mergedSources().length;

  // Auto-select all when results arrive
  useEffect(() => {
    if (phase === "results" && totalSources > 0 && selected.size === 0) {
      setSelected(new Set(mergedSources().map((s) => s.url)));
    }
  }, [phase, totalSources]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4 space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">AI 소스 추천</span>
        </div>
        {phase !== "idle" && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            초기화
          </button>
        )}
      </div>

      {/* Example prompts — horizontal scroll */}
      {phase === "idle" && (
        <div className="relative group">
          <button
            type="button"
            onClick={() => scrollExamples("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-none pb-1 px-1"
          >
            {EXAMPLE_PROMPTS.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleSuggest(ex)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs border bg-background hover:bg-primary/10 hover:border-primary/30 transition-colors whitespace-nowrap"
              >
                {ex}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollExamples("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Prompt input */}
      {phase === "idle" && (
        <div className="flex gap-2">
          <Textarea
            rows={1}
            placeholder="원하는 콘텐츠 소스를 설명하세요..."
            className="resize-none min-h-[38px] text-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSuggest();
              }
            }}
          />
          <Button
            size="sm"
            onClick={() => handleSuggest()}
            disabled={!prompt.trim()}
            className="flex-shrink-0"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            추천
          </Button>
        </div>
      )}

      {/* Searching / Results */}
      {phase !== "idle" && (
        <>
          {/* Provider status */}
          <div className="flex gap-2">
            {(["claude", "codex"] as const).map((key) => {
              const p = providers[key]!;
              return (
                <div
                  key={key}
                  className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors ${
                    p.status === "loading"
                      ? "border-blue-500/30 bg-blue-500/5"
                      : p.status === "done"
                        ? "border-green-500/30 bg-green-500/5"
                        : p.status === "error"
                          ? "border-red-500/30 bg-red-500/5"
                          : "border-border"
                  }`}
                >
                  {p.status === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />}
                  {p.status === "done" && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                  {p.status === "error" && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                  {p.status === "idle" && <Bot className="h-3.5 w-3.5 text-muted-foreground" />}
                  <div>
                    <span className="font-medium">{key === "claude" ? "Claude" : "Codex"}</span>
                    <span className="text-muted-foreground ml-1.5">
                      {p.status === "loading" && (p.progressMsg ?? "탐색 중...")}
                      {p.status === "done" && `${p.sources.length}개 (${((p.elapsed ?? 0) / 1000).toFixed(0)}s)`}
                      {p.status === "error" && "실패"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Loading state */}
          {totalSources === 0 && anyLoading && (
            <div className="flex items-center justify-center py-6 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">AI가 소스를 탐색하고 있습니다...</span>
            </div>
          )}

          {/* Results */}
          {totalSources > 0 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {anyLoading
                    ? `${totalSources}개 발견 (추가 탐색 중...)`
                    : `총 ${totalSources}개 소스`}
                </span>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {selected.size === totalSources ? "전체 해제" : "전체 선택"}
                  {" "}({selected.size}/{totalSources})
                </button>
              </div>

              <div className="grid gap-2 max-h-[40vh] overflow-y-auto pr-1">
                {mergedSources().map((source) => (
                  <label
                    key={source.url}
                    className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      selected.has(source.url)
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    }`}
                  >
                    <Checkbox
                      checked={selected.has(source.url)}
                      onCheckedChange={() => toggleSelect(source.url)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{source.name}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {TYPE_LABELS[source.type]}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {source.groupName}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {source.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-[11px] text-muted-foreground truncate">
                          {source.url}
                        </span>
                      </div>
                      {source.processingPrompt && (
                        <p className="text-[11px] text-muted-foreground/70 mt-1 line-clamp-1 italic">
                          수집 프롬프트: {source.processingPrompt}
                        </p>
                      )}
                      {source.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {source.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Action bar */}
              <div className="flex items-center justify-between pt-1">
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                  다시 추천받기
                </Button>
                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={bulkCreateMutation.isPending || selected.size === 0 || anyLoading}
                >
                  {bulkCreateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      추가 중...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      {selected.size}개 소스 추가
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* Both failed */}
          {totalSources === 0 && !anyLoading && phase === "results" && (
            <div className="flex flex-col items-center py-6 text-muted-foreground gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              <span className="text-sm">소스를 찾지 못했습니다.</span>
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                다시 시도
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
