"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  Anvil,
  Zap,
  Hexagon,
  Diamond,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Glass Card                                                         */
/* ------------------------------------------------------------------ */

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.05] ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Color Palette Options                                              */
/* ------------------------------------------------------------------ */

const palettes = [
  {
    name: "Forge Amber",
    desc: "Warm, crafting-inspired. Evokes the forge fire.",
    primary: "#f59e0b",
    primaryFrom: "#f59e0b",
    primaryTo: "#d97706",
    accent: "#6366f1",
    accentTo: "#818cf8",
    surface: "#09090b",
    surfaceLight: "#18181b",
    muted: "#27272a",
    swatches: [
      { label: "Primary 400", hex: "#fbbf24" },
      { label: "Primary 500", hex: "#f59e0b" },
      { label: "Primary 600", hex: "#d97706" },
      { label: "Accent 500", hex: "#6366f1" },
      { label: "Surface", hex: "#09090b" },
      { label: "Surface 2", hex: "#18181b" },
    ],
  },
  {
    name: "Forge Violet",
    desc: "Modern, creative, AI-native. Premium tech feel.",
    primary: "#8b5cf6",
    primaryFrom: "#8b5cf6",
    primaryTo: "#6366f1",
    accent: "#06b6d4",
    accentTo: "#22d3ee",
    surface: "#09090b",
    surfaceLight: "#18181b",
    muted: "#27272a",
    swatches: [
      { label: "Primary 400", hex: "#a78bfa" },
      { label: "Primary 500", hex: "#8b5cf6" },
      { label: "Primary 600", hex: "#7c3aed" },
      { label: "Accent 500", hex: "#06b6d4" },
      { label: "Surface", hex: "#09090b" },
      { label: "Surface 2", hex: "#18181b" },
    ],
  },
  {
    name: "Forge Emerald",
    desc: "Growth, success, productivity. Content creation energy.",
    primary: "#10b981",
    primaryFrom: "#10b981",
    primaryTo: "#059669",
    accent: "#8b5cf6",
    accentTo: "#a78bfa",
    surface: "#0a0a0a",
    surfaceLight: "#171717",
    muted: "#262626",
    swatches: [
      { label: "Primary 400", hex: "#34d399" },
      { label: "Primary 500", hex: "#10b981" },
      { label: "Primary 600", hex: "#059669" },
      { label: "Accent 500", hex: "#8b5cf6" },
      { label: "Surface", hex: "#0a0a0a" },
      { label: "Surface 2", hex: "#171717" },
    ],
  },
  {
    name: "Forge Cyan",
    desc: "Clean, technical, trustworthy. Data-driven feel.",
    primary: "#06b6d4",
    primaryFrom: "#06b6d4",
    primaryTo: "#0891b2",
    accent: "#f43f5e",
    accentTo: "#fb7185",
    surface: "#0a0a0a",
    surfaceLight: "#171717",
    muted: "#262626",
    swatches: [
      { label: "Primary 400", hex: "#22d3ee" },
      { label: "Primary 500", hex: "#06b6d4" },
      { label: "Primary 600", hex: "#0891b2" },
      { label: "Accent 500", hex: "#f43f5e" },
      { label: "Surface", hex: "#0a0a0a" },
      { label: "Surface 2", hex: "#171717" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Font Options                                                       */
/* ------------------------------------------------------------------ */

const fontOptions = [
  {
    name: "Geist (Current)",
    desc: "Vercel's geometric sans. Clean, modern, developer-friendly.",
    tag: "geometric",
  },
  {
    name: "Inter",
    desc: "Highly legible, screen-optimized. SaaS dashboard standard.",
    tag: "humanist",
  },
  {
    name: "Plus Jakarta Sans",
    desc: "Slightly rounded, friendly yet professional. Great for branding.",
    tag: "soft",
  },
  {
    name: "Space Grotesk",
    desc: "Distinctive, techy. Excellent for headlines with Inter body.",
    tag: "tech",
  },
];

/* ------------------------------------------------------------------ */
/*  Logo Concepts                                                      */
/* ------------------------------------------------------------------ */

const logoOptions = [
  { icon: Flame, name: "Flame", desc: "Creation, transformation" },
  { icon: Anvil, name: "Anvil", desc: "Craftsmanship, shaping" },
  { icon: Zap, name: "Zap", desc: "Speed, AI automation" },
  { icon: Hexagon, name: "Hexagon", desc: "Structure, modularity" },
  { icon: Diamond, name: "Diamond", desc: "Quality, precision" },
  { icon: Sparkles, name: "Sparkles", desc: "AI magic, intelligence" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DesignSystemPage() {
  return (
    <div className="relative p-6 space-y-10 max-w-6xl">
      {/* Background glow */}
      <div className="pointer-events-none fixed right-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/[0.03] blur-[120px]" />

      <div>
        <h1 className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Design System
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Brand identity exploration for Content Forge
        </p>
      </div>

      {/* ============================================================ */}
      {/*  1. COLOR PALETTES                                           */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-white">Color Palettes</h2>
          <span className="text-[11px] text-zinc-600 uppercase tracking-wider">Dark Mode First</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {palettes.map((palette) => (
            <GlassCard key={palette.name} className="overflow-hidden">
              {/* Live preview header */}
              <div className="p-4 space-y-3" style={{ backgroundColor: palette.surface }}>
                {/* Top bar preview */}
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex size-9 items-center justify-center rounded-xl shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${palette.primaryFrom}, ${palette.primaryTo})`,
                      boxShadow: `0 8px 24px ${palette.primary}30`,
                    }}
                  >
                    <Flame className="size-4 text-white" />
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{
                      background: `linear-gradient(90deg, #fafafa, #a1a1aa)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Content Forge
                  </span>
                </div>

                {/* Mini cards */}
                <div className="flex gap-2">
                  <div className="flex-1 rounded-xl p-3" style={{ backgroundColor: palette.surfaceLight }}>
                    <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#52525b" }}>
                      Active
                    </div>
                    <div className="text-lg font-bold mt-0.5" style={{ color: "#fafafa" }}>12</div>
                    <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ backgroundColor: palette.muted }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "65%",
                          background: `linear-gradient(90deg, ${palette.primaryFrom}, ${palette.primaryTo})`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl p-3" style={{ backgroundColor: palette.surfaceLight }}>
                    <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#52525b" }}>
                      Published
                    </div>
                    <div className="text-lg font-bold mt-0.5" style={{ color: "#fafafa" }}>47</div>
                    <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ backgroundColor: palette.muted }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "85%",
                          background: `linear-gradient(90deg, ${palette.accent}, ${palette.accentTo})`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons preview */}
                <div className="flex gap-2 items-center">
                  <button
                    className="rounded-xl px-3.5 py-2 text-xs font-medium text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${palette.primaryFrom}, ${palette.primaryTo})`,
                      boxShadow: `0 4px 16px ${palette.primary}25`,
                    }}
                  >
                    Run Pipeline
                  </button>
                  <button
                    className="rounded-xl px-3.5 py-2 text-xs font-medium border"
                    style={{
                      borderColor: `${palette.muted}`,
                      color: "#a1a1aa",
                    }}
                  >
                    View Sources
                  </button>
                  <span className="ml-auto text-xs font-medium" style={{ color: palette.accent }}>
                    + New
                  </span>
                </div>
              </div>

              {/* Swatches */}
              <div className="p-4 pt-3">
                <div className="text-xs font-semibold text-zinc-200 mb-2">{palette.name}</div>
                <div className="text-[11px] text-zinc-500 mb-3">{palette.desc}</div>
                <div className="grid grid-cols-6 gap-1.5">
                  {palette.swatches.map((s) => (
                    <div key={s.label} className="space-y-1">
                      <div
                        className="h-8 rounded-lg ring-1 ring-inset ring-white/10"
                        style={{ backgroundColor: s.hex }}
                      />
                      <div className="text-[9px] text-zinc-600 truncate">{s.label}</div>
                      <div className="text-[9px] font-mono text-zinc-700">{s.hex}</div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* ============================================================ */}
      {/*  2. TYPOGRAPHY                                               */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Typography</h2>

        <div className="grid grid-cols-2 gap-3">
          {fontOptions.map((font) => (
            <GlassCard key={font.name}>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-200">{font.name}</span>
                  <span className="rounded-lg bg-white/[0.06] px-2 py-0.5 text-[10px] text-zinc-500">
                    {font.tag}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">{font.desc}</p>
                <div className="h-px bg-white/[0.04]" />
                <div className="space-y-1.5">
                  <p className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                    Content Forge Dashboard
                  </p>
                  <p className="text-base text-zinc-300">
                    AI-powered content pipeline management
                  </p>
                  <p className="text-sm text-zinc-500">
                    Collect, process, review, and publish across platforms.
                  </p>
                  <p className="text-xs text-zinc-600 font-mono">
                    Pipeline #1234 completed in 1m 32s
                  </p>
                </div>
                <div className="flex items-baseline gap-4 pt-1">
                  <span className="text-3xl font-bold text-white">Aa</span>
                  <span className="text-xl font-semibold text-zinc-300">Aa</span>
                  <span className="text-base font-medium text-zinc-400">Aa</span>
                  <span className="text-sm text-zinc-500">Aa</span>
                  <span className="text-xs text-zinc-600">Aa</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Type scale */}
        <GlassCard>
          <div className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200">Type Scale (Geist)</h3>
            <div className="space-y-4">
              {[
                { size: "text-4xl", weight: "font-bold", label: "4xl / bold", text: "Content Forge", gradient: true },
                { size: "text-2xl", weight: "font-bold tracking-tight", label: "2xl / bold", text: "Dashboard Overview", gradient: false },
                { size: "text-lg", weight: "font-semibold", label: "lg / semibold", text: "Pipeline Monitor", gradient: false },
                { size: "text-sm", weight: "font-medium", label: "sm / medium", text: "AI Agent-based content automation platform", gradient: false },
                { size: "text-xs", weight: "text-zinc-500", label: "xs / muted", text: "Last updated 3 minutes ago", gradient: false },
              ].map((item) => (
                <div key={item.label} className="flex items-baseline gap-6">
                  <span className="text-[10px] text-zinc-600 w-36 shrink-0 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span
                    className={`${item.size} ${item.weight} ${
                      item.gradient
                        ? "bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
                        : "text-zinc-200"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* ============================================================ */}
      {/*  3. LOGO / ICON CONCEPTS                                     */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Logo / Icon Concepts</h2>

        <div className="grid grid-cols-3 gap-3">
          {logoOptions.map((logo) => (
            <GlassCard key={logo.name}>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  {[
                    { from: "#f59e0b", to: "#d97706", shadow: "#f59e0b" },
                    { from: "#8b5cf6", to: "#6366f1", shadow: "#8b5cf6" },
                    { from: "#10b981", to: "#059669", shadow: "#10b981" },
                    { from: "#06b6d4", to: "#0891b2", shadow: "#06b6d4" },
                  ].map((color, i) => (
                    <div
                      key={i}
                      className="flex size-12 items-center justify-center rounded-2xl transition-all duration-200 hover:scale-110 cursor-pointer"
                      style={{
                        background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                        boxShadow: `0 8px 24px ${color.shadow}30`,
                      }}
                    >
                      <logo.icon className="size-5 text-white" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{logo.name}</p>
                  <p className="text-xs text-zinc-500">{logo.desc}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Logo in context — sidebar simulation */}
        <GlassCard>
          <div className="p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">Logo in Sidebar Context</h3>
            <div className="grid grid-cols-4 gap-3">
              {palettes.map((palette) => (
                <div
                  key={palette.name}
                  className="rounded-2xl p-4 space-y-3"
                  style={{ backgroundColor: palette.surface }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex size-8 items-center justify-center rounded-lg shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${palette.primaryFrom}, ${palette.primaryTo})`,
                        boxShadow: `0 4px 12px ${palette.primary}30`,
                      }}
                    >
                      <Flame className="size-3.5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-zinc-200">
                      Content Forge
                    </span>
                  </div>
                  {/* Mini nav */}
                  <div className="space-y-0.5">
                    {["Dashboard", "Sources", "Pipeline"].map((item, i) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                        style={{
                          backgroundColor: i === 0 ? `${palette.primary}15` : "transparent",
                        }}
                      >
                        {i === 0 && (
                          <div
                            className="h-4 w-[2px] rounded-full -ml-1"
                            style={{
                              background: `linear-gradient(180deg, ${palette.primaryFrom}, ${palette.primaryTo})`,
                            }}
                          />
                        )}
                        <span
                          className="text-[11px]"
                          style={{
                            color: i === 0 ? palette.primary : "#52525b",
                          }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[9px] text-zinc-700 text-center pt-1">{palette.name}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* ============================================================ */}
      {/*  4. COMPONENT STYLES                                         */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Component Styles</h2>

        {/* Buttons */}
        <GlassCard>
          <div className="p-5 space-y-5">
            <h3 className="text-sm font-semibold text-zinc-200">Buttons</h3>

            {/* Gradient primary buttons */}
            <div>
              <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-3">Primary (Gradient)</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 rounded-xl gap-1.5">
                  <Sparkles className="size-3.5" />
                  Run Pipeline
                </Button>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/20 rounded-xl gap-1.5">
                  <Sparkles className="size-3.5" />
                  Run Pipeline
                </Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 rounded-xl gap-1.5">
                  <Sparkles className="size-3.5" />
                  Run Pipeline
                </Button>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 rounded-xl gap-1.5">
                  <Sparkles className="size-3.5" />
                  Run Pipeline
                </Button>
              </div>
            </div>

            {/* Glass buttons */}
            <div>
              <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-3">Glass / Outline</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" className="border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:bg-white/[0.06] hover:text-white rounded-xl">
                  View Sources
                </Button>
                <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-xl">
                  Ghost
                </Button>
                <Button variant="destructive" className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl">
                  Delete
                </Button>
                <Button variant="link" className="text-violet-400 hover:text-violet-300">
                  Learn more <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 rounded-lg">
                  XS
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 rounded-xl">
                  Small
                </Button>
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 rounded-xl">
                  Default
                </Button>
                <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 rounded-xl">
                  Large
                </Button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Badges */}
        <GlassCard>
          <div className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-200">Badges & Status</h3>
            <div>
              <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-3">Status</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 rounded-lg">
                  Completed
                </Badge>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 rounded-lg animate-pulse">
                  Running
                </Badge>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 rounded-lg">
                  Warning
                </Badge>
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 rounded-lg">
                  Failed
                </Badge>
                <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/20 rounded-lg">
                  Reviewing
                </Badge>
                <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 rounded-lg">
                  Scheduled
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-zinc-600 uppercase tracking-wider mb-3">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {["Blog", "LinkedIn", "X", "Instagram", "YouTube"].map((p) => (
                  <span
                    key={p}
                    className="rounded-lg bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-400 ring-1 ring-inset ring-white/[0.06]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Cards comparison */}
        <div className="grid grid-cols-3 gap-3">
          <GlassCard>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-violet-500/20 to-violet-500/5 p-5">
              <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Stat Card</div>
              <div className="text-3xl font-bold tracking-tight text-white mt-1">47</div>
              <div className="text-xs text-emerald-400 mt-1">+12% vs last week</div>
              <div className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-full bg-white/[0.03] blur-xl" />
            </div>
          </GlassCard>
          <GlassCard className="border-violet-500/20 shadow-lg shadow-violet-500/5">
            <div className="p-5">
              <div className="text-sm font-medium text-zinc-200">Accent Border</div>
              <div className="text-xs text-zinc-500 mt-1">
                Highlighted with brand color glow
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="p-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                <Flame className="size-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-200">Icon Card</div>
                <div className="text-xs text-zinc-500">Gradient icon</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* ============================================================ */}
      {/*  5. BORDER RADIUS                                            */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Border Radius</h2>
        <GlassCard>
          <div className="p-5 space-y-4">
            <div className="flex items-end gap-6">
              {[
                { label: "sm (4px)", cls: "rounded-sm" },
                { label: "md (6px)", cls: "rounded-md" },
                { label: "lg (8px)", cls: "rounded-lg" },
                { label: "xl (12px)", cls: "rounded-xl" },
                { label: "2xl (16px)", cls: "rounded-2xl" },
                { label: "full", cls: "rounded-full" },
              ].map((r) => (
                <div key={r.label} className="flex flex-col items-center gap-2">
                  <div
                    className={`size-16 bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25 ${r.cls}`}
                  />
                  <span className="text-[10px] text-zinc-500">{r.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-600">
              Recommendation: xl (12px) or 2xl (16px) for modern, friendly feel. Currently: 10px.
            </p>
          </div>
        </GlassCard>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* ============================================================ */}
      {/*  6. QUALITY SCORE                                            */}
      {/* ============================================================ */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Quality Score Card</h2>
        <p className="text-sm text-zinc-500">
          5 quality metrics (0-10). Core UI for content review.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {/* Option A: Gradient bars */}
          <GlassCard>
            <div className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-200">Option A: Gradient Bars</h3>
              {[
                { label: "Quality", score: 8.5, from: "#10b981", to: "#34d399" },
                { label: "Accuracy", score: 9.0, from: "#10b981", to: "#34d399" },
                { label: "Human-like", score: 7.5, from: "#f59e0b", to: "#fbbf24" },
                { label: "Platform-fit", score: 8.0, from: "#10b981", to: "#34d399" },
                { label: "Culture-fit", score: 8.5, from: "#10b981", to: "#34d399" },
              ].map((m) => (
                <div key={m.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">{m.label}</span>
                    <span className="text-xs font-mono font-semibold text-zinc-200">
                      {m.score.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${m.score * 10}%`,
                        background: `linear-gradient(90deg, ${m.from}, ${m.to})`,
                        boxShadow: `0 0 8px ${m.from}40`,
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="h-px bg-white/[0.04]" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">Overall</span>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  8.3
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Option B: Grid with glow */}
          <GlassCard>
            <div className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-200">Option B: Glow Grid</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Quality", score: 8.5 },
                  { label: "Accuracy", score: 9.0 },
                  { label: "Human-like", score: 7.5 },
                  { label: "Platform-fit", score: 8.0 },
                  { label: "Culture-fit", score: 8.5 },
                  { label: "AI Detect", score: 1.5, inverted: true },
                ].map((m) => {
                  const good = "inverted" in m ? m.score < 3 : m.score >= 7;
                  const color = good ? "#10b981" : "#f59e0b";
                  return (
                    <div
                      key={m.label}
                      className="rounded-xl border p-3 text-center"
                      style={{
                        borderColor: `${color}20`,
                        backgroundColor: `${color}08`,
                        boxShadow: `inset 0 1px 0 ${color}10`,
                      }}
                    >
                      <div
                        className="text-xl font-bold font-mono"
                        style={{ color }}
                      >
                        {m.score.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1">
                        {m.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="h-px bg-white/[0.04]" />
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-zinc-500">Overall</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  8.3
                </span>
                <span className="text-xs text-zinc-600">/10</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <div className="h-10" />
    </div>
  );
}
