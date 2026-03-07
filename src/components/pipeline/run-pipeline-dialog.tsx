"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: rawContents, isLoading } = trpc.pipeline.rawContents.useQuery(
    undefined,
    { enabled: open },
  );

  const runMutation = trpc.pipeline.run.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      setSelectedId(null);
      onSuccess();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>파이프라인 실행</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-80 overflow-auto">
          <p className="text-sm text-muted-foreground mb-3">
            처리할 수집 콘텐츠를 선택하세요
          </p>

          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))
          ) : !rawContents || rawContents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              수집된 콘텐츠가 없습니다. 먼저 소스에서 콘텐츠를 수집하세요.
            </p>
          ) : (
            rawContents.map((rc) => (
              <button
                key={rc.id}
                type="button"
                className={`w-full text-left rounded-md border p-3 transition-colors hover:bg-muted/50 ${
                  selectedId === rc.id ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedId(rc.id)}
              >
                <p className="font-medium text-sm truncate">
                  {rc.title ?? "(제목 없음)"}
                </p>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            disabled={!selectedId || runMutation.isPending}
            onClick={() => {
              if (selectedId) {
                runMutation.mutate({ rawContentId: selectedId });
              }
            }}
          >
            {runMutation.isPending ? "실행 중..." : "실행"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
