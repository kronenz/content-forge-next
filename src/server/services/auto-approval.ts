export interface AutoApprovalConfig {
  enabled: boolean;
  minQualityScore: number;
  minAccuracyScore: number;
  minHumanLikeScore: number;
  minPlatformFitScore: number;
  minCultureFitScore: number;
  dailyAutoLimit: number;
  manualReviewRatio: number;
  platforms: string[];
}

export const DEFAULT_AUTO_APPROVAL_CONFIG: AutoApprovalConfig = {
  enabled: false,
  minQualityScore: 8.0,
  minAccuracyScore: 8.5,
  minHumanLikeScore: 7.5,
  minPlatformFitScore: 8.0,
  minCultureFitScore: 7.5,
  dailyAutoLimit: 10,
  manualReviewRatio: 0.2,
  platforms: ["blog", "linkedin", "twitter", "instagram"],
};

export type TrustLevel = 0 | 1 | 2 | 3;

export function computeTrustLevel(totalReviews: number, avgQuality: number): TrustLevel {
  if (totalReviews >= 100 && avgQuality >= 8.0) return 3;
  if (totalReviews >= 50 && avgQuality >= 7.5) return 2;
  if (totalReviews >= 20 && avgQuality >= 7.0) return 1;
  return 0;
}

export const TRUST_LEVEL_LABELS: Record<TrustLevel, { label: string; description: string }> = {
  0: { label: "Level 0: 전체 수동 검토", description: "모든 콘텐츠를 사람이 검토" },
  1: { label: "Level 1: AI 사전 필터링", description: "기준 미달만 수동 검토, 추천 승인 표시" },
  2: { label: "Level 2: 조건부 자동 승인", description: "조건 충족 시 자동 승인, 20% 샘플링" },
  3: { label: "Level 3: 완전 자동화", description: "거의 모든 콘텐츠 자동 승인" },
};

export interface AutoApprovalResult {
  approved: boolean;
  reason: string;
  scores: {
    quality: number;
    accuracy: number;
    humanLike: number;
    platformFit: number;
    cultureFit: number;
  };
}

export function checkAutoApproval(
  config: AutoApprovalConfig,
  scores: {
    quality: number;
    accuracy: number;
    humanLike: number;
    platformFit: number;
    cultureFit: number;
  },
  trustLevel: TrustLevel,
  platform: string,
): AutoApprovalResult {
  if (!config.enabled) {
    return { approved: false, reason: "자동 승인 비활성화", scores };
  }

  if (trustLevel < 2) {
    return { approved: false, reason: `신뢰도 레벨 부족 (현재: ${trustLevel}, 필요: 2+)`, scores };
  }

  if (!config.platforms.includes(platform)) {
    return { approved: false, reason: `플랫폼 ${platform}은 자동 승인 대상이 아닙니다`, scores };
  }

  if (scores.quality < config.minQualityScore) {
    return { approved: false, reason: `품질 점수 미달 (${scores.quality} < ${config.minQualityScore})`, scores };
  }
  if (scores.accuracy < config.minAccuracyScore) {
    return { approved: false, reason: `정확도 점수 미달 (${scores.accuracy} < ${config.minAccuracyScore})`, scores };
  }
  if (scores.humanLike < config.minHumanLikeScore) {
    return { approved: false, reason: `Human-like 점수 미달 (${scores.humanLike} < ${config.minHumanLikeScore})`, scores };
  }
  if (scores.platformFit < config.minPlatformFitScore) {
    return { approved: false, reason: `Platform-fit 점수 미달 (${scores.platformFit} < ${config.minPlatformFitScore})`, scores };
  }
  if (scores.cultureFit < config.minCultureFitScore) {
    return { approved: false, reason: `Culture-fit 점수 미달 (${scores.cultureFit} < ${config.minCultureFitScore})`, scores };
  }

  // Apply manual review sampling for Level 2
  if (trustLevel === 2 && Math.random() < config.manualReviewRatio) {
    return { approved: false, reason: "샘플링 수동 검토 대상", scores };
  }

  return { approved: true, reason: "자동 승인 조건 충족", scores };
}
