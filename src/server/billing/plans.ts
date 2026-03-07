// Re-export plan types from the shared subscription service
export type { PlanId, Plan, PlanLimit } from "@/server/services/subscription";
export {
  PLANS,
  getPlan,
  checkLimit,
} from "@/server/services/subscription";

// Stripe price ID mapping (set via Stripe dashboard)
const STRIPE_PRICE_MAP: Record<string, string> = {
  creator_monthly: process.env.STRIPE_PRICE_CREATOR_MONTHLY ?? "",
  creator_yearly: process.env.STRIPE_PRICE_CREATOR_YEARLY ?? "",
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? "",
  team_monthly: process.env.STRIPE_PRICE_TEAM_MONTHLY ?? "",
  team_yearly: process.env.STRIPE_PRICE_TEAM_YEARLY ?? "",
};

export function getStripePriceId(
  planId: string,
  interval: "monthly" | "yearly",
): string | null {
  const key = `${planId}_${interval}`;
  const priceId = STRIPE_PRICE_MAP[key];
  return priceId || null;
}

export function getPlanByStripePriceId(priceId: string): string | null {
  for (const [key, value] of Object.entries(STRIPE_PRICE_MAP)) {
    if (value === priceId) {
      return key.split("_")[0] ?? null;
    }
  }
  return null;
}

export const OVERAGE_PRICES = {
  pipelineRun: 50, // $0.50 in cents
  researchAgent: 100, // $1.00 in cents
  imageGeneration: 30, // $0.30 in cents
} as const;
