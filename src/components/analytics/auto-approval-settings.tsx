"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DEFAULT_AUTO_APPROVAL_CONFIG,
  TRUST_LEVEL_LABELS,
  type AutoApprovalConfig,
  type TrustLevel,
} from "@/server/services/auto-approval";
import { Shield, Save } from "lucide-react";

interface AutoApprovalSettingsProps {
  trustLevel: TrustLevel;
  totalReviews: number;
  onSave?: (config: AutoApprovalConfig) => void;
}

const PLATFORM_OPTIONS = [
  { value: "blog", label: "Blog" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
];

export function AutoApprovalSettings({
  trustLevel,
  totalReviews,
  onSave,
}: AutoApprovalSettingsProps) {
  const [config, setConfig] = useState<AutoApprovalConfig>(
    DEFAULT_AUTO_APPROVAL_CONFIG,
  );

  function updateConfig<K extends keyof AutoApprovalConfig>(
    key: K,
    value: AutoApprovalConfig[K],
  ) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function togglePlatform(platform: string) {
    setConfig((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  }

  const trustInfo = TRUST_LEVEL_LABELS[trustLevel];
  const canAutoApprove = trustLevel >= 2;

  return (
    <div className="space-y-4">
      {/* Trust level card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-base">{trustInfo.label}</CardTitle>
              <CardDescription>{trustInfo.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {([0, 1, 2, 3] as TrustLevel[]).map((level) => (
              <div
                key={level}
                className={`flex-1 rounded-md border p-2 text-center text-xs ${
                  level === trustLevel
                    ? "border-primary bg-primary/10 font-medium"
                    : level < trustLevel
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-muted"
                }`}
              >
                <p className="font-medium">Level {level}</p>
                <p className="text-muted-foreground mt-0.5">
                  {level === 0
                    ? "0회"
                    : level === 1
                      ? "20회+"
                      : level === 2
                        ? "50회+"
                        : "100회+"}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            현재 검토 수: {totalReviews}회
          </p>
        </CardContent>
      </Card>

      {/* Auto-approval config */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">자동 승인 설정</CardTitle>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => updateConfig("enabled", checked)}
              disabled={!canAutoApprove}
            />
          </div>
          {!canAutoApprove && (
            <CardDescription className="text-yellow-600 dark:text-yellow-400">
              자동 승인은 Level 2 이상에서만 활성화할 수 있습니다.
            </CardDescription>
          )}
        </CardHeader>

        {config.enabled && (
          <CardContent className="space-y-4">
            {/* Score thresholds */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">최소 점수 기준</Label>
              {[
                { key: "minQualityScore" as const, label: "Quality" },
                { key: "minAccuracyScore" as const, label: "Accuracy" },
                { key: "minHumanLikeScore" as const, label: "Human-like" },
                { key: "minPlatformFitScore" as const, label: "Platform-fit" },
                { key: "minCultureFitScore" as const, label: "Culture-fit" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="w-28 text-sm text-muted-foreground">
                    {label}
                  </span>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={config[key]}
                    onChange={(e) => updateConfig(key, Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-xs text-muted-foreground">/10</span>
                </div>
              ))}
            </div>

            {/* Platform scope */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">대상 플랫폼</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map((opt) => (
                  <Badge
                    key={opt.value}
                    variant={
                      config.platforms.includes(opt.value)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => togglePlatform(opt.value)}
                  >
                    {opt.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">일일 최대</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={config.dailyAutoLimit}
                  onChange={(e) =>
                    updateConfig("dailyAutoLimit", Number(e.target.value))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">수동 검토 비율</Label>
                <Input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={config.manualReviewRatio}
                  onChange={(e) =>
                    updateConfig("manualReviewRatio", Number(e.target.value))
                  }
                />
              </div>
            </div>

            {/* Save */}
            <Button onClick={() => onSave?.(config)} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              설정 저장
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
