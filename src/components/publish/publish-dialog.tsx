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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Platform = "blog" | "linkedin" | "twitter" | "instagram";

const PLATFORM_OPTIONS: { value: Platform; label: string; color: string }[] = [
  { value: "blog", label: "Blog", color: "bg-blue-100 text-blue-800" },
  { value: "linkedin", label: "LinkedIn", color: "bg-sky-100 text-sky-800" },
  { value: "twitter", label: "X (Twitter)", color: "bg-slate-100 text-slate-800" },
  { value: "instagram", label: "Instagram", color: "bg-pink-100 text-pink-800" },
];

export function PublishDialog({
  open,
  onOpenChange,
  onSuccess,
}: PublishDialogProps) {
  const [contentId, setContentId] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [scheduleType, setScheduleType] = useState<"now" | "scheduled">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState(0);

  const { data: contents } = trpc.content.listProcessed.useQuery(undefined, {
    enabled: open,
  });

  const scheduleMutation = trpc.publish.schedule.useMutation({
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
      resetForm();
    },
  });

  const crossPostMutation = trpc.publish.crossPost.useMutation({
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
      resetForm();
    },
  });

  function resetForm() {
    setContentId("");
    setSelectedPlatforms([]);
    setScheduleType("now");
    setScheduledAt("");
    setIntervalMinutes(0);
  }

  function togglePlatform(p: Platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  function handleSubmit() {
    if (!contentId || selectedPlatforms.length === 0) return;

    if (selectedPlatforms.length === 1 && intervalMinutes === 0) {
      scheduleMutation.mutate({
        processedContentId: contentId,
        platform: selectedPlatforms[0]!,
        scheduledAt:
          scheduleType === "scheduled" && scheduledAt
            ? new Date(scheduledAt)
            : undefined,
      });
    } else {
      crossPostMutation.mutate({
        processedContentId: contentId,
        platforms: selectedPlatforms,
        scheduledAt:
          scheduleType === "scheduled" && scheduledAt
            ? new Date(scheduledAt)
            : undefined,
        delayMinutes: intervalMinutes,
      });
    }
  }

  const isPending = scheduleMutation.isPending || crossPostMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>새 발행</DialogTitle>
          <DialogDescription>
            가공 완료된 콘텐츠를 플랫폼에 발행합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Content selection */}
          <div className="space-y-2">
            <Label htmlFor="pub-content">콘텐츠</Label>
            <Select value={contentId} onValueChange={(v) => v && setContentId(v)}>
              <SelectTrigger id="pub-content">
                <SelectValue placeholder="콘텐츠 선택" />
              </SelectTrigger>
              <SelectContent>
                {contents?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title ?? "제목 없음"} ({c.platform})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Platform multi-select */}
          <div className="space-y-2">
            <Label>플랫폼 (복수 선택 가능)</Label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORM_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                    selectedPlatforms.includes(p.value)
                      ? p.color + " border-current"
                      : "bg-muted text-muted-foreground"
                  }`}
                  onClick={() => togglePlatform(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule type */}
          <div className="space-y-2">
            <Label htmlFor="pub-schedule">발행 시점</Label>
            <Select
              value={scheduleType}
              onValueChange={(v) =>
                setScheduleType(v as "now" | "scheduled")
              }
            >
              <SelectTrigger id="pub-schedule">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">즉시 발행</SelectItem>
                <SelectItem value="scheduled">예약 발행</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled time */}
          {scheduleType === "scheduled" && (
            <div className="space-y-2">
              <Label htmlFor="pub-datetime">예약 시간</Label>
              <Input
                id="pub-datetime"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
          )}

          {/* Cross-posting interval */}
          {selectedPlatforms.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="pub-interval">플랫폼 간 시차 (분)</Label>
              <Input
                id="pub-interval"
                type="number"
                min={0}
                value={intervalMinutes}
                onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                크로스 포스팅 시 각 플랫폼 간 발행 간격
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!contentId || selectedPlatforms.length === 0 || isPending}
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {scheduleType === "now" ? "발행" : "예약"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
