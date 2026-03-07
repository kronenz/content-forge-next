"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Rss,
  Workflow,
  FileText,
  Send,
  BarChart3,
  Settings,
  Plus,
  Search,
  Eye,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords?: string[];
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: CommandItem[] = [
    {
      id: "dashboard",
      label: "대시보드",
      description: "대시보드로 이동",
      icon: LayoutDashboard,
      action: () => router.push("/"),
      keywords: ["home", "dashboard"],
    },
    {
      id: "sources",
      label: "소스 관리",
      description: "수집 소스 목록",
      icon: Rss,
      action: () => router.push("/sources"),
      keywords: ["source", "rss", "feed"],
    },
    {
      id: "add-source",
      label: "새 소스 추가",
      description: "RSS, API, Web 소스 추가",
      icon: Plus,
      action: () => router.push("/sources?action=add"),
      keywords: ["add", "new", "create", "source"],
    },
    {
      id: "pipelines",
      label: "파이프라인",
      description: "파이프라인 모니터",
      icon: Workflow,
      action: () => router.push("/pipelines"),
      keywords: ["pipeline", "agent", "run"],
    },
    {
      id: "contents",
      label: "콘텐츠",
      description: "가공된 콘텐츠 목록",
      icon: FileText,
      action: () => router.push("/contents"),
      keywords: ["content", "article"],
    },
    {
      id: "publish",
      label: "발행",
      description: "콘텐츠 발행 관리",
      icon: Send,
      action: () => router.push("/publish"),
      keywords: ["publish", "post", "deploy"],
    },
    {
      id: "analytics",
      label: "분석 대시보드",
      description: "성과 및 품질 분석",
      icon: BarChart3,
      action: () => router.push("/analytics"),
      keywords: ["analytics", "stats", "report"],
    },
    {
      id: "reviews",
      label: "검토",
      description: "콘텐츠 품질 검토",
      icon: Eye,
      action: () => router.push("/reviews"),
      keywords: ["review", "approval", "quality"],
    },
    {
      id: "settings",
      label: "설정",
      description: "시스템 설정",
      icon: Settings,
      action: () => router.push("/settings"),
      keywords: ["settings", "config", "preferences"],
    },
  ];

  const filtered = query.trim()
    ? commands.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(q) ||
          cmd.description?.toLowerCase().includes(q) ||
          cmd.keywords?.some((k) => k.includes(q))
        );
      })
    : commands;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    },
    [],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleItemKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[selectedIndex];
      if (item) {
        item.action();
        setOpen(false);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleItemKeyDown}
            placeholder="명령어 검색... (Cmd+K)"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="flex h-16 items-center justify-center text-sm text-muted-foreground">
              결과 없음
            </div>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
                    i === selectedIndex
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  onClick={() => {
                    cmd.action();
                    setOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="flex-1 text-left">
                    <span className="font-medium text-foreground">
                      {cmd.label}
                    </span>
                    {cmd.description && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {cmd.description}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
        <div className="border-t px-3 py-2 text-xs text-muted-foreground flex gap-4">
          <span>
            <kbd className="rounded border bg-muted px-1">↑↓</kbd> 이동
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1">Enter</kbd> 실행
          </span>
          <span>
            <kbd className="rounded border bg-muted px-1">Esc</kbd> 닫기
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
