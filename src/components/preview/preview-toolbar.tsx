"use client";

import { Button } from "@/components/ui/button";
import type { PreviewToolbarProps } from "@/types/preview";
import {
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const VIEWPORT_OPTIONS = [
  { value: "desktop" as const, icon: Monitor, label: "Desktop" },
  { value: "tablet" as const, icon: Tablet, label: "Tablet" },
  { value: "mobile" as const, icon: Smartphone, label: "Mobile" },
];

export function PreviewToolbar({
  viewport,
  onViewportChange,
  theme,
  onThemeChange,
  zoom,
  onZoomChange,
}: PreviewToolbarProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card p-2">
      {/* Viewport toggle */}
      <div className="flex rounded-md border">
        {VIEWPORT_OPTIONS.map(({ value, icon: Icon, label }) => (
          <Button
            key={value}
            variant={viewport === value ? "default" : "ghost"}
            size="sm"
            className="h-8 px-2.5"
            onClick={() => onViewportChange(value)}
            title={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Separator */}
      <div className="h-6 w-px bg-border" />

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2.5"
        onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
        title={theme === "light" ? "다크 모드" : "라이트 모드"}
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-border" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => onZoomChange(Math.max(50, zoom - 10))}
          disabled={zoom <= 50}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="min-w-[3rem] text-center text-xs font-medium text-muted-foreground">
          {zoom}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => onZoomChange(Math.min(150, zoom + 10))}
          disabled={zoom >= 150}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
