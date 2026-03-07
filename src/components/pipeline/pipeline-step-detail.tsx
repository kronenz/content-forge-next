"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
  SkipForward,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const STATUS_ICONS = {
  pending: Clock,
  running: Loader2,
  completed: CheckCircle2,
  failed: XCircle,
  skipped: SkipForward,
};

const ROLE_LABELS: Record<string, string> = {
  analyst: "Analyst (분석관)",
  writer: "Writer (기자)",
  editor: "Editor (편집자)",
  platform_formatter: "Formatter (포맷터)",
};

interface StepProps {
  step: {
    id: string;
    agentRole: string;
    status: "pending" | "running" | "completed" | "failed" | "skipped";
    output: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;
    startedAt: Date | null;
    completedAt: Date | null;
  };
}

export function PipelineStepDetail({ step }: StepProps) {
  const [open, setOpen] = useState(false);
  const Icon = STATUS_ICONS[step.status];

  const meta = step.metadata as {
    tokenUsage?: { input: number; output: number };
    durationMs?: number;
    error?: string;
  } | null;

  const duration = meta?.durationMs
    ? `${(meta.durationMs / 1000).toFixed(1)}s`
    : null;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md border p-3 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2">
          <Icon
            className={`h-4 w-4 ${
              step.status === "running" ? "animate-spin text-blue-500" : ""
            } ${step.status === "completed" ? "text-green-500" : ""} ${
              step.status === "failed" ? "text-red-500" : ""
            }`}
          />
          <span className="font-medium text-sm">
            {ROLE_LABELS[step.agentRole] ?? step.agentRole}
          </span>
          {duration && (
            <span className="text-xs text-muted-foreground">({duration})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {meta?.tokenUsage && (
            <span className="text-xs text-muted-foreground">
              {meta.tokenUsage.input + meta.tokenUsage.output} tokens
            </span>
          )}
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2 rounded-md border bg-muted/30 p-3">
        {step.status === "failed" && meta?.error && (
          <div className="mb-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
            {meta.error}
          </div>
        )}

        {meta?.tokenUsage && (
          <div className="mb-3 flex gap-4 text-xs text-muted-foreground">
            <span>입력: {meta.tokenUsage.input.toLocaleString()} tokens</span>
            <span>출력: {meta.tokenUsage.output.toLocaleString()} tokens</span>
            {duration && <span>소요: {duration}</span>}
          </div>
        )}

        {step.output && (
          <pre className="max-h-64 overflow-auto rounded-md bg-background p-3 text-xs">
            {JSON.stringify(step.output, null, 2)}
          </pre>
        )}

        {!step.output && step.status === "pending" && (
          <p className="text-sm text-muted-foreground">대기 중...</p>
        )}

        {!step.output && step.status === "running" && (
          <p className="text-sm text-muted-foreground">처리 중...</p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
