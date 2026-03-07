"use client";

import { useState } from "react";
import { PricingCard } from "@/components/pricing/pricing-card";
import { PLANS } from "@/server/services/subscription";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">가격 정책</h1>
          <p className="mt-2 text-muted-foreground">
            프로젝트에 맞는 플랜을 선택하세요.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Label htmlFor="billing-toggle" className="text-sm">
              월간
            </Label>
            <Switch
              id="billing-toggle"
              checked={yearly}
              onCheckedChange={setYearly}
            />
            <Label htmlFor="billing-toggle" className="text-sm">
              연간 <span className="text-primary">(최대 17% 할인)</span>
            </Label>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} yearly={yearly} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold">자주 묻는 질문</h3>
          <div className="mt-6 mx-auto max-w-2xl space-y-4 text-left">
            {[
              {
                q: "무료 플랜으로 어디까지 가능한가요?",
                a: "소스 3개, 월 10회 파이프라인 실행, 2개 플랫폼 발행이 가능합니다. 핵심 기능을 충분히 체험할 수 있습니다.",
              },
              {
                q: "플랜을 언제든 변경할 수 있나요?",
                a: "네, 언제든 업그레이드 또는 다운그레이드가 가능합니다. 업그레이드 시 즉시 적용되며, 다운그레이드는 다음 결제 주기부터 적용됩니다.",
              },
              {
                q: "환불 정책은 어떻게 되나요?",
                a: "구독 시작 후 14일 이내 전액 환불이 가능합니다. 연간 구독의 경우 잔여 기간에 대한 비례 환불을 제공합니다.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-lg border p-4">
                <p className="font-medium text-sm">{q}</p>
                <p className="mt-1 text-sm text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
