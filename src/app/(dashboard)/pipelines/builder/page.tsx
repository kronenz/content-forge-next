"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PipelineBuilder } from "@/components/pipeline-builder/pipeline-builder";
import { Skeleton } from "@/components/ui/skeleton";

function BuilderContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("id") ?? undefined;
  return <PipelineBuilder templateId={templateId} />;
}

export default function PipelineBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
