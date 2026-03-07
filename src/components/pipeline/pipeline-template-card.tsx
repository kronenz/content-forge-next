"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit2,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";

interface Source {
  id: string;
  name: string;
  type: string;
  groupName: string | null;
  isActive: number;
}

interface PipelineTemplate {
  id: string;
  name: string;
  description: string | null;
  agentSteps: string[] | null;
  isActive: number;
  sources: Source[];
  sourceCount: number;
}

interface PipelineTemplateCardProps {
  template: PipelineTemplate;
  onEdit: (template: PipelineTemplate) => void;
  onManageSources: (template: PipelineTemplate) => void;
}

export function PipelineTemplateCard({
  template,
  onEdit,
  onManageSources,
}: PipelineTemplateCardProps) {
  const [expanded, setExpanded] = useState(false);
  const utils = trpc.useUtils();

  const deleteMutation = trpc.pipelineTemplate.delete.useMutation({
    onSuccess: () => {
      utils.pipelineTemplate.list.invalidate();
      toast.success("템플릿이 삭제되었습니다");
    },
  });

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{template.name}</h3>
            <Badge variant="secondary" className="shrink-0">
              소스 {template.sourceCount}개
            </Badge>
            {template.agentSteps && (
              <Badge variant="outline" className="shrink-0">
                {template.agentSteps.length}단계
              </Badge>
            )}
          </div>
          {template.description && (
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {template.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onManageSources(template)}
            title="소스 관리"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(template)}
            title="편집"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive"
            onClick={() => {
              if (confirm(`"${template.name}" 템플릿을 삭제하시겠습니까?`)) {
                deleteMutation.mutate({ id: template.id });
              }
            }}
            disabled={deleteMutation.isPending}
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Agent steps flow */}
      {template.agentSteps && template.agentSteps.length > 0 && (
        <div className="mt-3 flex items-center gap-1 overflow-x-auto">
          {template.agentSteps.map((step, i) => (
            <div key={i} className="flex items-center shrink-0">
              <span className="rounded-md bg-primary/10 border border-primary/30 px-2 py-0.5 text-xs">
                {step}
              </span>
              {i < template.agentSteps!.length - 1 && (
                <span className="mx-1 text-muted-foreground text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Expanded: show linked sources */}
      {expanded && (
        <div className="mt-3 border-t pt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            연결된 소스
          </p>
          {template.sources.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              연결된 소스가 없습니다.{" "}
              <button
                className="text-primary underline"
                onClick={() => onManageSources(template)}
              >
                소스 연결하기
              </button>
            </p>
          ) : (
            <div className="space-y-1">
              {template.sources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <Badge variant="outline" className="text-[10px] px-1.5">
                    {source.type}
                  </Badge>
                  <span className="truncate">{source.name}</span>
                  {source.groupName && (
                    <span className="text-xs text-muted-foreground">
                      ({source.groupName})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
