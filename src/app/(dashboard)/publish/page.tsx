"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  ExternalLink,
  RotateCcw,
  Trash2,
  Send,
  Layers,
  CalendarDays,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { PublishDialog } from "@/components/publish/publish-dialog";
import { CrossPostDialog } from "@/components/publish/cross-post-dialog";
import { ContentCalendar } from "@/components/publish/content-calendar";

const STATUS_CONFIG = {
  scheduled: { label: "예약", icon: Clock, variant: "secondary" as const },
  publishing: { label: "발행 중", icon: Loader2, variant: "default" as const },
  published: { label: "발행 완료", icon: CheckCircle2, variant: "default" as const },
  failed: { label: "실패", icon: XCircle, variant: "destructive" as const },
};

const PLATFORM_LABELS: Record<string, string> = {
  blog: "Blog",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  instagram: "Instagram",
};

export default function PublishPage() {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [crossPostDialogOpen, setCrossPostDialogOpen] = useState(false);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  const { data: pubs, isLoading, refetch } = trpc.publish.list.useQuery();

  const filteredPubs = pubs?.filter((p) =>
    platformFilter === "all" ? true : p.platform === platformFilter,
  );
  const publishMutation = trpc.publish.publish.useMutation({
    onSuccess: () => refetch(),
  });
  const retryMutation = trpc.publish.retry.useMutation({
    onSuccess: () => refetch(),
  });
  const cancelMutation = trpc.publish.cancel.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">발행</h1>
          <p className="text-sm text-muted-foreground">
            콘텐츠를 각 플랫폼에 발행합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md border">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("calendar")}
            >
              <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setCrossPostDialogOpen(true)}
          >
            <Layers className="mr-2 h-4 w-4" />
            크로스 포스팅
          </Button>
          <Button onClick={() => setPublishDialogOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            새 발행
          </Button>
        </div>
      </div>

      {/* Stats */}
      {pubs && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(["scheduled", "publishing", "published", "failed"] as const).map(
            (status) => {
              const config = STATUS_CONFIG[status];
              const Icon = config.icon;
              const count = pubs.filter((p) => p.status === status).length;
              return (
                <Card key={status} size="sm">
                  <CardContent className="flex items-center gap-3">
                    <Icon
                      className={`h-5 w-5 ${
                        status === "published"
                          ? "text-green-500"
                          : status === "failed"
                            ? "text-red-500"
                            : status === "publishing"
                              ? "animate-spin text-blue-500"
                              : "text-muted-foreground"
                      }`}
                    />
                    <div>
                      <p className="text-lg font-bold">{count}</p>
                      <p className="text-xs text-muted-foreground">
                        {config.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            },
          )}
        </div>
      )}

      {/* View toggle */}
      {view === "calendar" ? (
        <ContentCalendar />
      ) : (
        <>
          {/* Platform filter tabs */}
          <Tabs value={platformFilter} onValueChange={setPlatformFilter}>
            <TabsList>
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="twitter">X</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Publication list */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : !filteredPubs || filteredPubs.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
                발행된 콘텐츠가 없습니다. 새 발행을 시작하세요.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredPubs.map((pub) => {
            const config = STATUS_CONFIG[pub.status];
            const StatusIcon = config.icon;

            return (
              <Card key={pub.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon
                        className={`h-5 w-5 ${
                          pub.status === "published"
                            ? "text-green-500"
                            : pub.status === "failed"
                              ? "text-red-500"
                              : pub.status === "publishing"
                                ? "animate-spin text-blue-500"
                                : "text-muted-foreground"
                        }`}
                      />
                      <div>
                        <CardTitle className="text-base">
                          {pub.processedContent?.title ?? "제목 없음"}
                        </CardTitle>
                        <CardDescription>
                          {PLATFORM_LABELS[pub.platform] ?? pub.platform}
                          {pub.scheduledAt &&
                            ` · 예약: ${new Date(pub.scheduledAt).toLocaleString("ko-KR")}`}
                          {pub.publishedAt &&
                            ` · 발행: ${new Date(pub.publishedAt).toLocaleString("ko-KR")}`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={config.variant}>{config.label}</Badge>

                      {/* Actions */}
                      {pub.status === "scheduled" && (
                        <Button
                          size="sm"
                          onClick={() => publishMutation.mutate({ id: pub.id })}
                          disabled={publishMutation.isPending}
                        >
                          {publishMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      {pub.status === "published" && pub.publishedUrl && (
                        <Button
                          size="sm"
                          variant="ghost"
                          render={
                            <a
                              href={pub.publishedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      {pub.status === "failed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => retryMutation.mutate({ id: pub.id })}
                          disabled={retryMutation.isPending}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      {(pub.status === "scheduled" || pub.status === "failed") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cancelMutation.mutate({ id: pub.id })}
                          disabled={cancelMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <PublishDialog
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        onSuccess={() => refetch()}
      />
      <CrossPostDialog
        open={crossPostDialogOpen}
        onOpenChange={setCrossPostDialogOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
