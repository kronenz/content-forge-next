"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inbox, Play, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { PipelineRunCard } from "@/components/pipeline/pipeline-run-card";
import { RunPipelineDialog } from "@/components/pipeline/run-pipeline-dialog";
import { PipelineTemplateCard } from "@/components/pipeline/pipeline-template-card";
import { ManageSourcesDialog } from "@/components/pipeline/manage-sources-dialog";

interface TemplateForSources {
  id: string;
  name: string;
  sourceIds: string[];
}

export default function PipelinesPage() {
  const router = useRouter();
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [manageSourcesOpen, setManageSourcesOpen] = useState(false);
  const [manageSourcesTemplate, setManageSourcesTemplate] =
    useState<TemplateForSources | null>(null);

  const { data: runs, isLoading: runsLoading, refetch } =
    trpc.pipeline.list.useQuery(undefined, { refetchInterval: 5000 });

  const { data: templates, isLoading: templatesLoading } =
    trpc.pipelineTemplate.list.useQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">파이프라인</h1>
          <p className="text-muted-foreground">
            AI Agent 파이프라인 실행 및 모니터링
          </p>
        </div>
        <Button onClick={() => setRunDialogOpen(true)}>
          <Play className="mr-2 h-4 w-4" />
          파이프라인 실행
        </Button>
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">템플릿</TabsTrigger>
          <TabsTrigger value="runs">실행 기록</TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => router.push("/pipelines/builder")}
            >
              <Plus className="mr-2 h-4 w-4" />
              템플릿 생성
            </Button>
          </div>

          {templatesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : !templates || templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                파이프라인 템플릿이 없습니다
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                주제별 파이프라인을 만들고 소스를 연결하세요.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/pipelines/builder")}
              >
                첫 템플릿 만들기
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <PipelineTemplateCard
                  key={template.id}
                  template={template}
                  onEdit={(t) => {
                    router.push(`/pipelines/builder?id=${t.id}`);
                  }}
                  onManageSources={(t) => {
                    setManageSourcesTemplate({
                      id: t.id,
                      name: t.name,
                      sourceIds: t.sources.map((s) => s.id),
                    });
                    setManageSourcesOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Runs Tab */}
        <TabsContent value="runs" className="space-y-4 mt-4">
          {runsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : !runs || runs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                아직 실행된 파이프라인이 없습니다
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setRunDialogOpen(true)}
              >
                첫 파이프라인 실행하기
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {runs.map((run) => (
                <PipelineRunCard key={run.id} run={run} onRefetch={refetch} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <RunPipelineDialog
        open={runDialogOpen}
        onOpenChange={setRunDialogOpen}
        onSuccess={() => {
          refetch();
          toast.success("파이프라인 실행이 시작되었습니다");
        }}
      />

      {manageSourcesTemplate && (
        <ManageSourcesDialog
          open={manageSourcesOpen}
          onOpenChange={(open) => {
            setManageSourcesOpen(open);
            if (!open) setManageSourcesTemplate(null);
          }}
          templateId={manageSourcesTemplate.id}
          templateName={manageSourcesTemplate.name}
          currentSourceIds={manageSourcesTemplate.sourceIds}
        />
      )}
    </div>
  );
}
