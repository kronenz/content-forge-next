"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { Plan } from "@/server/services/subscription";

interface PricingCardProps {
  plan: Plan;
  yearly?: boolean;
  onSelect?: (planId: string) => void;
  currentPlan?: string;
}

export function PricingCard({
  plan,
  yearly,
  onSelect,
  currentPlan,
}: PricingCardProps) {
  const price = yearly ? plan.yearlyPrice : plan.price;
  const isCurrent = currentPlan === plan.id;
  const isCustom = price < 0;

  return (
    <Card
      className={`relative flex flex-col ${
        plan.popular ? "border-primary shadow-lg scale-105" : ""
      }`}
    >
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          인기
        </Badge>
      )}
      <CardHeader className="text-center">
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          {isCustom ? (
            <p className="text-3xl font-bold">문의</p>
          ) : (
            <>
              <span className="text-4xl font-bold">
                ${yearly ? Math.round(price / 12) : price}
              </span>
              <span className="text-sm text-muted-foreground">/월</span>
              {yearly && price > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  연 ${price} (
                  {Math.round((1 - price / (plan.price * 12)) * 100)}% 할인)
                </p>
              )}
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ul className="flex-1 space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className="mt-6 w-full"
          variant={plan.popular ? "default" : "outline"}
          disabled={isCurrent}
          onClick={() => onSelect?.(plan.id)}
        >
          {isCurrent
            ? "현재 플랜"
            : isCustom
              ? "영업팀 문의"
              : price === 0
                ? "무료로 시작"
                : "구독하기"}
        </Button>
      </CardContent>
    </Card>
  );
}
