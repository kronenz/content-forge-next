import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Content Forge - AI 콘텐츠 자동화 플랫폼",
  description:
    "AI Agent 파이프라인으로 콘텐츠 수집, 가공, 발행을 자동화하세요. RSS, 웹 스크래핑에서 LinkedIn, X, 블로그까지.",
  openGraph: {
    title: "Content Forge - AI 콘텐츠 자동화 플랫폼",
    description:
      "AI Agent 파이프라인으로 콘텐츠 수집, 가공, 발행을 자동화하세요.",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              CF
            </div>
            <span className="font-semibold">Content Forge</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/#features"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              기능
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              가격
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              무료로 시작
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="font-semibold">Content Forge</p>
              <p className="mt-1 text-sm text-muted-foreground">
                AI 기반 콘텐츠 자동화 플랫폼
              </p>
            </div>
            <div>
              <p className="font-medium text-sm">제품</p>
              <div className="mt-2 flex flex-col gap-1">
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground">기능</Link>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">가격</Link>
              </div>
            </div>
            <div>
              <p className="font-medium text-sm">법적 고지</p>
              <div className="mt-2 flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">이용약관</span>
                <span className="text-sm text-muted-foreground">개인정보처리방침</span>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Content Forge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
