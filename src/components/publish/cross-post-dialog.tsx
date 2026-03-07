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
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface CrossPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type Platform = "blog" | "linkedin" | "twitter" | "instagram";

const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: "blog", label: "Blog" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
];

export function CrossPostDialog({
  open,
  onOpenChange,
  onSuccess,
}: CrossPostDialogProps) {
  const [contentId, setContentId] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<
    Record<Platform, boolean>
  >({
    blog: true,
    linkedin: true,
    twitter: true,
    instagram: false,
  });
  const [delayMinutes, setDelayMinutes] = useState(120);
  const [useSchedule, setUseSchedule] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const { data: contents } = trpc.content.listProcessed.useQuery(undefined, {
    enabled: open,
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
    setSelectedPlatforms({
      blog: true,
      linkedin: true,
      twitter: true,
      instagram: false,
    });
    setDelayMinutes(120);
    setUseSchedule(false);
    setScheduledAt("");
  }

  function handleSubmit() {
    if (!contentId) return;

    const platforms = (Object.entries(selectedPlatforms) as [Platform, boolean][])
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (platforms.length === 0) return;

    crossPostMutation.mutate({
      processedContentId: contentId,
      platforms,
      delayMinutes,
      scheduledAt:
        useSchedule && scheduledAt ? new Date(scheduledAt) : undefined,
    });
  }

  const activePlatformCount = Object.values(selectedPlatforms).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>크로스 포스팅</DialogTitle>
          <DialogDescription>
            여러 플랫폼에 시차를 두고 발행합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Content selection */}
          <div className="space-y-2">
            <Label htmlFor="cross-content">콘텐츠</Label>
            <Select value={contentId} onValueChange={(v) => v && setContentId(v)}>
              <SelectTrigger id="cross-content">
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

          {/* Platform toggles */}
          <div className="space-y-2">
            <Label>플랫폼 선택</Label>
            <div className="space-y-2">
              {PLATFORM_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className="flex items-center justify-between rounded-md border px-3 py-2"
                >
                  <span className="text-sm">{opt.label}</span>
                  <Switch
                    checked={selectedPlatforms[opt.value]}
                    onCheckedChange={(checked) =>
                      setSelectedPlatforms((prev) => ({
                        ...prev,
                        [opt.value]: checked,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Delay between platforms */}
          <div className="space-y-2">
            <Label htmlFor="cross-delay">플랫폼 간 시차 (분)</Label>
            <Input
              id="cross-delay"
              type="number"
              min={0}
              max={1440}
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              첫 플랫폼 발행 후 다음 플랫폼까지의 대기 시간
            </p>
          </div>

          {/* Schedule toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="cross-schedule-toggle">예약 발행</Label>
            <Switch
              id="cross-schedule-toggle"
              checked={useSchedule}
              onCheckedChange={setUseSchedule}
            />
          </div>

          {useSchedule && (
            <div className="space-y-2">
              <Label htmlFor="cross-datetime">시작 시간</Label>
              <Input
                id="cross-datetime"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !contentId ||
              activePlatformCount === 0 ||
              crossPostMutation.isPending
            }
          >
            {crossPostMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {activePlatformCount}개 플랫폼 발행
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
