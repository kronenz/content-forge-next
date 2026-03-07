"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Zap,
  Crown,
  ExternalLink,
} from "lucide-react";
import { PLANS, getPlan } from "@/server/services/subscription";
import { PricingCard } from "@/components/pricing/pricing-card";
import type { PlanId } from "@/server/services/subscription";

// Demo data (would come from tRPC in production)
const DEMO_SUBSCRIPTION = {
  planId: "free" as PlanId,
  status: "active" as const,
  cancelAtPeriodEnd: false,
  currentPeriodEnd: null as Date | null,
};

const DEMO_USAGE = {
  sources: { used: 2, limit: 3 },
  pipelineRuns: { used: 7, limit: 10 },
  researchAgent: { used: 0, limit: 0 },
};

export default function BillingPage() {
  const [yearly, setYearly] = useState(false);
  const subscription = DEMO_SUBSCRIPTION;
  const usage = DEMO_USAGE;
  const currentPlan = getPlan(subscription.planId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">결제 및 구독</h1>
        <p className="text-sm text-muted-foreground">
          구독 플랜을 관리하고 사용량을 확인합니다.
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="h-4 w-4" />
              현재 플랜
            </CardTitle>
            <Badge variant={subscription.planId === "free" ? "secondary" : "default"}>
              {currentPlan.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{currentPlan.name} 플랜</p>
              <p className="text-sm text-muted-foreground">
                {currentPlan.description}
              </p>
            </div>
            {subscription.planId !== "free" && (
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                결제 관리
              </Button>
            )}
          </div>

          {subscription.cancelAtPeriodEnd && (
            <div className="rounded-md bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-3 text-sm">
              구독이 현재 기간 종료 시 취소됩니다.
              {subscription.currentPeriodEnd && (
                <span className="font-medium">
                  {" "}
                  ({subscription.currentPeriodEnd.toLocaleDateString()})
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            이번 달 사용량
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <UsageBar
            label="소스"
            used={usage.sources.used}
            limit={usage.sources.limit}
          />
          <UsageBar
            label="파이프라인 실행"
            used={usage.pipelineRuns.used}
            limit={usage.pipelineRuns.limit}
          />
          {usage.researchAgent.limit > 0 && (
            <UsageBar
              label="Research Agent"
              used={usage.researchAgent.used}
              limit={usage.researchAgent.limit}
            />
          )}
        </CardContent>
      </Card>

      {/* Plans */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              플랜 비교
            </CardTitle>
            <div className="flex items-center rounded-lg border p-0.5">
              <button
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  !yearly
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => setYearly(false)}
              >
                월간
              </button>
              <button
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  yearly
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => setYearly(true)}
              >
                연간 (할인)
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                yearly={yearly}
                currentPlan={subscription.planId}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className={isNearLimit ? "text-orange-600 font-medium" : "text-muted-foreground"}>
          {used} / {limit >= 999 ? "무제한" : limit}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
