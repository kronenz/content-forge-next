import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "Content Forge - AI 콘텐츠 자동화 플랫폼",
    template: "%s | Content Forge",
  },
  description:
    "AI Agent 파이프라인으로 콘텐츠 수집, 가공, 발행을 자동화하세요. RSS, 웹 스크래핑에서 LinkedIn, X, 블로그까지.",
  keywords: [
    "AI 콘텐츠 자동화",
    "콘텐츠 마케팅",
    "AI 블로그",
    "소셜미디어 자동 발행",
    "content automation",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Content Forge",
    title: "Content Forge - AI 콘텐츠 자동화 플랫폼",
    description:
      "수집에서 발행까지, AI Agent 파이프라인이 콘텐츠를 자동 생산합니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Forge - AI 콘텐츠 자동화 플랫폼",
    description:
      "수집에서 발행까지, AI Agent 파이프라인이 콘텐츠를 자동 생산합니다.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
