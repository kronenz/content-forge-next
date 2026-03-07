export type PlanId = "free" | "creator" | "pro" | "team" | "enterprise";

export interface PlanLimit {
  sources: number;
  pipelineRunsPerMonth: number;
  platforms: number;
  researchPerMonth: number;
  autoApproval: boolean;
  teamMembers: number;
  apiAccess: boolean;
  analytics: "basic" | "advanced" | "custom";
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number; // monthly USD, 0 for free
  yearlyPrice: number;
  description: string;
  limits: PlanLimit;
  features: string[];
  popular?: boolean;
  stripePriceId?: string;
  stripeYearlyPriceId?: string;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    description: "시작하기에 완벽한 무료 플랜",
    limits: {
      sources: 3,
      pipelineRunsPerMonth: 10,
      platforms: 2,
      researchPerMonth: 0,
      autoApproval: false,
      teamMembers: 1,
      apiAccess: false,
      analytics: "basic",
    },
    features: [
      "소스 3개",
      "월 10회 파이프라인 실행",
      "플랫폼 2개",
      "기본 분석",
      "커뮤니티 지원",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    price: 29,
    yearlyPrice: 290,
    description: "개인 크리에이터를 위한 플랜",
    limits: {
      sources: 15,
      pipelineRunsPerMonth: 100,
      platforms: 5,
      researchPerMonth: 10,
      autoApproval: false,
      teamMembers: 1,
      apiAccess: false,
      analytics: "basic",
    },
    features: [
      "소스 15개",
      "월 100회 파이프라인 실행",
      "플랫폼 5개",
      "Research Agent 10회/월",
      "Quick + Full 파이프라인",
      "이메일 지원",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    yearlyPrice: 790,
    description: "프로 크리에이터 & 마케터",
    popular: true,
    limits: {
      sources: 50,
      pipelineRunsPerMonth: 500,
      platforms: 10,
      researchPerMonth: 50,
      autoApproval: true,
      teamMembers: 3,
      apiAccess: true,
      analytics: "advanced",
    },
    features: [
      "소스 50개",
      "월 500회 파이프라인 실행",
      "모든 플랫폼",
      "커스텀 파이프라인",
      "Research Agent 50회/월",
      "자동 승인",
      "팀 3명",
      "API 접근",
      "고급 분석",
      "우선 이메일 지원",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: 199,
    yearlyPrice: 1990,
    description: "팀 협업을 위한 최적 플랜",
    limits: {
      sources: 999,
      pipelineRunsPerMonth: 2000,
      platforms: 10,
      researchPerMonth: 200,
      autoApproval: true,
      teamMembers: 10,
      apiAccess: true,
      analytics: "custom",
    },
    features: [
      "무제한 소스",
      "월 2,000회 파이프라인 실행",
      "모든 플랫폼",
      "커스텀 파이프라인",
      "Research Agent 200회/월",
      "자동 승인",
      "팀 10명",
      "API 접근",
      "커스텀 분석",
      "전담 매니저",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: -1, // custom
    yearlyPrice: -1,
    description: "대규모 조직을 위한 맞춤 플랜",
    limits: {
      sources: 999999,
      pipelineRunsPerMonth: 999999,
      platforms: 10,
      researchPerMonth: 999999,
      autoApproval: true,
      teamMembers: 999999,
      apiAccess: true,
      analytics: "custom",
    },
    features: [
      "모든 기능 무제한",
      "전용 Agent 파이프라인",
      "온프레미스 설치 옵션",
      "커스텀 도메인 + 브랜딩",
      "SLA 보장",
      "전담 기술 지원",
    ],
  },
];

export function getPlan(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0]!;
}

export function checkLimit(
  plan: Plan,
  metric: keyof PlanLimit,
  currentUsage: number,
): { allowed: boolean; limit: number; usage: number } {
  const limit = plan.limits[metric];
  if (typeof limit === "boolean") {
    return { allowed: limit as boolean, limit: limit ? 1 : 0, usage: currentUsage };
  }
  return {
    allowed: currentUsage < (limit as number),
    limit: limit as number,
    usage: currentUsage,
  };
}
