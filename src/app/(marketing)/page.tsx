import Link from "next/link";
import {
  Rss,
  Workflow,
  Send,
  BarChart3,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import {
  SoftwareApplicationJsonLd,
  OrganizationJsonLd,
} from "@/components/seo/json-ld";

const FEATURES = [
  {
    icon: Rss,
    title: "스마트 수집",
    description:
      "RSS, 웹 스크래핑, API, Research Agent로 다양한 소스에서 콘텐츠를 자동 수집합니다.",
  },
  {
    icon: Workflow,
    title: "AI Agent 파이프라인",
    description:
      "Analyst -> Writer -> Editor -> Formatter 체인으로 원본을 고품질 콘텐츠로 변환합니다.",
  },
  {
    icon: CheckCircle2,
    title: "품질 검토",
    description:
      "5대 품질 지표 (Quality, Accuracy, Human-like, Platform-fit, Culture-fit)로 콘텐츠를 평가합니다.",
  },
  {
    icon: Send,
    title: "멀티 플랫폼 발행",
    description:
      "Blog, LinkedIn, X, Instagram에 최적화된 포맷으로 자동 발행합니다.",
  },
  {
    icon: BarChart3,
    title: "성과 분석",
    description:
      "발행 성과, 품질 추이, 승인률을 대시보드에서 한눈에 확인합니다.",
  },
  {
    icon: Sparkles,
    title: "AI 인사이트",
    description:
      "화면별 AI 인사이트로 소스 품질, 파이프라인 최적화, 발행 전략을 제안합니다.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "소스 등록",
    description:
      "RSS 피드, 웹 페이지, API 등 수집할 콘텐츠 소스를 등록합니다.",
  },
  {
    step: "02",
    title: "자동 수집",
    description:
      "스케줄러가 주기적으로 새 콘텐츠를 수집하고 중복을 제거합니다.",
  },
  {
    step: "03",
    title: "AI 가공",
    description:
      "AI Agent 파이프라인이 분석, 작성, 교정, 포맷 변환을 자동 수행합니다.",
  },
  {
    step: "04",
    title: "검토 & 발행",
    description:
      "품질 검토 후 승인된 콘텐츠를 멀티 플랫폼에 자동 발행합니다.",
  },
];

const STATS = [
  { value: "10x", label: "콘텐츠 생산 속도 향상" },
  { value: "5+", label: "지원 플랫폼" },
  { value: "9", label: "전문 AI Agent" },
  { value: "$0", label: "무료 플랜 시작" },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 text-center lg:py-32">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
            <Zap className="h-3.5 w-3.5 text-primary" />
            AI 편집국이 운영하는 콘텐츠 공장
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            수집에서 발행까지
            <br />
            <span className="text-primary">AI 콘텐츠 자동화</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            RSS, 웹 스크래핑으로 소스를 수집하고, AI Agent 파이프라인이
            <br className="hidden sm:block" />
            Blog, LinkedIn, X, Instagram에 최적화된 콘텐츠를 자동 생산합니다.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              무료로 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-11 items-center rounded-md border px-6 text-sm font-medium hover:bg-muted"
            >
              작동 방식 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-b bg-muted/30 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">주요 기능</h2>
          <p className="mt-2 text-center text-muted-foreground">
            콘텐츠 수집에서 발행까지, 전 과정을 AI가 자동화합니다.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-lg border p-6">
                <feature.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold">작동 방식</h2>
          <p className="mt-2 text-center text-muted-foreground">
            4단계로 콘텐츠 자동화를 시작하세요.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">심플한 요금제</h2>
          <p className="mt-2 text-muted-foreground">
            무료로 시작하고, 성장에 맞춰 업그레이드하세요.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { name: "Free", price: "$0", desc: "소스 3개, 월 10회 실행" },
              { name: "Pro", price: "$79", desc: "소스 50개, 월 500회, 자동 승인", popular: true },
              { name: "Team", price: "$199", desc: "무제한 소스, 월 2,000회, 팀 10명" },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-6 ${plan.popular ? "border-primary ring-1 ring-primary" : ""}`}
              >
                <p className="font-semibold">{plan.name}</p>
                <p className="mt-2 text-2xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground">/월</span></p>
                <p className="mt-2 text-xs text-muted-foreground">{plan.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/pricing"
            className="mt-6 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            전체 요금제 보기
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/50 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold">지금 시작하세요</h2>
          <p className="mt-4 text-muted-foreground">
            무료 플랜으로 Content Forge의 모든 핵심 기능을 체험해보세요.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex h-11 items-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            무료로 시작하기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* JSON-LD */}
      <SoftwareApplicationJsonLd />
      <OrganizationJsonLd />
    </>
  );
}
