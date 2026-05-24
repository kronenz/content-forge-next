"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiInsightPanel } from "./_components/ai-insight-panel";
import {
  LayoutDashboard,
  Inbox,
  Workflow,
  FileText,
  Send,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Flame,
  Search,
  Bell,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "대시보드", href: "/prototype" },
  { icon: Inbox, label: "소스 관리", href: "/prototype/sources" },
  { icon: Workflow, label: "파이프라인", href: "/prototype/pipeline" },
  { icon: FileText, label: "콘텐츠", href: "/prototype/contents" },
  { icon: Send, label: "발행", href: "/prototype/publish" },
  { icon: BarChart3, label: "분석", href: "/prototype/analytics" },
];

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex h-screen bg-background text-foreground transition-colors">
        {/* Sidebar */}
        <aside
          className={`relative flex flex-col border-r border-white/[0.06] bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 transition-all duration-300 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 ${
            collapsed ? "w-16" : "w-60"
          }`}
        >
          {/* Subtle gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-500/[0.03] to-transparent" />

          {/* Logo */}
          <div className="relative flex h-14 items-center gap-2.5 border-b border-white/[0.06] px-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-2.5 transition-all hover:scale-[1.02]"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                <Flame className="size-4 text-white" />
              </div>
              {!collapsed && (
                <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-sm font-bold tracking-tight text-transparent">
                  Content Forge
                </span>
              )}
            </button>
          </div>

          {/* Nav */}
          <nav className="relative flex-1 space-y-0.5 p-2 pt-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                  (item.href === "/prototype" ? pathname === "/prototype" : pathname.startsWith(item.href))
                    ? "bg-white/[0.08] font-medium text-white shadow-sm"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
                }`}
              >
                {(item.href === "/prototype" ? pathname === "/prototype" : pathname.startsWith(item.href)) && (
                  <div className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-gradient-to-b from-violet-400 to-indigo-500" />
                )}
                <item.icon
                  className={`size-[18px] shrink-0 transition-colors ${
                    (item.href === "/prototype" ? pathname === "/prototype" : pathname.startsWith(item.href))
                      ? "text-violet-400"
                      : "group-hover:text-zinc-400"
                  }`}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div className="relative border-t border-white/[0.06] p-2 space-y-0.5">
            <Link
              href="/prototype/design-system"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 transition-all"
            >
              <Settings className="size-[18px] shrink-0" />
              {!collapsed && <span>디자인 시스템</span>}
            </Link>
            <button
              onClick={() => setDark(!dark)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 transition-all"
            >
              {dark ? (
                <Sun className="size-[18px] shrink-0" />
              ) : (
                <Moon className="size-[18px] shrink-0" />
              )}
              {!collapsed && (
                <span>{dark ? "Light Mode" : "Dark Mode"}</span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border">
              <Search className="size-3.5" />
              <span>검색...</span>
              <kbd className="ml-4 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/60 border border-border/50">
                Cmd+K
              </kbd>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Bell className="size-4" />
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-[9px] font-bold text-white">
                  3
                </span>
              </button>
              <div className="h-5 w-px bg-border/50" />
              <button className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted">
                <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-[11px] font-bold text-white">
                  K
                </div>
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-violet-950/[0.02]">
            {children}
          </main>

          {/* AI Insight Panel */}
          <AiInsightPanel pathname={pathname} />
        </div>
      </div>
    </div>
  );
}
