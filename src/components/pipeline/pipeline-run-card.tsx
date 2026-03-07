"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { PipelineStepDetail } from "./pipeline-step-detail";

const STATUS_CONFIG = {
  pending: { label: "대기", icon: Clock, variant: "secondary" as const },
  running: { label: "실행 중", icon: Loader2, variant: "default" as const },
  completed: { label: "완료", icon: CheckCircle2, variant: "default" as const },
  failed: { label: "실패", icon: XCircle, variant: "destructive" as const },
  cancelled: { label: "취소됨", icon: Ban, variant: "secondary" as const },
};

const ROLE_LABELS: Record<string, string> = {
  analyst: "분석관",
  writer: "기자",
  editor: "편집자",
  platform_formatter: "포맷터",
};

interface PipelineRunCardProps {
  run: {
    id: string;
    status: "pending" | "running" | "completed" | "failed" | "cancelled";
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    rawContent: { title: string | null; body: string } | null;
    pipelineTemplate: { id: string; name: string } | null;
  };
  onRefetch: () => void;
}

export function PipelineRunCard({ run, onRefetch }: PipelineRunCardProps) {
  const [expanded, setExpanded] = useState(run.status === "running");
  const statusConfig = STATUS_CONFIG[run.status];
  const StatusIcon = statusConfig.icon;

  const { data: detail } = trpc.pipeline.byId.useQuery(
    { id: run.id },
    {
      enabled: expanded,
      refetchInterval: run.status === "running" ? 3000 : false,
    },
  );

  const cancelMutation = trpc.pipeline.cancel.useMutation({
    onSuccess: () => onRefetch(),
  });

  const completedElapsed =
    run.startedAt && run.completedAt
      ? Math.round(
          (new Date(run.completedAt).getTime() -
            new Date(run.startedAt).getTime()) /
            1000,
        )
      : null;

  const [liveElapsed, setLiveElapsed] = useState<number | null>(null);

  useEffect(() => {
    if (!run.startedAt || run.completedAt) return;
    const startTime = new Date(run.startedAt).getTime();
    const update = () =>
      setLiveElapsed(Math.round((Date.now() - startTime) / 1000));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [run.startedAt, run.completedAt]);

  const elapsed = completedElapsed ?? liveElapsed;

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon
              className={`h-5 w-5 ${
                run.status === "running" ? "animate-spin text-blue-500" : ""
              } ${run.status === "completed" ? "text-green-500" : ""} ${
                run.status === "failed" ? "text-red-500" : ""
              }`}
            />
            <div>
              <CardTitle className="text-base">
                {run.rawContent?.title ?? "제목 없음"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(run.createdAt).toLocaleString("ko-KR")}
                {elapsed != null && ` · ${elapsed}초`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {run.pipelineTemplate && (
              <Badge variant="outline">{run.pipelineTemplate.name}</Badge>
            )}
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            {run.status === "running" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  cancelMutation.mutate({ id: run.id });
                }}
              >
                취소
              </Button>
            )}
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>

        {/* Step progress bar */}
        {detail?.steps && detail.steps.length > 0 && (
          <div className="flex gap-1 mt-3">
            {detail.steps.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`h-2 w-full rounded-full ${
                    step.status === "completed"
                      ? "bg-green-500"
                      : step.status === "running"
                        ? "bg-blue-500 animate-pulse"
                        : step.status === "failed"
                          ? "bg-red-500"
                          : "bg-muted"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  {ROLE_LABELS[step.agentRole] ?? step.agentRole}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardHeader>

      {expanded && detail?.steps && (
        <CardContent className="space-y-3 pt-0">
          {detail.steps.map((step) => (
            <PipelineStepDetail key={step.id} step={step} />
          ))}
        </CardContent>
      )}
    </Card>
  );
}
