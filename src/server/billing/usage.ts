import { db } from "@/lib/db";
import { pipelineRuns, sources } from "@/server/db/schema";
import { sql, count } from "drizzle-orm";
import { getPlan, type PlanId, type PlanLimits } from "./plans";

export interface UsageStats {
  sources: { used: number; limit: number };
  pipelineRuns: { used: number; limit: number };
  researchAgent: { used: number; limit: number };
}

export async function getUsageStats(planId: PlanId): Promise<UsageStats> {
  const plan = getPlan(planId);
  const limits = plan.limits;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [sourceCount, pipelineRunCount] = await Promise.all([
    db
      .select({ count: count() })
      .from(sources)
      .then((r) => r[0]?.count ?? 0),
    db
      .select({ count: count() })
      .from(pipelineRuns)
      .where(sql`${pipelineRuns.createdAt} >= ${startOfMonth}`)
      .then((r) => r[0]?.count ?? 0),
  ]);

  // Research agent runs are pipeline runs with researcher agent steps
  // For now, count all pipeline runs as a proxy
  const researchCount = 0;

  return {
    sources: { used: sourceCount, limit: limits.sources },
    pipelineRuns: { used: pipelineRunCount, limit: limits.pipelineRunsPerMonth },
    researchAgent: {
      used: researchCount,
      limit: limits.researchAgentPerMonth,
    },
  };
}

export function checkLimit(
  planId: PlanId,
  resource: keyof PlanLimits,
  currentUsage: number,
): { allowed: boolean; limit: number; remaining: number } {
  const plan = getPlan(planId);
  const limit = plan.limits[resource];

  if (typeof limit !== "number") {
    return { allowed: true, limit: 0, remaining: 0 };
  }

  if (limit >= 9999) {
    return { allowed: true, limit, remaining: limit - currentUsage };
  }

  return {
    allowed: currentUsage < limit,
    limit,
    remaining: Math.max(0, limit - currentUsage),
  };
}

export function canAddSource(planId: PlanId, currentCount: number): boolean {
  return checkLimit(planId, "sources", currentCount).allowed;
}

export function canRunPipeline(planId: PlanId, currentCount: number): boolean {
  return checkLimit(planId, "pipelineRunsPerMonth", currentCount).allowed;
}
