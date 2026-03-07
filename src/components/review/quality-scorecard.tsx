"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface QualityScores {
  quality: number | null;
  accuracy: number | null;
  humanLike: number | null;
  platformFit: number | null;
  cultureFit: number | null;
}

interface QualityScorecardProps {
  scores: QualityScores;
  aiScores?: QualityScores;
  onScoreChange?: (key: keyof QualityScores, value: number) => void;
  readonly?: boolean;
}

const SCORE_LABELS: { key: keyof QualityScores; label: string }[] = [
  { key: "quality", label: "Quality" },
  { key: "accuracy", label: "Accuracy" },
  { key: "humanLike", label: "Human-like" },
  { key: "platformFit", label: "Platform-fit" },
  { key: "cultureFit", label: "Culture-fit" },
];

function ScoreBar({
  value,
  aiValue,
  onChange,
  readonly,
}: {
  value: number | null;
  aiValue?: number | null;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const score = value ?? 0;
  const pct = (score / 10) * 100;
  const aiPct = aiValue != null ? (aiValue / 10) * 100 : null;

  const color =
    score >= 8
      ? "bg-green-500"
      : score >= 6
        ? "bg-yellow-500"
        : score >= 4
          ? "bg-orange-500"
          : "bg-red-500";

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 h-3 rounded-full bg-muted overflow-hidden">
        {aiPct != null && (
          <div
            className="absolute inset-y-0 left-0 bg-blue-200 rounded-full"
            style={{ width: `${aiPct}%` }}
          />
        )}
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {!readonly && onChange ? (
        <input
          type="number"
          min={0}
          max={10}
          step={0.1}
          value={score}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v >= 0 && v <= 10) onChange(v);
          }}
          className="w-14 text-right text-sm font-mono border rounded px-1 py-0.5"
        />
      ) : (
        <span className="w-10 text-right text-sm font-mono font-medium">
          {value != null ? value.toFixed(1) : "-"}
        </span>
      )}
    </div>
  );
}

export function QualityScorecard({
  scores,
  aiScores,
  onScoreChange,
  readonly = true,
}: QualityScorecardProps) {
  const validScores = SCORE_LABELS.map((s) => scores[s.key]).filter(
    (v): v is number => v != null,
  );
  const overall =
    validScores.length > 0
      ? validScores.reduce((a, b) => a + b, 0) / validScores.length
      : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">품질 평가</CardTitle>
          {overall != null && (
            <span
              className={`text-lg font-bold ${
                overall >= 8
                  ? "text-green-600"
                  : overall >= 6
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {overall.toFixed(1)}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {SCORE_LABELS.map(({ key, label }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{label}</span>
              {aiScores?.[key] != null && (
                <span className="text-xs text-blue-500">
                  AI: {aiScores[key]!.toFixed(1)}
                </span>
              )}
            </div>
            <ScoreBar
              value={scores[key]}
              aiValue={aiScores?.[key]}
              onChange={
                onScoreChange ? (v) => onScoreChange(key, v) : undefined
              }
              readonly={readonly}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
