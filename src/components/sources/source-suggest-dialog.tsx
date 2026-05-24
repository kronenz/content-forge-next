"use client";

import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
};

type ProviderStatus = "idle" | "loading" | "done" | "error";

type ProviderState = {
  status: ProviderStatus;
  sources: SuggestedSource[];
  error?: string;
  elapsed?: number;
};

const TYPE_LABELS: Record<string, string> = {
  rss: "RSS",
  api: "API",
  web: "Web",
  research: "Research",
};

const PROVIDER_LABELS: Record<string, string> = {
  claude: "Claude",
  codex: "Codex",
};

interface SourceSuggestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SourceSuggestDialog({
  open,
  onOpenChange,
}: SourceSuggestDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [providers, setProviders] = useState<Record<string, ProviderState>>({
    claude: { status: "idle", sources: [] },
    codex: { status: "idle", sources: [] },
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [step, setStep] = useState<"input" | "searching" | "select">("input");
  const abortRef = useRef(false);

  const utils = trpc.useUtils();
  const suggestMutation = trpc.source.suggest.useMutation();
  const bulkCreateMutation = trpc.source.bulkCreate.useMutation({
    onSuccess: (created) => {
      toast.success(`${created.length}개 소스가 추가되었습니다.`);
      utils.source.list.invalidate();
      handleClose();
    },
    onError: (err) => {
      toast.error(`소스 추가 실패: ${err.message}`);
    },
  });

  // Deduplicated merged sources from all providers
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

  function handleClose() {
    abortRef.current = true;
    setPrompt("");
    setProviders({
      claude: { status: "idle", sources: [] },
      codex: { status: "idle", sources: [] },
    });
    setSelected(new Set());
    setStep("input");
    onOpenChange(false);
  }

  async function callProvider(provider: "claude" | "codex", promptText: string) {
    const start = Date.now();
    setProviders((prev) => ({
      ...prev,
      [provider]: { status: "loading" as const, sources: [] },
    }));

    try {
      const result = await suggestMutation.mutateAsync({
        prompt: promptText,
        provider,
      });

      if (abortRef.current) return;

      const elapsed = Date.now() - start;

      // 서버에서 에러를 잡아서 빈 결과 + error 메시지로 반환한 경우
      if (result.error) {
        setProviders((prev) => ({
          ...prev,
          [provider]: {
            status: "error" as const,
            sources: [],
            error: result.error,
            elapsed,
          },
        }));
      } else {
        setProviders((prev) => ({
          ...prev,
          [provider]: {
            status: "done" as const,
            sources: result.sources,
            elapsed,
          },
        }));
      }
    } catch (err) {
      if (abortRef.current) return;

      const elapsed = Date.now() - start;
      setProviders((prev) => ({
        ...prev,
        [provider]: {
          status: "error" as const,
          sources: [],
          error: err instanceof Error ? err.message : String(err),
          elapsed,
        },
      }));
    }
  }

  async function handleSuggest() {
    if (!prompt.trim()) return;
    abortRef.current = false;
    setStep("searching");
    setSelected(new Set());

    // Fire both providers in parallel
    await Promise.allSettled([
      callProvider("claude", prompt.trim()),
      callProvider("codex", prompt.trim()),
    ]);

    if (!abortRef.current) {
      setStep("select");
      // Auto-select all
      const allSources = mergedSources();
      setSelected(new Set(allSources.map((s) => s.url)));
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
      .map((s) => ({
        name: s.name,
        type: s.type,
        url: s.url,
        groupName: s.groupName,
        tags: s.tags,
      }));
    if (toCreate.length === 0) return;
    bulkCreateMutation.mutate({ sources: toCreate });
  }

  const allDone = Object.values(providers).every(
    (p) => p.status === "done" || p.status === "error",
  );
  const anyLoading = Object.values(providers).some(
    (p) => p.status === "loading",
  );
  const totalSources = mergedSources().length;
  const isPending = bulkCreateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI 소스 추천
          </DialogTitle>
          <DialogDescription>
            원하는 콘텐츠 주제를 설명하면 AI가 관련 데이터 소스를 추천합니다.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Prompt Input */}
        {step === "input" && (
          <div className="grid gap-4 py-2">
            <Textarea
              rows={3}
              placeholder='예: AI/LLM 기술 트렌드를 다루는 영문 RSS 피드 10개 추천해줘'
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSuggest();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Ctrl+Enter로 빠르게 실행할 수 있습니다.
            </p>
          </div>
        )}

        {/* Step 2: Searching — show provider status + progressive results */}
        {(step === "searching" || step === "select") && (
          <div className="grid gap-4 py-2">
            {/* Provider Status Panel */}
            <div className="flex gap-3">
              {(["claude", "codex"] as const).map((key) => {
                const p = providers[key]!;
                return (
                  <div
                    key={key}
                    className={`flex-1 flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                      p.status === "loading"
                        ? "border-blue-500/30 bg-blue-500/5"
                        : p.status === "done"
                          ? "border-green-500/30 bg-green-500/5"
                          : p.status === "error"
                            ? "border-red-500/30 bg-red-500/5"
                            : "border-border"
                    }`}
                  >
                    {p.status === "loading" && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500 flex-shrink-0" />
                    )}
                    {p.status === "done" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                    {p.status === "error" && (
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                    {p.status === "idle" && (
                      <Bot className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium">
                        {PROVIDER_LABELS[key]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.status === "loading" && "탐색 중..."}
                        {p.status === "done" &&
                          `${p.sources.length}개 발견 (${((p.elapsed ?? 0) / 1000).toFixed(1)}s)`}
                        {p.status === "error" && "실패"}
                        {p.status === "idle" && "대기"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Results count */}
            {totalSources > 0 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {anyLoading
                    ? `${totalSources}개 소스 발견 (추가 탐색 중...)`
                    : `총 ${totalSources}개 소스 (중복 제거 완료)`}
                </div>
                {step === "select" && (
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {selected.size === totalSources
                      ? "전체 해제"
                      : "전체 선택"}{" "}
                    ({selected.size}/{totalSources})
                  </button>
                )}
              </div>
            )}

            {/* Source list — shows progressively */}
            {totalSources > 0 && (
              <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                {mergedSources().map((source) => (
                  <label
                    key={source.url}
                    className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
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
                        <span className="font-medium text-sm">
                          {source.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {TYPE_LABELS[source.type]}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {source.groupName}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {source.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">
                          {source.url}
                        </span>
                      </div>
                      {source.tags.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {source.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Empty state while searching */}
            {totalSources === 0 && anyLoading && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">AI가 소스를 탐색하고 있습니다...</span>
              </div>
            )}

            {/* Both failed */}
            {totalSources === 0 && allDone && !anyLoading && step === "select" && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                <XCircle className="h-6 w-6 text-red-400" />
                <span className="text-sm">소스를 찾지 못했습니다. 다른 프롬프트로 시도해 보세요.</span>
              </div>
            )}

            {step === "select" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStep("input");
                  setProviders({
                    claude: { status: "idle", sources: [] },
                    codex: { status: "idle", sources: [] },
                  });
                }}
              >
                다시 추천받기
              </Button>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          {step === "input" ? (
            <Button onClick={handleSuggest} disabled={!prompt.trim()}>
              <Sparkles className="mr-2 h-4 w-4" />
              추천받기
            </Button>
          ) : (
            <Button
              onClick={handleAdd}
              disabled={isPending || selected.size === 0 || anyLoading}
            >
              {bulkCreateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  추가 중...
                </>
              ) : (
                `${selected.size}개 소스 추가`
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
