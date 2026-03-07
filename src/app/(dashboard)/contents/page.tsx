"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { FileText, Eye } from "lucide-react";
import { useState } from "react";

type Tab = "raw" | "processed";

const platformLabels: Record<string, string> = {
  blog: "블로그",
  linkedin: "LinkedIn",
  twitter: "X",
  instagram: "Instagram",
};

export default function ContentsPage() {
  const [tab, setTab] = useState<Tab>("raw");
  const { data: rawContents, isLoading: rawLoading } = trpc.content.listRaw.useQuery();
  const { data: processedContents, isLoading: processedLoading } = trpc.content.listProcessed.useQuery();

  const isLoading = tab === "raw" ? rawLoading : processedLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">콘텐츠</h1>
        <p className="text-sm text-muted-foreground mt-1">
          수집된 원본과 가공된 콘텐츠를 관리합니다.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={tab === "raw" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("raw")}
        >
          원본 콘텐츠 ({rawContents?.length ?? 0})
        </Button>
        <Button
          variant={tab === "processed" ? "default" : "outline"}
          size="sm"
          onClick={() => setTab("processed")}
        >
          가공 콘텐츠 ({processedContents?.length ?? 0})
        </Button>
      </div>

      {/* Content list */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">로딩중...</p>
      ) : tab === "raw" ? (
        <div className="space-y-3">
          {rawContents?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText className="h-8 w-8 mb-3 opacity-30" />
                <p className="text-sm">수집된 콘텐츠가 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            rawContents?.map((content) => (
              <Card key={content.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium">
                      {content.title ?? "제목 없음"}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {new Date(content.collectedAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {content.body}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {processedContents?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Eye className="h-8 w-8 mb-3 opacity-30" />
                <p className="text-sm">가공된 콘텐츠가 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            processedContents?.map((content) => (
              <Card key={content.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium">
                      {content.title ?? "제목 없음"}
                    </CardTitle>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted font-medium">
                      {platformLabels[content.platform] ?? content.platform}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {content.body}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(content.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
