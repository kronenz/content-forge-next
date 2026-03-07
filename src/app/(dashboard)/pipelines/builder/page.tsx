"use client";

import { PipelineBuilder } from "@/components/pipeline-builder/pipeline-builder";

export default function PipelineBuilderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">파이프라인 빌더</h1>
        <p className="text-sm text-muted-foreground">
          AI Agent를 드래그앤드롭으로 배치하고 파이프라인을 구성합니다.
        </p>
      </div>
      <PipelineBuilder />
    </div>
  );
}
