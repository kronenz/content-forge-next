"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

type SourceType = "rss" | "api" | "web" | "research";
type Priority = "low" | "medium" | "high" | "critical";

type Source = {
  id: string;
  name: string;
  type: SourceType;
  url: string | null;
  config: Record<string, unknown> | null;
  schedule: string | null;
  processingPrompt: string | null;
  groupName: string | null;
  isActive: number;
  tags: string[] | null;
  priority: string;
  filters: { keywords?: string[]; exclude?: string[] } | null;
  createdAt: Date;
  updatedAt: Date;
};

type FormState = {
  name: string;
  type: SourceType;
  url: string;
  schedule: string;
  groupName: string;
  tags: string;
  priority: Priority;
  filterKeywords: string;
  filterExclude: string;
  processingPrompt: string;
};

const DEFAULT_FORM: FormState = {
  name: "",
  type: "rss",
  url: "",
  schedule: "",
  groupName: "",
  tags: "",
  priority: "medium",
  filterKeywords: "",
  filterExclude: "",
  processingPrompt: "",
};

function sourceToForm(source: Source): FormState {
  return {
    name: source.name,
    type: source.type,
    url: source.url ?? "",
    schedule: source.schedule ?? "",
    groupName: source.groupName ?? "",
    tags: source.tags ? source.tags.join(", ") : "",
    priority: (source.priority as Priority) ?? "medium",
    filterKeywords: source.filters?.keywords?.join(", ") ?? "",
    filterExclude: source.filters?.exclude?.join(", ") ?? "",
    processingPrompt: source.processingPrompt ?? "",
  };
}

function parseCommaSeparated(value: string): string[] | undefined {
  const arr = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return arr.length > 0 ? arr : undefined;
}

const URL_TYPES: SourceType[] = ["rss", "api", "web"];

interface SourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Source;
}

export function SourceDialog({
  open,
  onOpenChange,
  mode,
  defaultValues,
}: SourceDialogProps) {
  const [form, setForm] = useState<FormState>(() =>
    defaultValues ? sourceToForm(defaultValues) : DEFAULT_FORM
  );

  // Reset form when dialog opens
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setForm(defaultValues ? sourceToForm(defaultValues) : DEFAULT_FORM);
    }
    onOpenChange(nextOpen);
  };

  const utils = trpc.useUtils();

  const createMutation = trpc.source.create.useMutation({
    onSuccess: () => {
      utils.source.list.invalidate();
      onOpenChange(false);
    },
    onError: (err) => {
      console.error("소스 생성 실패:", err.message);
    },
  });

  const updateMutation = trpc.source.update.useMutation({
    onSuccess: () => {
      utils.source.list.invalidate();
      onOpenChange(false);
    },
    onError: (err) => {
      console.error("소스 수정 실패:", err.message);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    const filters =
      form.filterKeywords || form.filterExclude
        ? {
            keywords: parseCommaSeparated(form.filterKeywords),
            exclude: parseCommaSeparated(form.filterExclude),
          }
        : undefined;

    const payload = {
      name: form.name.trim(),
      url: form.url.trim() || undefined,
      schedule: form.schedule.trim() || undefined,
      groupName: form.groupName.trim() || undefined,
      tags: parseCommaSeparated(form.tags),
      priority: form.priority,
      filters,
      processingPrompt: form.processingPrompt.trim() || undefined,
    };

    if (mode === "create") {
      createMutation.mutate({ ...payload, type: form.type });
    } else if (defaultValues) {
      updateMutation.mutate({ id: defaultValues.id, ...payload });
    }
  }

  const showUrlField = URL_TYPES.includes(form.type);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "소스 추가" : "소스 편집"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "새로운 콘텐츠 수집 소스를 등록합니다."
              : "소스 정보를 수정합니다."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="source-name">
              이름 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="source-name"
              placeholder="TechCrunch AI News"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          {/* Type */}
          <div className="grid gap-1.5">
            <Label htmlFor="source-type">
              유형 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.type}
              onValueChange={(v) => set("type", v as SourceType)}
              disabled={mode === "edit"}
            >
              <SelectTrigger id="source-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rss">RSS</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="research">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* URL — only for rss/api/web */}
          {showUrlField && (
            <div className="grid gap-1.5">
              <Label htmlFor="source-url">URL</Label>
              <Input
                id="source-url"
                placeholder="https://example.com/feed"
                value={form.url}
                onChange={(e) => set("url", e.target.value)}
              />
            </div>
          )}

          {/* Schedule */}
          <div className="grid gap-1.5">
            <Label htmlFor="source-schedule">수집 주기</Label>
            <Input
              id="source-schedule"
              placeholder="0 */1 * * *  또는  every 1 hour"
              value={form.schedule}
              onChange={(e) => set("schedule", e.target.value)}
            />
          </div>

          {/* Group */}
          <div className="grid gap-1.5">
            <Label htmlFor="source-group">그룹</Label>
            <Input
              id="source-group"
              placeholder="AI 트렌드"
              value={form.groupName}
              onChange={(e) => set("groupName", e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="grid gap-1.5">
            <Label htmlFor="source-tags">태그 (쉼표로 구분)</Label>
            <Input
              id="source-tags"
              placeholder="tech, ai, trend"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
            />
          </div>

          {/* Priority */}
          <div className="grid gap-1.5">
            <Label htmlFor="source-priority">우선순위</Label>
            <Select
              value={form.priority}
              onValueChange={(v) => set("priority", v as Priority)}
            >
              <SelectTrigger id="source-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">낮음</SelectItem>
                <SelectItem value="medium">보통</SelectItem>
                <SelectItem value="high">높음</SelectItem>
                <SelectItem value="critical">긴급</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter keywords */}
          <div className="grid gap-1.5">
            <Label htmlFor="source-filter-keywords">
              필터 키워드 (쉼표로 구분)
            </Label>
            <Input
              id="source-filter-keywords"
              placeholder="AI, LLM, agent"
              value={form.filterKeywords}
              onChange={(e) => set("filterKeywords", e.target.value)}
            />
          </div>

          {/* Filter exclude */}
          <div className="grid gap-1.5">
            <Label htmlFor="source-filter-exclude">
              제외 키워드 (쉼표로 구분)
            </Label>
            <Input
              id="source-filter-exclude"
              placeholder="sponsored, advertisement"
              value={form.filterExclude}
              onChange={(e) => set("filterExclude", e.target.value)}
            />
          </div>

          {/* Processing prompt */}
          <div className="grid gap-1.5">
            <Label htmlFor="source-prompt">가공 프롬프트</Label>
            <Textarea
              id="source-prompt"
              rows={4}
              placeholder="이 소스 콘텐츠에 적용할 AI 가공 지시사항을 입력하세요."
              value={form.processingPrompt}
              onChange={(e) => set("processingPrompt", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !form.name.trim()}
          >
            {isPending
              ? mode === "create"
                ? "추가 중..."
                : "저장 중..."
              : mode === "create"
                ? "추가"
                : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
