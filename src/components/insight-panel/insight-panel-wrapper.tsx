"use client";

import { usePathname } from "next/navigation";
import { AIInsightPanel } from "./ai-insight-panel";

export function InsightPanelWrapper() {
  const pathname = usePathname();

  const context =
    pathname === "/"
      ? "dashboard"
      : pathname.split("/").filter(Boolean)[0] ?? "dashboard";

  return <AIInsightPanel context={context} />;
}
