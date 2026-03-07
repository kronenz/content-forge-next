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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type AgentRole =
  | "analyst"
  | "researcher"
  | "writer"
  | "editor"
  | "seo_optimizer"
  | "fact_checker"
  | "compliance"
  | "designer"
  | "localizer"
  | "platform_formatter";

const AVAILABLE_AGENTS: { role: AgentRole; label: string }[] = [
  { role: "analyst", label: "Analyst (분석)" },
  { role: "researcher", label: "Researcher (리서치)" },
  { role: "writer", label: "Writer (작성)" },
  { role: "editor", label: "Editor (편집)" },
  { role: "seo_optimizer", label: "SEO Optimizer" },
  { role: "fact_checker", label: "Fact Checker" },
  { role: "compliance", label: "Compliance" },
  { role: "designer", label: "Designer" },
  { role: "localizer", label: "Localizer" },
  { role: "platform_formatter", label: "Formatter (포맷)" },
];

const DEFAULT_STEPS: AgentRole[] = [
  "analyst",
  "writer",
  "editor",
  "platform_formatter",
];

interface PipelineTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: {
    id: string;
    name: string;
    description: string | null;
    agentSteps: string[] | null;
  };
}

export function PipelineTemplateDialog(props: PipelineTemplateDialogProps) {
  // key forces remount of inner form when dialog opens or defaultValues change
  const key = props.mode === "edit" && props.defaultValues
    ? props.defaultValues.id
    : "create";

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-md">
        {props.open && (
          <PipelineTemplateForm key={key} {...props} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function PipelineTemplateForm({
  onOpenChange,
  mode,
  defaultValues,
}: PipelineTemplateDialogProps) {
  const [name, setName] = useState(
    mode === "edit" && defaultValues ? defaultValues.name : "",
  );
  const [description, setDescription] = useState(
    mode === "edit" && defaultValues ? (defaultValues.description ?? "") : "",
  );
  const [selectedSteps, setSelectedSteps] = useState<AgentRole[]>(
    mode === "edit" && defaultValues?.agentSteps
      ? (defaultValues.agentSteps as AgentRole[])
      : [...DEFAULT_STEPS],
  );

  const utils = trpc.useUtils();

  const createMutation = trpc.pipelineTemplate.create.useMutation({
    onSuccess: () => {
      utils.pipelineTemplate.list.invalidate();
      onOpenChange(false);
      toast.success("템플릿이 생성되었습니다");
    },
  });

  const updateMutation = trpc.pipelineTemplate.update.useMutation({
    onSuccess: () => {
      utils.pipelineTemplate.list.invalidate();
      onOpenChange(false);
      toast.success("템플릿이 수정되었습니다");
    },
  });

  function toggleStep(role: AgentRole) {
    setSelectedSteps((prev) =>
      prev.includes(role)
        ? prev.filter((s): s is AgentRole => s !== role)
        : [...prev, role],
    );
  }

  function handleSubmit() {
    if (!name.trim()) return;

    if (mode === "create") {
      createMutation.mutate({
        name: name.trim(),
        description: description.trim() || undefined,
        agentSteps: selectedSteps,
      });
    } else if (defaultValues) {
      updateMutation.mutate({
        id: defaultValues.id,
        name: name.trim(),
        description: description.trim() || undefined,
        agentSteps: selectedSteps,
      });
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? "파이프라인 템플릿 생성" : "템플릿 수정"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template-name">이름</Label>
          <Input
            id="template-name"
            placeholder="예: 기술 블로그 파이프라인"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="template-desc">설명</Label>
          <Input
            id="template-desc"
            placeholder="이 파이프라인의 용도를 설명하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Agent 단계 선택</Label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_AGENTS.map((agent) => {
              const selected = selectedSteps.includes(agent.role);
              return (
                <button
                  key={agent.role}
                  type="button"
                  onClick={() => toggleStep(agent.role)}
                  className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <span className="font-medium">{agent.label}</span>
                </button>
              );
            })}
          </div>
          {selectedSteps.length > 0 && (
            <p className="text-xs text-muted-foreground">
              실행 순서: {selectedSteps.join(" → ")}
            </p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button onClick={handleSubmit} disabled={!name.trim() || isPending}>
          {isPending ? "처리 중..." : mode === "create" ? "생성" : "수정"}
        </Button>
      </DialogFooter>
    </>
  );
}
