import Link from "next/link";
import {
  Rss,
  Workflow,
  Send,
  BarChart3,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

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
      "Analyst → Writer → Editor → Formatter 체인으로 원본을 고품질 콘텐츠로 변환합니다.",
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

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 text-center lg:py-32">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            AI가 만드는
            <br />
            <span className="text-primary">콘텐츠 자동화</span> 플랫폼
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            수집부터 발행까지, AI Agent 파이프라인이 당신의 콘텐츠를
            <br className="hidden sm:block" />
            멀티 플랫폼에 최적화된 형태로 자동 생산합니다.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex h-11 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              무료로 시작하기
            </Link>
            <Link
              href="#features"
              className="inline-flex h-11 items-center rounded-md border px-6 text-sm font-medium hover:bg-muted"
            >
              기능 둘러보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t py-20">
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
          </Link>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Content Forge",
            applicationCategory: "BusinessApplication",
            offers: {
              "@type": "AggregateOffer",
              lowPrice: "0",
              highPrice: "199",
              priceCurrency: "USD",
            },
            description:
              "AI Agent 기반 콘텐츠 수집, 가공, 발행 자동화 플랫폼",
          }),
        }}
      />
    </>
  );
}
