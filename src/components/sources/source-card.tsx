"use client";

import { Rss, Globe, Zap, Search, MoreHorizontal, Pencil, Pause, Play, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Source = {
  id: string;
  name: string;
  type: "rss" | "api" | "web" | "research";
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

const TYPE_CONFIG = {
  rss: {
    icon: Rss,
    label: "RSS",
    badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  web: {
    icon: Globe,
    label: "Web",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  api: {
    icon: Zap,
    label: "API",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  research: {
    icon: Search,
    label: "Research",
    badgeClass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
};

const PRIORITY_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  low: { label: "낮음", badgeClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  medium: { label: "보통", badgeClass: "" },
  high: { label: "높음", badgeClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  critical: { label: "긴급", badgeClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

interface SourceCardProps {
  source: Source;
  onEdit: (source: Source) => void;
  onToggleActive: (source: Source) => void;
  onDelete: (source: Source) => void;
}

export function SourceCard({ source, onEdit, onToggleActive, onDelete }: SourceCardProps) {
  const typeConfig = TYPE_CONFIG[source.type];
  const TypeIcon = typeConfig.icon;
  const isActive = source.isActive === 1;
  const priority = PRIORITY_CONFIG[source.priority];

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Type icon */}
          <div className="mt-0.5 rounded-md bg-muted p-2 flex-shrink-0">
            <TypeIcon className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm truncate">{source.name}</span>
              <Badge variant="secondary" className={cn("text-xs font-medium", typeConfig.badgeClass)}>
                {typeConfig.label}
              </Badge>
              {source.priority !== "medium" && priority && (
                <Badge variant="secondary" className={cn("text-xs font-medium", priority.badgeClass)}>
                  {priority.label}
                </Badge>
              )}
              {/* Status dot */}
              <div className="flex items-center gap-1 ml-auto">
                <span
                  className={cn(
                    "inline-block h-2 w-2 rounded-full flex-shrink-0",
                    isActive ? "bg-green-500" : "bg-gray-400"
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  {isActive ? "정상" : "비활성"}
                </span>
              </div>
            </div>

            {/* URL */}
            {source.url && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{source.url}</p>
            )}

            {/* Schedule */}
            {source.schedule && (
              <p className="text-xs text-muted-foreground mt-1">
                스케줄: <span className="font-mono">{source.schedule}</span>
              </p>
            )}

            {/* Tags */}
            {source.tags && source.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {source.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">메뉴 열기</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(source)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  편집
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleActive(source)}>
                  {isActive ? (
                    <>
                      <Pause className="mr-2 h-3.5 w-3.5" />
                      일시정지
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-3.5 w-3.5" />
                      활성화
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(source)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
