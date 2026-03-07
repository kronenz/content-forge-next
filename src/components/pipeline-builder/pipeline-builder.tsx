"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  PenLine,
  CheckCircle2,
  LayoutTemplate,
  Microscope,
  TrendingUp,
  ShieldCheck,
  Scale,
  Plus,
  X,
  GripVertical,
  Save,
  Play,
} from "lucide-react";

interface AgentNode {
  id: string;
  role: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  enabled: boolean;
}

const AVAILABLE_AGENTS: Omit<AgentNode, "id" | "enabled">[] = [
  {
    role: "analyst",
    label: "Analyst",
    icon: Search,
    description: "원본 분석 + 인사이트 추출",
  },
  {
    role: "researcher",
    label: "Researcher",
    icon: Microscope,
    description: "심층 리서치 + 소스 발굴",
  },
  {
    role: "writer",
    label: "Writer",
    icon: PenLine,
    description: "플랫폼별 초안 작성",
  },
  {
    role: "editor",
    label: "Editor",
    icon: CheckCircle2,
    description: "품질 교정 + 점수 산출",
  },
  {
    role: "seo_optimizer",
    label: "SEO Optimizer",
    icon: TrendingUp,
    description: "검색 최적화",
  },
  {
    role: "fact_checker",
    label: "Fact Checker",
    icon: ShieldCheck,
    description: "사실 관계 검증",
  },
  {
    role: "compliance",
    label: "Compliance",
    icon: Scale,
    description: "저작권/정책 준수",
  },
  {
    role: "platform_formatter",
    label: "Formatter",
    icon: LayoutTemplate,
    description: "플랫폼 포맷 변환",
  },
];

const DEFAULT_PIPELINE: string[] = [
  "analyst",
  "writer",
  "editor",
  "platform_formatter",
];

interface PipelineBuilderProps {
  onSave?: (agents: string[]) => void;
  onRun?: (agents: string[]) => void;
}

export function PipelineBuilder({ onSave, onRun }: PipelineBuilderProps) {
  const [pipeline, setPipeline] = useState<AgentNode[]>(() =>
    DEFAULT_PIPELINE.map((role, i) => {
      const agent = AVAILABLE_AGENTS.find((a) => a.role === role)!;
      return { ...agent, id: `${role}-${i}`, enabled: true };
    }),
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const addAgent = useCallback(
    (role: string) => {
      const agent = AVAILABLE_AGENTS.find((a) => a.role === role);
      if (!agent) return;
      setPipeline((prev) => [
        ...prev,
        { ...agent, id: `${role}-${Date.now()}`, enabled: true },
      ]);
    },
    [],
  );

  const removeAgent = useCallback((id: string) => {
    setPipeline((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleAgent = useCallback((id: string) => {
    setPipeline((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a)),
    );
  }, []);

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === index) return;
      setPipeline((prev) => {
        const next = [...prev];
        const removed = next.splice(dragIndex, 1);
        if (removed[0]) next.splice(index, 0, removed[0]);
        return next;
      });
      setDragIndex(index);
    },
    [dragIndex],
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
  }, []);

  const enabledAgents = pipeline.filter((a) => a.enabled).map((a) => a.role);
  const unusedAgents = AVAILABLE_AGENTS.filter(
    (a) => !pipeline.some((p) => p.role === a.role),
  );

  return (
    <div className="space-y-4">
      {/* Pipeline canvas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">파이프라인 빌더</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSave?.(enabledAgents)}
              >
                <Save className="mr-1 h-3.5 w-3.5" />
                저장
              </Button>
              <Button
                size="sm"
                onClick={() => onRun?.(enabledAgents)}
                disabled={enabledAgents.length === 0}
              >
                <Play className="mr-1 h-3.5 w-3.5" />
                실행
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Agent chain */}
          <div className="space-y-2">
            {pipeline.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition ${
                    agent.enabled
                      ? "bg-card border-border"
                      : "bg-muted/50 border-dashed opacity-60"
                  } ${dragIndex === index ? "ring-2 ring-primary" : ""}`}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
                  <Badge
                    variant="secondary"
                    className="w-6 h-6 p-0 flex items-center justify-center shrink-0"
                  >
                    {index + 1}
                  </Badge>
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{agent.label}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {agent.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => toggleAgent(agent.id)}
                  >
                    {agent.enabled ? "비활성화" : "활성화"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => removeAgent(agent.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Flow visualization */}
          {pipeline.length > 0 && (
            <div className="mt-4 flex items-center gap-1 overflow-x-auto py-2 px-1">
              {pipeline.map((agent, i) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.id} className="flex items-center shrink-0">
                    <div
                      className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${
                        agent.enabled
                          ? "bg-primary/10 border-primary/30"
                          : "bg-muted border-dashed opacity-50"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      <span>{agent.label}</span>
                    </div>
                    {i < pipeline.length - 1 && (
                      <span className="mx-1 text-muted-foreground">→</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add agents */}
      {unusedAgents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Agent 추가
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {unusedAgents.map((agent) => {
                const Icon = agent.icon;
                return (
                  <button
                    key={agent.role}
                    onClick={() => addAgent(agent.role)}
                    className="flex flex-col items-center gap-1 rounded-lg border border-dashed p-3 text-center hover:bg-muted transition"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xs font-medium">{agent.label}</span>
                    <Plus className="h-3 w-3 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
