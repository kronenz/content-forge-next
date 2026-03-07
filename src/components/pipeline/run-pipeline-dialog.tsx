"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface RunPipelineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function RunPipelineDialog({
  open,
  onOpenChange,
  onSuccess,
}: RunPipelineDialogProps) {
  const [step, setStep] = useState<"template" | "content">("template");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  const { data: templates } = trpc.pipelineTemplate.list.useQuery(
    undefined,
    { enabled: open },
  );

  // Get source IDs from selected template
  const selectedTemplate = useMemo(
    () => templates?.find((t) => t.id === selectedTemplateId),
    [templates, selectedTemplateId],
  );

  const sourceIds = useMemo(
    () => selectedTemplate?.sources.map((s) => s.id),
    [selectedTemplate],
  );

  // Fetch raw contents - filter by template sources if template selected
  const { data: rawContents, isLoading: contentsLoading } =
    trpc.pipeline.rawContents.useQuery(
      sourceIds && sourceIds.length > 0 ? { sourceIds } : undefined,
      { enabled: open && step === "content" },
    );

  const runMutation = trpc.pipeline.run.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      resetState();
      onSuccess();
    },
  });

  function resetState() {
    setStep("template");
    setSelectedTemplateId(null);
    setSelectedContentId(null);
  }

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
    if (!open) resetState();
  }

  function handleSelectTemplate(id: string | null) {
    setSelectedTemplateId(id);
    setSelectedContentId(null);
    setStep("content");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === "template"
              ? "파이프라인 실행 - 템플릿 선택"
              : "파이프라인 실행 - 콘텐츠 선택"}
          </DialogTitle>
        </DialogHeader>

        {step === "template" ? (
          <div className="space-y-2 max-h-80 overflow-auto">
            <p className="text-sm text-muted-foreground mb-3">
              사용할 파이프라인 템플릿을 선택하세요
            </p>

            {/* Option to skip template selection */}
            <button
              type="button"
              className={`w-full text-left rounded-md border p-3 transition-colors hover:bg-muted/50 ${
                selectedTemplateId === null ? "" : ""
              }`}
              onClick={() => handleSelectTemplate(null)}
            >
              <p className="font-medium text-sm">템플릿 없이 실행</p>
              <p className="text-xs text-muted-foreground mt-1">
                모든 수집 콘텐츠에서 선택합니다
              </p>
            </button>

            {templates?.map((template) => (
              <button
                key={template.id}
                type="button"
                className="w-full text-left rounded-md border p-3 transition-colors hover:bg-muted/50"
                onClick={() => handleSelectTemplate(template.id)}
              >
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">
                    {template.name}
                  </p>
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    소스 {template.sourceCount}개
                  </Badge>
                </div>
                {template.description && (
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {template.description}
                  </p>
                )}
                {template.agentSteps && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {(template.agentSteps as string[]).join(" → ")}
                  </p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {/* Back button + template info */}
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => {
                  setStep("template");
                  setSelectedContentId(null);
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                뒤로
              </Button>
              {selectedTemplate && (
                <Badge variant="outline">{selectedTemplate.name}</Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              처리할 수집 콘텐츠를 선택하세요
              {selectedTemplate &&
                ` (${selectedTemplate.name}에 연결된 소스의 콘텐츠만 표시)`}
            </p>

            <div className="max-h-64 overflow-auto space-y-2">
              {contentsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))
              ) : !rawContents || rawContents.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  {selectedTemplate
                    ? "이 템플릿에 연결된 소스에서 수집된 콘텐츠가 없습니다."
                    : "수집된 콘텐츠가 없습니다. 먼저 소스에서 콘텐츠를 수집하세요."}
                </p>
              ) : (
                rawContents.map((rc) => (
                  <button
                    key={rc.id}
                    type="button"
                    className={`w-full text-left rounded-md border p-3 transition-colors hover:bg-muted/50 ${
                      selectedContentId === rc.id
                        ? "border-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => setSelectedContentId(rc.id)}
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate flex-1">
                        {rc.title ?? "(제목 없음)"}
                      </p>
                      {rc.source && (
                        <Badge
                          variant="outline"
                          className="text-[10px] shrink-0"
                        >
                          {rc.source.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {rc.body.slice(0, 100)}...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(rc.collectedAt).toLocaleString("ko-KR")}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            취소
          </Button>
          {step === "content" && (
            <Button
              disabled={!selectedContentId || runMutation.isPending}
              onClick={() => {
                if (selectedContentId) {
                  runMutation.mutate({
                    rawContentId: selectedContentId,
                    pipelineTemplateId: selectedTemplateId ?? undefined,
                  });
                }
              }}
            >
              {runMutation.isPending ? "실행 중..." : "실행"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
