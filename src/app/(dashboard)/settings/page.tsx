"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getPlan, type PlanId } from "@/server/services/subscription";
import { useState } from "react";
import { Crown, Settings2 } from "lucide-react";

export default function SettingsPage() {
  const [currentPlanId] = useState<PlanId>("free");
  const plan = getPlan(currentPlanId);

  // Mock usage data
  const usage = {
    sources: 1,
    pipelineRuns: 3,
    research: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">설정</h1>
        <p className="text-sm text-muted-foreground">
          계정 및 구독 설정을 관리합니다.
        </p>
      </div>

      {/* Current plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">현재 플랜</CardTitle>
            </div>
            <Badge variant={currentPlanId === "free" ? "secondary" : "default"}>
              {plan.name}
            </Badge>
          </div>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Usage meters */}
          {[
            {
              label: "소스",
              used: usage.sources,
              limit: plan.limits.sources,
            },
            {
              label: "파이프라인 실행 (이번 달)",
              used: usage.pipelineRuns,
              limit: plan.limits.pipelineRunsPerMonth,
            },
            {
              label: "Research Agent (이번 달)",
              used: usage.research,
              limit: plan.limits.researchPerMonth,
            },
          ].map((meter) => (
            <div key={meter.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{meter.label}</span>
                <span className="text-muted-foreground">
                  {meter.used} / {meter.limit >= 999 ? "∞" : meter.limit}
                </span>
              </div>
              <Progress
                value={
                  meter.limit >= 999
                    ? 0
                    : Math.min((meter.used / meter.limit) * 100, 100)
                }
              />
            </div>
          ))}

          <Button className="w-full mt-4">
            <Crown className="mr-2 h-4 w-4" />
            플랜 업그레이드
          </Button>
        </CardContent>
      </Card>

      {/* General settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            <CardTitle className="text-base">일반 설정</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">기본 AI 모델</p>
              <p className="text-xs text-muted-foreground">
                파이프라인 실행에 사용할 기본 모델
              </p>
            </div>
            <Badge variant="outline">Claude Sonnet</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">기본 언어</p>
              <p className="text-xs text-muted-foreground">
                콘텐츠 생성 시 기본 언어
              </p>
            </div>
            <Badge variant="outline">한국어</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">타임존</p>
              <p className="text-xs text-muted-foreground">
                스케줄 및 발행 시간 기준
              </p>
            </div>
            <Badge variant="outline">Asia/Seoul (UTC+9)</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
