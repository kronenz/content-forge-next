"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Search,
  PenLine,
  CheckCircle2,
  LayoutTemplate,
  Microscope,
  TrendingUp,
  ShieldCheck,
  Scale,
  Palette,
  Globe,
  Plus,
  X,
  GripVertical,
  Save,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Zap,
  Layers,
} from "lucide-react";

// ─── Agent Definitions ───────────────────────────────────

interface AgentDef {
  role: string;
  label: string;
  labelKo: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  borderColor: string;
  iconColor: string;
  bgColor: string;
}

const AGENTS: AgentDef[] = [
  {
    role: "analyst",
    label: "Analyst",
    labelKo: "분석관",
    icon: Search,
    description: "원본 분석 + 인사이트 추출",
    borderColor: "border-l-blue-500",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    role: "researcher",
    label: "Researcher",
    labelKo: "리서처",
    icon: Microscope,
    description: "심층 리서치 + 소스 발굴",
    borderColor: "border-l-indigo-500",
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    role: "writer",
    label: "Writer",
    labelKo: "기자",
    icon: PenLine,
    description: "플랫폼별 초안 작성",
    borderColor: "border-l-emerald-500",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    role: "editor",
    label: "Editor",
    labelKo: "편집자",
    icon: CheckCircle2,
    description: "품질 교정 + 점수 산출",
    borderColor: "border-l-amber-500",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    role: "seo_optimizer",
    label: "SEO Optimizer",
    labelKo: "SEO 전문가",
    icon: TrendingUp,
    description: "검색 최적화",
    borderColor: "border-l-orange-500",
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    role: "fact_checker",
    label: "Fact Checker",
    labelKo: "팩트체커",
    icon: ShieldCheck,
    description: "사실 관계 검증",
    borderColor: "border-l-red-500",
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    role: "compliance",
    label: "Compliance",
    labelKo: "준법감시인",
    icon: Scale,
    description: "저작권/정책 준수",
    borderColor: "border-l-purple-500",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    role: "designer",
    label: "Designer",
    labelKo: "디자이너",
    icon: Palette,
    description: "비주얼 에셋 생성 지시",
    borderColor: "border-l-pink-500",
    iconColor: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    role: "localizer",
    label: "Localizer",
    labelKo: "현지화",
    icon: Globe,
    description: "문화적/언어적 현지화",
    borderColor: "border-l-teal-500",
    iconColor: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    role: "platform_formatter",
    label: "Formatter",
    labelKo: "포맷터",
    icon: LayoutTemplate,
    description: "플랫폼 포맷 변환",
    borderColor: "border-l-slate-500",
    iconColor: "text-slate-500",
    bgColor: "bg-slate-500/10",
  },
];

function getAgentDef(role: string): AgentDef | undefined {
  return AGENTS.find((a) => a.role === role);
}

const PRESET_QUICK = ["analyst", "writer", "editor", "platform_formatter"];
const PRESET_FULL = [
  "analyst",
  "researcher",
  "writer",
  "editor",
  "fact_checker",
  "seo_optimizer",
  "designer",
  "compliance",
  "platform_formatter",
];

// ─── Main Component ──────────────────────────────────────

interface PipelineBuilderProps {
  templateId?: string;
}

export function PipelineBuilder({ templateId }: PipelineBuilderProps) {
  const isEdit = !!templateId;

  const { data: template, isLoading } = trpc.pipelineTemplate.byId.useQuery(
    { id: templateId! },
    { enabled: isEdit },
  );

  if (isEdit && isLoading) {
    return <BuilderSkeleton />;
  }

  return (
    <BuilderInner
      key={templateId ?? "new"}
      templateId={templateId}
      initialName={template?.name ?? ""}
      initialDescription={template?.description ?? ""}
      initialSteps={
        template?.agentSteps
          ? (template.agentSteps as string[])
          : isEdit
            ? []
            : [...PRESET_QUICK]
      }
      initialSourceIds={template?.sources?.map((s) => s.id) ?? []}
      isEdit={isEdit}
    />
  );
}

// ─── Builder Inner ───────────────────────────────────────

interface BuilderInnerProps {
  templateId?: string;
  initialName: string;
  initialDescription: string;
  initialSteps: string[];
  initialSourceIds: string[];
  isEdit: boolean;
}

function BuilderInner({
  templateId,
  initialName,
  initialDescription,
  initialSteps,
  initialSourceIds,
  isEdit,
}: BuilderInnerProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [steps, setSteps] = useState<string[]>(initialSteps);
  const [selectedSourceIds, setSelectedSourceIds] = useState<Set<string>>(
    () => new Set(initialSourceIds),
  );
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { data: allSources } = trpc.source.list.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.pipelineTemplate.create.useMutation({
    onSuccess: () => {
      utils.pipelineTemplate.list.invalidate();
      toast.success("파이프라인 템플릿이 생성되었습니다");
      router.push("/pipelines");
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = trpc.pipelineTemplate.update.useMutation({
    onSuccess: () => {
      utils.pipelineTemplate.list.invalidate();
      toast.success("파이프라인 템플릿이 수정되었습니다");
      router.push("/pipelines");
    },
    onError: (err) => toast.error(err.message),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  // ── Handlers ─────────────────────────────────────────

  const addAgent = useCallback((role: string) => {
    setSteps((prev) => [...prev, role]);
  }, []);

  const removeAgent = useCallback((index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback(
    (index: number) => {
      if (dragIndex === null || dragIndex === index) {
        setDragIndex(null);
        setDragOverIndex(null);
        return;
      }
      setSteps((prev) => {
        const next = [...prev];
        const [removed] = next.splice(dragIndex, 1);
        if (removed) next.splice(index, 0, removed);
        return next;
      });
      setDragIndex(null);
      setDragOverIndex(null);
    },
    [dragIndex],
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

  const toggleSource = useCallback((sourceId: string) => {
    setSelectedSourceIds((prev) => {
      const next = new Set(prev);
      if (next.has(sourceId)) next.delete(sourceId);
      else next.add(sourceId);
      return next;
    });
  }, []);

  const toggleGroup = useCallback(
    (groupSources: { id: string }[]) => {
      setSelectedSourceIds((prev) => {
        const next = new Set(prev);
        const allSelected = groupSources.every((s) => next.has(s.id));
        if (allSelected) {
          groupSources.forEach((s) => next.delete(s.id));
        } else {
          groupSources.forEach((s) => next.add(s.id));
        }
        return next;
      });
    },
    [],
  );

  function handleSave() {
    if (!name.trim()) {
      toast.error("파이프라인 이름을 입력하세요");
      return;
    }
    if (steps.length === 0) {
      toast.error("최소 하나의 Agent를 추가하세요");
      return;
    }

    const sourceIds = Array.from(selectedSourceIds);

    if (isEdit && templateId) {
      updateMutation.mutate({
        id: templateId,
        name: name.trim(),
        description: description.trim() || undefined,
        agentSteps: steps as Parameters<
          typeof updateMutation.mutate
        >[0]["agentSteps"],
        sourceIds,
      });
    } else {
      createMutation.mutate({
        name: name.trim(),
        description: description.trim() || undefined,
        agentSteps: steps as Parameters<
          typeof createMutation.mutate
        >[0]["agentSteps"],
        sourceIds,
      });
    }
  }

  const unusedAgents = AGENTS.filter((a) => !steps.includes(a.role));

  const groupedSources = useMemo(() => {
    if (!allSources) return {};
    const groups: Record<string, typeof allSources> = {};
    for (const source of allSources) {
      const key = source.groupName ?? "기타";
      if (!groups[key]) groups[key] = [];
      groups[key].push(source);
    }
    return groups;
  }, [allSources]);

  // ── Render ───────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/pipelines")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            돌아가기
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-lg font-semibold">
            {isEdit ? "템플릿 편집" : "새 파이프라인 템플릿"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={isPending}>
          <Save className="h-4 w-4 mr-2" />
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </div>

      {/* Metadata */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pipeline-name">이름</Label>
          <Input
            id="pipeline-name"
            placeholder="예: 기술 블로그 파이프라인"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pipeline-desc">설명 (선택)</Label>
          <Input
            id="pipeline-desc"
            placeholder="이 파이프라인의 용도를 설명하세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Pipeline Flow Canvas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base">파이프라인 플로우</Label>
          <Badge variant="outline">{steps.length}단계</Badge>
        </div>

        <div className="rounded-xl border bg-muted/20 p-6 min-h-[200px]">
          {steps.length === 0 ? (
            /* Empty state with presets */
            <div className="flex flex-col items-center justify-center h-[140px] gap-4">
              <p className="text-sm text-muted-foreground">
                프리셋으로 시작하거나 아래에서 Agent를 추가하세요
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSteps([...PRESET_QUICK])}
                >
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  Quick (4단계)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSteps([...PRESET_FULL])}
                >
                  <Layers className="h-3.5 w-3.5 mr-1.5" />
                  Full (9단계)
                </Button>
              </div>
            </div>
          ) : (
            /* Flow nodes */
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
              {steps.map((role, index) => {
                const agent = getAgentDef(role);
                if (!agent) return null;
                const Icon = agent.icon;
                const isDragging = dragIndex === index;
                const isDragOver =
                  dragOverIndex === index &&
                  dragIndex !== null &&
                  dragIndex !== index;

                return (
                  <div
                    key={`${role}-${index}`}
                    className="flex items-center shrink-0"
                  >
                    {/* Drop indicator (before) */}
                    {isDragOver && dragIndex !== null && dragIndex > index && (
                      <div className="w-1 h-[100px] bg-primary rounded-full mr-2 animate-pulse" />
                    )}

                    {/* Agent Node */}
                    <div
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={`
                        group relative w-[140px] rounded-lg border-l-[3px] border bg-card shadow-sm
                        transition-all duration-200 cursor-grab active:cursor-grabbing select-none
                        hover:shadow-md hover:-translate-y-0.5
                        ${agent.borderColor}
                        ${isDragging ? "opacity-30 scale-95" : ""}
                      `}
                    >
                      {/* Top bar: drag handle + step number + remove */}
                      <div className="flex items-center justify-between px-2.5 pt-2">
                        <div className="flex items-center gap-1">
                          <GripVertical className="h-3 w-3 text-muted-foreground/40" />
                          <Badge
                            variant="secondary"
                            className="h-5 min-w-5 px-1 flex items-center justify-center text-[10px] font-bold"
                          >
                            {index + 1}
                          </Badge>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAgent(index);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 flex items-center justify-center rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          aria-label={`${agent.label} 제거`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="px-2.5 pb-3 pt-1.5 text-center">
                        <div
                          className={`mx-auto mb-2 h-9 w-9 rounded-lg ${agent.bgColor} flex items-center justify-center`}
                        >
                          <Icon className={`h-4.5 w-4.5 ${agent.iconColor}`} />
                        </div>
                        <p className="text-sm font-semibold leading-tight">
                          {agent.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {agent.labelKo}
                        </p>
                      </div>
                    </div>

                    {/* Drop indicator (after) */}
                    {isDragOver && dragIndex !== null && dragIndex < index && (
                      <div className="w-1 h-[100px] bg-primary rounded-full ml-2 animate-pulse" />
                    )}

                    {/* Arrow connector */}
                    {index < steps.length - 1 && (
                      <svg
                        width="36"
                        height="12"
                        viewBox="0 0 36 12"
                        className="shrink-0 mx-1 text-muted-foreground/40"
                      >
                        <line
                          x1="0"
                          y1="6"
                          x2="28"
                          y2="6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <polygon
                          points="28,2 36,6 28,10"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                  </div>
                );
              })}

              {/* Add button at end of flow */}
              <div className="shrink-0 ml-3">
                <button
                  onClick={() => {
                    document
                      .getElementById("agent-palette")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="h-[100px] w-[56px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1.5 hover:bg-muted/50 transition text-muted-foreground hover:text-foreground hover:border-primary/50"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-[10px] font-medium">추가</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Agent Palette + Sources */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Agent Palette */}
        <div id="agent-palette" className="space-y-3">
          <Label className="text-base">Agent 추가</Label>
          {unusedAgents.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              모든 Agent가 파이프라인에 추가되었습니다
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {unusedAgents.map((agent) => {
                const Icon = agent.icon;
                return (
                  <button
                    key={agent.role}
                    onClick={() => addAgent(agent.role)}
                    className="flex items-center gap-3 rounded-lg border border-dashed p-3 text-left transition hover:bg-muted/50 hover:border-solid hover:shadow-sm"
                  >
                    <div
                      className={`h-8 w-8 rounded-lg ${agent.bgColor} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`h-4 w-4 ${agent.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">
                        {agent.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {agent.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Source Connection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base">연결된 소스</Label>
            <Badge variant="outline">{selectedSourceIds.size}개 선택</Badge>
          </div>

          {/* Selected sources as chips */}
          {selectedSourceIds.size > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {allSources
                ?.filter((s) => selectedSourceIds.has(s.id))
                .map((source) => (
                  <Badge key={source.id} variant="secondary" className="gap-1 pr-1">
                    <span className="truncate max-w-[120px]">
                      {source.name}
                    </span>
                    <button
                      onClick={() => toggleSource(source.id)}
                      className="ml-0.5 h-4 w-4 rounded-full hover:bg-destructive/20 flex items-center justify-center"
                      aria-label={`${source.name} 연결 해제`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
            </div>
          )}

          {/* Expandable source picker */}
          <button
            onClick={() => setSourcesExpanded(!sourcesExpanded)}
            className="w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm hover:bg-muted/50 transition"
          >
            <span className="text-muted-foreground">
              {sourcesExpanded ? "소스 목록 접기" : "소스 선택하기"}
            </span>
            {sourcesExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {sourcesExpanded && (
            <div className="rounded-lg border p-3 max-h-[300px] overflow-auto space-y-3 animate-in slide-in-from-top-2 duration-200">
              {Object.entries(groupedSources).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  등록된 소스가 없습니다
                </p>
              ) : (
                Object.entries(groupedSources).map(([groupName, sources]) => {
                  const allSelected = sources.every((s) =>
                    selectedSourceIds.has(s.id),
                  );
                  const someSelected = sources.some((s) =>
                    selectedSourceIds.has(s.id),
                  );
                  return (
                  <div key={groupName}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(sources)}
                      className="flex items-center gap-2 mb-1.5 w-full text-left group/gh"
                    >
                      <div
                        className={`h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0 transition ${
                          allSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : someSelected
                              ? "bg-primary/50 border-primary text-primary-foreground"
                              : "border-muted-foreground/40"
                        }`}
                      >
                        {allSelected ? (
                          <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : someSelected ? (
                          <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none">
                            <path d="M3 6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        ) : null}
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {groupName}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">
                        ({sources.filter((s) => selectedSourceIds.has(s.id)).length}/{sources.length})
                      </span>
                    </button>
                    <div className="space-y-1">
                      {sources.map((source) => {
                        const checked = selectedSourceIds.has(source.id);
                        return (
                          <button
                            key={source.id}
                            onClick={() => toggleSource(source.id)}
                            className={`w-full flex items-center gap-2.5 rounded-md border px-2.5 py-2 text-left text-sm transition ${
                              checked
                                ? "border-primary bg-primary/5"
                                : "border-transparent hover:bg-muted/50"
                            }`}
                          >
                            <div
                              className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition ${
                                checked
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-muted-foreground/40"
                              }`}
                            >
                              {checked && (
                                <svg
                                  className="h-3 w-3"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                >
                                  <path
                                    d="M2 6l3 3 5-5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                            <span className="truncate flex-1">
                              {source.name}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] shrink-0"
                            >
                              {source.type}
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────

function BuilderSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    </div>
  );
}
