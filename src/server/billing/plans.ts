export type PlanId = "free" | "creator" | "pro" | "team" | "enterprise";

export interface PlanLimits {
  sources: number;
  pipelineRunsPerMonth: number;
  platforms: number;
  researchAgentPerMonth: number;
  teamMembers: number;
  autoApproval: boolean;
  apiAccess: boolean;
  customPipeline: boolean;
  analytics: "basic" | "advanced" | "full";
}

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  priceMonthly: number; // USD cents
  priceYearly: number; // USD cents (per month, billed annually)
  stripePriceIdMonthly: string | null; // Set via env or Stripe dashboard
  stripePriceIdYearly: string | null;
  limits: PlanLimits;
  popular?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    description: "개인 사용자를 위한 무료 플랜",
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    limits: {
      sources: 3,
      pipelineRunsPerMonth: 10,
      platforms: 2,
      researchAgentPerMonth: 0,
      teamMembers: 1,
      autoApproval: false,
      apiAccess: false,
      customPipeline: false,
      analytics: "basic",
    },
  },
  creator: {
    id: "creator",
    name: "Creator",
    description: "콘텐츠 크리에이터를 위한 플랜",
    priceMonthly: 2900, // $29
    priceYearly: 2320, // $23.20/mo (20% discount)
    stripePriceIdMonthly: process.env.STRIPE_PRICE_CREATOR_MONTHLY ?? "",
    stripePriceIdYearly: process.env.STRIPE_PRICE_CREATOR_YEARLY ?? "",
    limits: {
      sources: 15,
      pipelineRunsPerMonth: 100,
      platforms: 5,
      researchAgentPerMonth: 10,
      teamMembers: 1,
      autoApproval: false,
      apiAccess: false,
      customPipeline: false,
      analytics: "basic",
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "전문 콘텐츠 마케터를 위한 플랜",
    priceMonthly: 7900, // $79
    priceYearly: 6320, // $63.20/mo
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? "",
    popular: true,
    limits: {
      sources: 50,
      pipelineRunsPerMonth: 500,
      platforms: 10, // all
      researchAgentPerMonth: 50,
      teamMembers: 3,
      autoApproval: true,
      apiAccess: true,
      customPipeline: true,
      analytics: "advanced",
    },
  },
  team: {
    id: "team",
    name: "Team",
    description: "팀 협업을 위한 플랜",
    priceMonthly: 19900, // $199
    priceYearly: 15920, // $159.20/mo
    stripePriceIdMonthly: process.env.STRIPE_PRICE_TEAM_MONTHLY ?? "",
    stripePriceIdYearly: process.env.STRIPE_PRICE_TEAM_YEARLY ?? "",
    limits: {
      sources: 9999, // unlimited
      pipelineRunsPerMonth: 2000,
      platforms: 10,
      researchAgentPerMonth: 200,
      teamMembers: 10,
      autoApproval: true,
      apiAccess: true,
      customPipeline: true,
      analytics: "advanced",
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "엔터프라이즈 고객을 위한 커스텀 플랜",
    priceMonthly: 0, // custom
    priceYearly: 0,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    limits: {
      sources: 9999,
      pipelineRunsPerMonth: 9999,
      platforms: 10,
      researchAgentPerMonth: 9999,
      teamMembers: 9999,
      autoApproval: true,
      apiAccess: true,
      customPipeline: true,
      analytics: "full",
    },
  },
};

export const OVERAGE_PRICES = {
  pipelineRun: 50, // $0.50 in cents
  researchAgent: 100, // $1.00 in cents
  imageGeneration: 30, // $0.30 in cents
} as const;

export function getPlan(planId: PlanId): Plan {
  return PLANS[planId];
}

export function getPlanByStripePriceId(priceId: string): Plan | undefined {
  return Object.values(PLANS).find(
    (p) =>
      p.stripePriceIdMonthly === priceId || p.stripePriceIdYearly === priceId,
  );
}
