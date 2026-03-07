"use client";

import { useState } from "react";
import { Inbox, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { PipelineRunCard } from "@/components/pipeline/pipeline-run-card";
import { RunPipelineDialog } from "@/components/pipeline/run-pipeline-dialog";

export default function PipelinesPage() {
  const [runDialogOpen, setRunDialogOpen] = useState(false);

  const { data: runs, isLoading, refetch } = trpc.pipeline.list.useQuery(
    undefined,
    { refetchInterval: 5000 },
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">파이프라인</h1>
          <p className="text-muted-foreground">
            AI Agent 파이프라인 실행 및 모니터링
          </p>
        </div>
        <Button onClick={() => setRunDialogOpen(true)}>
          <Play className="mr-2 h-4 w-4" />
          파이프라인 실행
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      ) : !runs || runs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">아직 실행된 파이프라인이 없습니다</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setRunDialogOpen(true)}
          >
            첫 파이프라인 실행하기
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {runs.map((run) => (
            <PipelineRunCard key={run.id} run={run} onRefetch={refetch} />
          ))}
        </div>
      )}

      <RunPipelineDialog
        open={runDialogOpen}
        onOpenChange={setRunDialogOpen}
        onSuccess={() => {
          refetch();
          toast.success("파이프라인 실행이 시작되었습니다");
        }}
      />
    </div>
  );
}
