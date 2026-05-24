"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Search, Inbox, Edit2, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SourceCard } from "@/components/sources/source-card";
import { SourceDialog } from "@/components/sources/source-dialog";
import { SourceSuggestPanel } from "@/components/sources/source-suggest-panel";
import { DeleteSourceDialog } from "@/components/sources/delete-source-dialog";
import { trpc } from "@/lib/trpc";

type SourceType = "all" | "rss" | "api" | "web" | "research";

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

const TYPE_TABS: { value: SourceType; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "rss", label: "RSS" },
  { value: "api", label: "API" },
  { value: "web", label: "Web" },
  { value: "research", label: "Research" },
];

function SourceListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
      <Inbox className="mb-3 h-10 w-10 opacity-30" />
      <p className="text-sm font-medium">등록된 소스가 없습니다</p>
      <p className="text-xs mt-1 opacity-70">
        소스 추가 버튼을 눌러 첫 번째 소스를 등록해보세요.
      </p>
    </div>
  );
}

export default function SourcesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<SourceType>("all");

  // Create dialog state
  const [createOpen, setCreateOpen] = useState(false);
  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editSource, setEditSource] = useState<Source | null>(null);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteSource, setDeleteSource] = useState<Source | null>(null);

  // Group management state
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState("");
  const editGroupRef = useRef<HTMLInputElement>(null);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: sources, isLoading } = trpc.source.list.useQuery({
    type: typeFilter !== "all" ? typeFilter : undefined,
    search: search || undefined,
  });

  const utils = trpc.useUtils();

  const toggleActiveMutation = trpc.source.toggleActive.useMutation({
    onSuccess: () => utils.source.list.invalidate(),
  });

  const renameGroupMutation = trpc.source.renameGroup.useMutation({
    onSuccess: (data) => {
      utils.source.list.invalidate();
      utils.source.listGroups.invalidate();
      setEditingGroup(null);
      toast.success(`그룹 이름이 변경되었습니다 (${data.count}개 소스)`);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteGroupMutation = trpc.source.deleteGroup.useMutation({
    onSuccess: (data) => {
      utils.source.list.invalidate();
      utils.source.listGroups.invalidate();
      toast.success(`그룹이 해제되었습니다 (${data.count}개 소스)`);
    },
    onError: (err) => toast.error(err.message),
  });

  function handleStartRenameGroup(groupName: string) {
    setEditingGroup(groupName);
    setEditGroupName(groupName);
    setTimeout(() => editGroupRef.current?.focus(), 50);
  }

  function handleSaveRenameGroup(oldName: string) {
    const newName = editGroupName.trim();
    if (!newName || newName === oldName) {
      setEditingGroup(null);
      return;
    }
    renameGroupMutation.mutate({ oldName, newName });
  }

  function handleDeleteGroup(groupName: string) {
    if (confirm(`"${groupName}" 그룹을 해제하시겠습니까?\n소스는 삭제되지 않고 "기타"로 이동합니다.`)) {
      deleteGroupMutation.mutate({ groupName });
    }
  }

  const [collectingIds, setCollectingIds] = useState<Set<string>>(new Set());
  const collectMutation = trpc.source.collect.useMutation({
    onSuccess: (_data, variables) => {
      toast.success("수집 작업이 큐에 등록되었습니다.");
      setCollectingIds((prev) => {
        const next = new Set(prev);
        next.delete(variables.id);
        return next;
      });
    },
    onError: (error, variables) => {
      toast.error(`수집 실패: ${error.message}`);
      setCollectingIds((prev) => {
        const next = new Set(prev);
        next.delete(variables.id);
        return next;
      });
    },
  });

  function handleEdit(source: Source) {
    setEditSource(source);
    setEditOpen(true);
  }

  function handleToggleActive(source: Source) {
    toggleActiveMutation.mutate({ id: source.id });
  }

  function handleDelete(source: Source) {
    setDeleteSource(source);
    setDeleteOpen(true);
  }

  const handleCollect = useCallback((source: Source) => {
    setCollectingIds((prev) => new Set(prev).add(source.id));
    collectMutation.mutate({ id: source.id });
  }, [collectMutation]);

  // Group sources by groupName
  const grouped = (() => {
    if (!sources) return {};
    const groups: Record<string, Source[]> = {};
    for (const source of sources) {
      const key = source.groupName ?? "기타";
      if (!groups[key]) groups[key] = [];
      groups[key].push(source);
    }
    return groups;
  })();

  const groupEntries = Object.entries(grouped);
  const hasMultipleGroups = groupEntries.length > 1 || (groupEntries.length === 1 && groupEntries[0]?.[0] !== "기타");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">소스 관리</h1>
          <p className="text-sm text-muted-foreground mt-1">
            콘텐츠 수집 소스를 등록하고 관리합니다.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="flex-shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          소스 추가
        </Button>
      </div>

      {/* AI Suggest Panel */}
      <SourceSuggestPanel />

      {/* Search + Type filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="검색..."
            className="pl-8"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Tabs
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as SourceType)}
          className="w-full sm:w-auto"
        >
          <TabsList>
            {TYPE_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Source list */}
      {isLoading ? (
        <SourceListSkeleton />
      ) : !sources || sources.length === 0 ? (
        <EmptyState />
      ) : hasMultipleGroups ? (
        <div className="space-y-6">
          {groupEntries.map(([groupName, groupSources]) => (
            <div key={groupName}>
              <div className="flex items-center gap-2 mb-3 group/grp">
                {editingGroup === groupName ? (
                  <div className="flex items-center gap-1.5">
                    <Input
                      ref={editGroupRef}
                      value={editGroupName}
                      onChange={(e) => setEditGroupName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRenameGroup(groupName);
                        if (e.key === "Escape") setEditingGroup(null);
                      }}
                      className="h-7 text-sm w-40"
                    />
                    <button
                      onClick={() => handleSaveRenameGroup(groupName)}
                      className="h-6 w-6 flex items-center justify-center rounded hover:bg-accent text-primary"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingGroup(null)}
                      className="h-6 w-6 flex items-center justify-center rounded hover:bg-accent text-muted-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      {groupName}
                    </h2>
                    <span className="text-xs text-muted-foreground/60">
                      ({groupSources.length})
                    </span>
                    {groupName !== "기타" && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover/grp:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartRenameGroup(groupName)}
                          className="h-6 w-6 flex items-center justify-center rounded hover:bg-accent text-muted-foreground"
                          title="그룹 이름 변경"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(groupName)}
                          className="h-6 w-6 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          title="그룹 해제"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="space-y-3">
                {groupSources.map((source) => (
                  <SourceCard
                    key={source.id}
                    source={source}
                    onEdit={handleEdit}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDelete}
                    onCollect={handleCollect}
                    isCollecting={collectingIds.has(source.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map((source) => (
            <SourceCard
              key={source.id}
              source={source}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
              onCollect={handleCollect}
              isCollecting={collectingIds.has(source.id)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <SourceDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
      />
      {editSource && (
        <SourceDialog
          open={editOpen}
          onOpenChange={(open) => {
            setEditOpen(open);
            if (!open) setEditSource(null);
          }}
          mode="edit"
          defaultValues={editSource}
        />
      )}
      {deleteSource && (
        <DeleteSourceDialog
          open={deleteOpen}
          onOpenChange={(open) => {
            setDeleteOpen(open);
            if (!open) setDeleteSource(null);
          }}
          source={deleteSource}
        />
      )}
    </div>
  );
}
