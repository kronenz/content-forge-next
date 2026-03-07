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
  Check,
  ExternalLink,
} from "lucide-react";
import { PLANS } from "@/server/billing/plans";
import type { PlanId } from "@/server/billing/plans";

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
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");
  const subscription = DEMO_SUBSCRIPTION;
  const usage = DEMO_USAGE;
  const currentPlan = PLANS[subscription.planId];

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
            <CardTitle className="text-base">플랜 비교</CardTitle>
            <div className="flex items-center rounded-lg border p-0.5">
              <button
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  interval === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => setInterval("monthly")}
              >
                월간
              </button>
              <button
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  interval === "yearly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
                onClick={() => setInterval("yearly")}
              >
                연간 (20% 할인)
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(["free", "creator", "pro", "team"] as PlanId[]).map((planId) => {
              const plan = PLANS[planId];
              const price =
                interval === "monthly"
                  ? plan.priceMonthly
                  : plan.priceYearly;
              const isCurrent = subscription.planId === planId;

              return (
                <div
                  key={planId}
                  className={`relative rounded-lg border p-4 ${
                    plan.popular
                      ? "border-primary ring-1 ring-primary"
                      : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <Badge className="text-xs">인기</Badge>
                    </div>
                  )}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                    <div>
                      {price === 0 ? (
                        <span className="text-2xl font-bold">무료</span>
                      ) : (
                        <>
                          <span className="text-2xl font-bold">
                            ${(price / 100).toFixed(0)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /월
                          </span>
                        </>
                      )}
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      <PlanFeature
                        text={`소스 ${plan.limits.sources >= 9999 ? "무제한" : plan.limits.sources + "개"}`}
                      />
                      <PlanFeature
                        text={`파이프라인 ${plan.limits.pipelineRunsPerMonth >= 9999 ? "무제한" : plan.limits.pipelineRunsPerMonth + "회/월"}`}
                      />
                      <PlanFeature
                        text={`플랫폼 ${plan.limits.platforms >= 10 ? "전체" : plan.limits.platforms + "개"}`}
                      />
                      <PlanFeature
                        text={`팀 멤버 ${plan.limits.teamMembers >= 9999 ? "무제한" : plan.limits.teamMembers + "명"}`}
                      />
                      {plan.limits.autoApproval && (
                        <PlanFeature text="자동 승인" />
                      )}
                      {plan.limits.apiAccess && (
                        <PlanFeature text="API 접근" />
                      )}
                      {plan.limits.customPipeline && (
                        <PlanFeature text="커스텀 파이프라인" />
                      )}
                    </ul>
                    <Button
                      className="w-full"
                      variant={isCurrent ? "outline" : "default"}
                      size="sm"
                      disabled={isCurrent}
                    >
                      {isCurrent ? (
                        "현재 플랜"
                      ) : (
                        <>
                          <CreditCard className="mr-1 h-3.5 w-3.5" />
                          {planId === "free" ? "다운그레이드" : "업그레이드"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enterprise */}
          <div className="mt-4 rounded-lg border border-dashed p-4 text-center">
            <p className="text-sm font-medium">Enterprise</p>
            <p className="text-xs text-muted-foreground">
              무제한 사용, 전담 매니저, SLA 보장, 커스텀 구성
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              영업팀 문의
            </Button>
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
          {used} / {limit >= 9999 ? "무제한" : limit}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

function PlanFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <Check className="h-3 w-3 text-primary shrink-0" />
      <span>{text}</span>
    </li>
  );
}
