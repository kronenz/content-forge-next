"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ManageSourcesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateId: string;
  templateName: string;
  currentSourceIds: string[];
}

export function ManageSourcesDialog(props: ManageSourcesDialogProps) {
  // key forces remount of inner form when templateId or sourceIds change
  const key = `${props.templateId}-${props.currentSourceIds.join(",")}`;

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        {props.open && <ManageSourcesForm key={key} {...props} />}
      </DialogContent>
    </Dialog>
  );
}

function ManageSourcesForm({
  onOpenChange,
  templateId,
  templateName,
  currentSourceIds,
}: ManageSourcesDialogProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(currentSourceIds),
  );
  const [search, setSearch] = useState("");

  const { data: allSources, isLoading } = trpc.source.list.useQuery();

  const utils = trpc.useUtils();

  const updateMutation = trpc.pipelineTemplate.update.useMutation({
    onSuccess: () => {
      utils.pipelineTemplate.list.invalidate();
      onOpenChange(false);
      toast.success("소스 연결이 업데이트되었습니다");
    },
  });

  function toggleSource(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleGroup(sources: { id: string }[]) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = sources.every((s) => next.has(s.id));
      if (allSelected) {
        sources.forEach((s) => next.delete(s.id));
      } else {
        sources.forEach((s) => next.add(s.id));
      }
      return next;
    });
  }

  function handleSave() {
    updateMutation.mutate({
      id: templateId,
      sourceIds: Array.from(selectedIds),
    });
  }

  // Group sources by groupName, filter by search
  const grouped = useMemo(() => {
    if (!allSources) return {};
    const filtered = search
      ? allSources.filter(
          (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            (s.groupName?.toLowerCase().includes(search.toLowerCase()) ??
              false),
        )
      : allSources;

    const groups: Record<string, typeof filtered> = {};
    for (const source of filtered) {
      const key = source.groupName ?? "기타";
      if (!groups[key]) groups[key] = [];
      groups[key].push(source);
    }
    return groups;
  }, [allSources, search]);

  const hasChanges =
    currentSourceIds.length !== selectedIds.size ||
    currentSourceIds.some((id) => !selectedIds.has(id));

  return (
    <>
      <DialogHeader>
        <DialogTitle>소스 연결 - {templateName}</DialogTitle>
      </DialogHeader>

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="소스 검색..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-auto space-y-4 min-h-0 max-h-[50vh]">
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            로딩 중...
          </p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            등록된 소스가 없습니다
          </p>
        ) : (
          Object.entries(grouped).map(([groupName, sources]) => {
            const allSelected = sources.every((s) => selectedIds.has(s.id));
            const someSelected = sources.some((s) => selectedIds.has(s.id));
            return (
            <div key={groupName}>
              <button
                type="button"
                onClick={() => toggleGroup(sources)}
                className="flex items-center gap-2 mb-2 w-full text-left"
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
                  ({sources.filter((s) => selectedIds.has(s.id)).length}/{sources.length})
                </span>
              </button>
              <div className="space-y-1">
                {sources.map((source) => {
                  const checked = selectedIds.has(source.id);
                  return (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => toggleSource(source.id)}
                      className={`w-full flex items-center gap-3 rounded-md border p-2.5 text-left transition ${
                        checked
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                          checked
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground"
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
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {source.name}
                        </p>
                      </div>
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

      <div className="text-xs text-muted-foreground">
        {selectedIds.size}개 소스 선택됨
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateMutation.isPending}
        >
          {updateMutation.isPending ? "저장 중..." : "저장"}
        </Button>
      </DialogFooter>
    </>
  );
}
