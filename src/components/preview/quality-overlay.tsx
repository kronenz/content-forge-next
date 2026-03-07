"use client";

import { Progress } from "@/components/ui/progress";
import type { QualityOverlayProps } from "@/types/preview";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const SCORE_LABELS: { key: keyof QualityOverlayProps["scores"]; label: string }[] = [
  { key: "quality", label: "Quality" },
  { key: "accuracy", label: "Accuracy" },
  { key: "humanLike", label: "Human-like" },
  { key: "platformFit", label: "Platform-fit" },
  { key: "cultureFit", label: "Culture-fit" },
];

function scoreColor(score: number): string {
  if (score >= 8) return "text-green-600 dark:text-green-400";
  if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

export function QualityOverlay({
  scores,
  charCount,
  charLimit,
  hashtagCount,
  imageRatio,
}: QualityOverlayProps) {
  const average =
    SCORE_LABELS.reduce((sum, { key }) => sum + scores[key], 0) /
    SCORE_LABELS.length;

  const charWarning = charLimit && charCount > charLimit;
  const charStatus = charLimit
    ? charCount <= charLimit
      ? "여유"
      : "초과"
    : null;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">품질 지표</h3>

      {/* Score bars */}
      <div className="space-y-2">
        {SCORE_LABELS.map(({ key, label }) => {
          const value = scores[key];
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="w-24 text-xs text-muted-foreground">{label}</span>
              <Progress value={value * 10} className="h-2 flex-1" />
              <span className={`w-10 text-right text-xs font-medium ${scoreColor(value)}`}>
                {value.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Average */}
      <div className="flex items-center justify-between border-t pt-2">
        <span className="text-sm font-medium text-foreground">종합</span>
        <span className={`text-sm font-bold ${scoreColor(average)}`}>
          {average.toFixed(1)}/10
        </span>
      </div>

      {/* Meta checks */}
      <div className="space-y-1 border-t pt-2">
        {/* Character count */}
        <div className="flex items-center gap-2 text-xs">
          {charWarning ? (
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          )}
          <span className="text-muted-foreground">
            글자 수: {charCount.toLocaleString()}
            {charLimit && `/${charLimit.toLocaleString()}`}
            {charStatus && ` (${charStatus})`}
          </span>
        </div>

        {/* Hashtag count */}
        <div className="flex items-center gap-2 text-xs">
          {hashtagCount >= 3 && hashtagCount <= 10 ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
          )}
          <span className="text-muted-foreground">
            해시태그: {hashtagCount}개 (권장: 3-10개)
          </span>
        </div>

        {/* Image ratio */}
        {imageRatio && (
          <div className="flex items-center gap-2 text-xs">
            {imageRatio === "fit" ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
            )}
            <span className="text-muted-foreground">
              이미지 비율: {imageRatio === "fit" ? "적합" : "부적합"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
