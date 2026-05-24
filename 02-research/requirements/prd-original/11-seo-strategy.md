# SEO 풀스택 전략

## 두 가지 SEO 축

Content Forge에서 SEO는 이중 구조입니다:

| 축 | 대상 | 목적 |
|---|------|------|
| **Platform SEO** | Content Forge 웹사이트 자체 | 서비스 유입, 가입 전환 |
| **Content SEO** | 사용자가 발행하는 콘텐츠 | 사용자 콘텐츠의 검색 노출 극대화 |

---

## Part 1: Platform SEO (Content Forge 자체)

### 1.1 기술적 SEO (Technical SEO)

#### Next.js App Router 기반 렌더링 전략

```
페이지별 렌더링 전략:

┌──────────────────────┬───────────────┬────────────────────────────┐
│ 페이지               │ 렌더링 방식    │ 이유                        │
├──────────────────────┼───────────────┼────────────────────────────┤
│ 랜딩 (/)             │ SSG           │ 정적, 빠른 로딩, 크롤링 최적 │
│ 블로그 (/blog/*)     │ ISR (60s)     │ 자주 업데이트 + SEO 필수    │
│ 문서 (/docs/*)       │ SSG           │ 정적 콘텐츠                 │
│ 가격 (/pricing)      │ SSG           │ 정적, 전환 페이지           │
│ 대시보드 (/app/*)    │ CSR (인증 후)  │ 동적 데이터, SEO 불필요     │
│ 사용자 블로그 (*.*)  │ ISR (300s)    │ SEO 필수 + 동적 콘텐츠     │
│ 사용자 프로필        │ ISR (3600s)   │ 공개 페이지, SEO 필요       │
└──────────────────────┴───────────────┴────────────────────────────┘
```

#### Metadata API 활용

```typescript
// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)

  return {
    title: `${post.title} | Content Forge Blog`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [{
        url: post.ogImage,
        width: 1200,
        height: 630,
        alt: post.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.ogImage],
    },
    alternates: {
      canonical: `https://contentforge.io/blog/${params.slug}`,
      languages: {
        'ko': `https://contentforge.io/ko/blog/${params.slug}`,
        'en': `https://contentforge.io/en/blog/${params.slug}`,
      },
    },
  }
}
```

#### Sitemap & Robots

```typescript
// src/app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublishedPosts()
  const userBlogs = await getAllPublicUserPosts()

  return [
    // 정적 페이지
    { url: 'https://contentforge.io', changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://contentforge.io/pricing', changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://contentforge.io/blog', changeFrequency: 'daily', priority: 0.9 },

    // 블로그 포스트
    ...posts.map(post => ({
      url: `https://contentforge.io/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),

    // 사용자 공개 블로그 (플랫폼 SEO에 기여)
    ...userBlogs.map(post => ({
      url: `https://contentforge.io/p/${post.author}/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}

// src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/api/', '/auth/'],
      },
    ],
    sitemap: 'https://contentforge.io/sitemap.xml',
  }
}
```

#### 구조화된 데이터 (JSON-LD)

```typescript
// src/components/seo/structured-data.tsx
export function ArticleJsonLd({ post }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.ogImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author,
      url: post.authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Content Forge',
      logo: {
        '@type': 'ImageObject',
        url: 'https://contentforge.io/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.canonicalUrl,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

// SaaS 제품 구조화 데이터
export function SoftwareApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Content Forge',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '199',
      priceCurrency: 'USD',
      offerCount: 4,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  }
}

// FAQ 구조화 데이터 (가격 페이지 등)
export function FAQJsonLd({ faqs }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
```

#### Core Web Vitals 최적화

```
┌────────────────────────────────────────────────────┐
│ Core Web Vitals 타겟                                │
│                                                     │
│ LCP (Largest Contentful Paint)   < 2.5s   ████▓    │
│ FID (First Input Delay)         < 100ms   █████    │
│ CLS (Cumulative Layout Shift)   < 0.1     █████    │
│ INP (Interaction to Next Paint) < 200ms   ████▓    │
└────────────────────────────────────────────────────┘
```

**최적화 전략:**

| 항목 | 방법 |
|------|------|
| **이미지** | next/image 자동 최적화, WebP/AVIF, lazy loading, priority for hero |
| **폰트** | next/font (셀프호스팅), font-display: swap, 서브셋 |
| **번들** | 동적 import, tree shaking, 대시보드 코드 분리 |
| **CSS** | Tailwind purge, critical CSS 인라인 |
| **캐싱** | ISR + CDN (Vercel Edge), stale-while-revalidate |
| **프리페칭** | next/link prefetch, 예측 프리페칭 |

### 1.2 URL 구조 설계

```
contentforge.io/                           # 랜딩
contentforge.io/pricing                    # 가격
contentforge.io/blog                       # 공식 블로그 목록
contentforge.io/blog/ai-content-strategy   # 블로그 포스트
contentforge.io/docs                       # 문서
contentforge.io/docs/getting-started       # 문서 페이지
contentforge.io/changelog                  # 변경 이력
contentforge.io/templates                  # 템플릿 갤러리

# 사용자 공개 콘텐츠 (플랫폼 SEO 기여)
contentforge.io/p/{username}               # 사용자 프로필/블로그
contentforge.io/p/{username}/{post-slug}   # 사용자 포스트

# 대시보드 (SEO 불필요)
contentforge.io/app/dashboard
contentforge.io/app/sources
contentforge.io/app/pipeline
...
```

**핵심**: 사용자가 Content Forge로 발행한 자체 블로그 콘텐츠가 `/p/` 경로로 공개되면, 이 UGC가 플랫폼 전체의 SEO 파워를 높이는 플라이휠 효과.

### 1.3 콘텐츠 마케팅 SEO

#### 키워드 전략

```
Tier 1 (핵심 키워드 - 전환 목적):
├── "AI 콘텐츠 자동화"
├── "콘텐츠 마케팅 자동화 도구"
├── "AI 블로그 글쓰기"
├── "소셜미디어 자동 발행"
└── "content automation platform"

Tier 2 (정보성 키워드 - 유입 목적):
├── "LinkedIn 글쓰기 팁"
├── "블로그 SEO 최적화 방법"
├── "AI로 글 쓰는 법"
├── "콘텐츠 마케팅 전략"
└── "개인 브랜딩 방법"

Tier 3 (롱테일 키워드 - 니치 유입):
├── "AI가 쓴 글 사람처럼 보이게 하는 법"
├── "LinkedIn 팔로워 늘리는 콘텐츠 전략"
├── "RSS 피드 기반 콘텐츠 큐레이션"
└── "여러 블로그 플랫폼 동시 발행"
```

#### 콘텐츠 허브 구조 (Topic Cluster)

```
                    ┌──────────────────┐
                    │  Pillar Page     │
                    │  "AI 콘텐츠      │
                    │   마케팅 완벽가이드"│
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────┴────┐        ┌────┴────┐        ┌────┴────┐
    │ Cluster │        │ Cluster │        │ Cluster │
    │ "AI 글  │        │"소셜미디│        │"SEO와   │
    │  쓰기"  │        │어 자동화"│       │ AI"     │
    └────┬────┘        └────┬────┘        └────┬────┘
         │                   │                   │
    ┌────┴────┐        ┌────┴────┐        ┌────┴────┐
    │ 세부    │        │ 세부    │        │ 세부    │
    │ 포스트들 │       │ 포스트들 │       │ 포스트들 │
    └─────────┘        └─────────┘        └─────────┘

Pillar → Cluster 간 내부 링크로 토픽 권위 구축
```

### 1.4 내부 링크 자동화

```typescript
// AI Agent가 콘텐츠 작성 시 자동으로 내부 링크 삽입

// 내부 링크 추천 로직
async function suggestInternalLinks(content: string, allPosts: Post[]) {
  // 1. 현재 콘텐츠에서 키워드 추출
  const keywords = await extractKeywords(content)

  // 2. 관련 포스트 검색 (Vector 유사도)
  const relatedPosts = await findRelatedPosts(keywords, allPosts)

  // 3. 앵커 텍스트 + URL 쌍 생성
  return relatedPosts.map(post => ({
    anchorText: post.bestMatchKeyword,
    url: `/blog/${post.slug}`,
    relevanceScore: post.similarity,
    position: findBestInsertPosition(content, post.bestMatchKeyword),
  }))
}
```

---

## Part 2: Content SEO (사용자 발행 콘텐츠)

### 2.1 SEO Optimizer Agent 확장

기존 `03-ai-agent-pipeline.md`의 SEO Optimizer를 풀스택으로 확장합니다.

#### SEO Agent의 처리 범위

```
┌─────────────────────────────────────────────────────┐
│ SEO Optimizer Agent - 풀스택 처리                     │
│                                                      │
│ ┌─ On-Page SEO ──────────────────────────────────┐  │
│ │ • 타겟 키워드 추출 및 밀도 최적화                │  │
│ │ • 메타 타이틀 (50-60자, 키워드 포함)             │  │
│ │ • 메타 디스크립션 (150-160자, CTA 포함)          │  │
│ │ • URL 슬러그 최적화                              │  │
│ │ • 헤딩 구조 (H1 → H2 → H3 계층)                │  │
│ │ • 이미지 alt 텍스트                              │  │
│ │ • 내부/외부 링크 최적화                          │  │
│ │ • 첫 100단어 내 키워드 배치                      │  │
│ │ • 가독성 점수 (Flesch-Kincaid 한국어 변형)       │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌─ Technical SEO ────────────────────────────────┐  │
│ │ • Canonical URL 설정                             │  │
│ │ • OG / Twitter Card 메타 태그                    │  │
│ │ • JSON-LD 구조화 데이터 생성                     │  │
│ │ • hreflang 태그 (다국어 시)                      │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌─ Content SEO ──────────────────────────────────┐  │
│ │ • 검색 의도 분석 (Informational/Transactional)   │  │
│ │ • 경쟁 콘텐츠 분석 (SERP 상위 결과)              │  │
│ │ • Featured Snippet 최적화 (FAQ, How-to 형식)    │  │
│ │ • People Also Ask 최적화                        │  │
│ │ • 콘텐츠 길이 최적화 (키워드 경쟁도 기반)         │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ┌─ Platform-Specific SEO ────────────────────────┐  │
│ │ • 블로그: Full on-page SEO                       │  │
│ │ • Medium: 태그 최적화, SEO 타이틀                │  │
│ │ • LinkedIn: 프로필 키워드, 해시태그 SEO           │  │
│ │ • YouTube (향후): 제목, 설명, 태그, 챕터          │  │
│ └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

#### SEO Agent 출력 상세

```yaml
seo_report:
  # 키워드 분석
  primary_keyword: "AI 콘텐츠 자동화"
  secondary_keywords: ["콘텐츠 마케팅 AI", "자동 블로그 발행"]
  long_tail_keywords: ["AI로 블로그 글 자동 작성하는 방법"]
  keyword_difficulty: 35  # 0-100
  search_volume: 2400     # 월간 검색량 추정

  # 메타 태그
  meta:
    title: "AI 콘텐츠 자동화 완벽 가이드 (2026) | Content Forge"  # 58자
    description: "AI Agent가 콘텐츠를 수집하고 가공하여 블로그, LinkedIn, X에 자동 발행합니다. 3배 빠른 콘텐츠 생산 비결을 알아보세요."  # 156자
    slug: "ai-content-automation-guide-2026"
    canonical: "https://contentforge.io/blog/ai-content-automation-guide-2026"

  # 구조화 데이터
  structured_data:
    type: "HowToArticle"  # Article, HowTo, FAQ, Review 등
    faq_pairs:  # People Also Ask 대응
      - q: "AI가 쓴 글은 SEO에 불리한가요?"
        a: "아닙니다. 구글은 콘텐츠의 품질과 유용성을 기준으로 평가합니다..."
      - q: "콘텐츠 자동화 도구 비용은 얼마인가요?"
        a: "무료부터 월 $199까지 다양하며..."

  # On-Page 분석
  on_page:
    heading_structure:
      h1: "AI 콘텐츠 자동화 완벽 가이드"
      h2: ["왜 AI 콘텐츠 자동화인가", "핵심 도구 비교", "실전 워크플로우", ...]
      h3: [...]
    keyword_density: 1.8%        # 목표: 1-2%
    first_paragraph_keyword: true
    image_alt_texts: ["AI 콘텐츠 파이프라인 구조도", ...]
    internal_links: 3
    external_links: 5
    word_count: 2400
    readability_score: 72        # 목표: 60-80

  # 최적화 제안
  suggestions:
    - priority: high
      type: "keyword_placement"
      message: "H2 '핵심 도구 비교'에 타겟 키워드 포함 권장"
    - priority: medium
      type: "content_length"
      message: "경쟁 상위 10개 평균 3,200단어. 800단어 추가 권장"
    - priority: low
      type: "internal_link"
      message: "'소셜미디어 자동화' 관련 내부 포스트 링크 추가 가능"

  # SEO 점수
  score:
    overall: 82
    on_page: 85
    technical: 90
    content: 75
    competition: 70
```

### 2.2 키워드 리서치 통합

Research Agent와 SEO Agent를 연동하여 키워드 기반 콘텐츠 기획을 자동화합니다.

```
┌──────────────────────────────────────────────────────────┐
│ 키워드 리서치 → 콘텐츠 기획 → 발행 플로우                  │
│                                                           │
│  [사용자 주제 입력]                                        │
│        │                                                  │
│        ▼                                                  │
│  ┌─────────────┐     ┌──────────────┐                    │
│  │  Research    │────▶│  키워드      │                    │
│  │  Agent       │     │  분석 결과   │                    │
│  │ (Exa.ai +   │     │              │                    │
│  │  SERP분석)  │     │ • 검색량     │                    │
│  └─────────────┘     │ • 경쟁도     │                    │
│                       │ • 연관 키워드 │                    │
│                       │ • SERP 특성  │                    │
│                       └──────┬───────┘                    │
│                              │                            │
│                              ▼                            │
│                 ┌─────────────────────┐                   │
│                 │  콘텐츠 기획 제안     │                   │
│                 │                     │                   │
│                 │ "이 키워드로 이런    │                   │
│                 │  형식의 글을 쓰면    │                   │
│                 │  상위 노출 가능성    │                   │
│                 │  높음"              │                   │
│                 └─────────┬───────────┘                   │
│                           │                               │
│                     [사용자 승인]                           │
│                           │                               │
│                           ▼                               │
│                  [파이프라인 실행]                           │
│                  (SEO 최적화 포함)                          │
└──────────────────────────────────────────────────────────┘
```

### 2.3 SERP 모니터링

발행된 콘텐츠의 검색 순위를 추적합니다.

```yaml
serp_tracking:
  # 추적 항목
  metrics:
    - keyword: "AI 콘텐츠 자동화"
      current_rank: 12
      previous_rank: 18
      trend: "up"
      url: "/blog/ai-content-automation-guide"
      featured_snippet: false
      search_volume: 2400

  # 대시보드 표시
  dashboard:
    - 키워드별 순위 변동 차트
    - 상위 10위 진입 키워드 수
    - 클릭률 (CTR) 추이
    - 검색 유입 트래픽 추이
    - 경쟁 콘텐츠 대비 포지션
```

---

## Part 3: 기술 구현 (Next.js 풀스택)

### 3.1 SEO 컴포넌트 아키텍처

```
src/
├── components/
│   └── seo/
│       ├── meta-tags.tsx          # 동적 메타 태그 생성
│       ├── json-ld.tsx            # 구조화 데이터 (Article, FAQ, HowTo, Product)
│       ├── og-image-generator.tsx # 동적 OG 이미지 생성
│       ├── breadcrumb.tsx         # 빵크럼 (구조화 데이터 포함)
│       ├── table-of-contents.tsx  # 자동 ToC 생성 (H2/H3 기반)
│       └── seo-score-badge.tsx    # SEO 점수 뱃지 (검토 UI용)
│
├── server/
│   ├── agents/
│   │   └── seo.ts                # SEO Optimizer Agent
│   └── services/
│       ├── keyword-research.ts   # 키워드 리서치 서비스
│       ├── serp-tracker.ts       # SERP 순위 추적
│       └── sitemap-generator.ts  # 동적 사이트맵
│
├── app/
│   ├── sitemap.ts                # 동적 sitemap.xml
│   ├── robots.ts                 # robots.txt
│   ├── manifest.ts               # PWA manifest
│   ├── blog/
│   │   └── [slug]/
│   │       ├── page.tsx          # ISR + Full SEO
│   │       └── opengraph-image.tsx  # 동적 OG 이미지
│   └── p/[username]/[slug]/
│       ├── page.tsx              # 사용자 블로그 (ISR)
│       └── opengraph-image.tsx
```

### 3.2 동적 OG 이미지 생성 (next/og)

```typescript
// src/app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }) {
  const post = await getPost(params.slug)

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        width: '100%',
        height: '100%',
        fontFamily: 'Pretendard',
      }}>
        {/* 로고 */}
        <div style={{ color: '#3b82f6', fontSize: 24, marginBottom: 20 }}>
          Content Forge
        </div>
        {/* 제목 */}
        <div style={{ color: '#f8fafc', fontSize: 48, fontWeight: 700, lineHeight: 1.3 }}>
          {post.title}
        </div>
        {/* 메타 */}
        <div style={{ color: '#94a3b8', fontSize: 20, marginTop: 30 }}>
          {post.author} · {post.readTime} · {post.date}
        </div>
      </div>
    ),
    { ...size }
  )
}
```

### 3.3 자체 블로그 SEO 최적화 렌더링

```typescript
// src/app/p/[username]/[slug]/page.tsx
// 사용자가 Content Forge로 발행한 자체 블로그의 SEO 최적화

export async function generateStaticParams() {
  // 인기 포스트는 빌드 타임에 사전 생성
  const popularPosts = await getPopularPosts(100)
  return popularPosts.map(post => ({
    username: post.author.username,
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getUserPost(params.username, params.slug)
  const seoData = post.seoReport  // SEO Agent가 생성한 데이터

  return {
    title: seoData.meta.title,
    description: seoData.meta.description,
    keywords: [seoData.primary_keyword, ...seoData.secondary_keywords],
    alternates: {
      canonical: seoData.meta.canonical,
    },
    openGraph: {
      type: 'article',
      title: seoData.meta.title,
      description: seoData.meta.description,
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  }
}

export default async function UserPostPage({ params }) {
  const post = await getUserPost(params.username, params.slug)

  return (
    <article>
      <ArticleJsonLd post={post} />
      {post.seoReport.structured_data.faq_pairs && (
        <FAQJsonLd faqs={post.seoReport.structured_data.faq_pairs} />
      )}
      <Breadcrumb items={[
        { name: 'Home', url: '/' },
        { name: post.author.name, url: `/p/${params.username}` },
        { name: post.title, url: `/p/${params.username}/${params.slug}` },
      ]} />
      <h1>{post.title}</h1>
      <TableOfContents content={post.body} />
      <PostBody content={post.body} />
      <RelatedPosts posts={post.relatedPosts} />
    </article>
  )
}
```

### 3.4 성능 최적화 체크리스트

```typescript
// next.config.ts
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일
  },
  experimental: {
    optimizeCss: true,      // CSS 최적화
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        // 보안 헤더 (SEO에도 간접 영향)
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
    {
      source: '/blog/:path*',
      headers: [
        // 블로그 캐싱
        { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=300' },
      ],
    },
  ],
}
```

---

## Part 4: SEO 대시보드 (검토 UI 통합)

### 콘텐츠 검토 시 SEO 스코어카드

기존 검토 화면(`06-quality-review.md`)에 SEO 탭 추가:

```
┌────────────────────────────────────────────────────────┐
│  콘텐츠 검토 > SEO 분석                                  │
│                                                        │
│  ┌─ SEO 종합 점수 ──────────┐  ┌─ 키워드 분석 ────────┐ │
│  │                          │  │                      │ │
│  │    82 / 100              │  │ 타겟: "AI 콘텐츠 자동화"│ │
│  │    ████████▒▒            │  │ 검색량: 2,400/월     │ │
│  │                          │  │ 경쟁도: 35/100 (낮음) │ │
│  │  On-Page   85  █████▓    │  │ 밀도: 1.8% ✓         │ │
│  │  Technical 90  ██████    │  │                      │ │
│  │  Content   75  ████▒▒    │  │ 연관 키워드:          │ │
│  │  Competition 70 ████▒    │  │ • 콘텐츠 마케팅 AI    │ │
│  │                          │  │ • 자동 블로그 발행    │ │
│  └──────────────────────────┘  └──────────────────────┘ │
│                                                        │
│  ┌─ 체크리스트 ────────────────────────────────────────┐ │
│  │ ✅ 메타 타이틀에 키워드 포함 (58자)                  │ │
│  │ ✅ 메타 디스크립션 적정 길이 (156자)                  │ │
│  │ ✅ H1 태그에 키워드 포함                              │ │
│  │ ✅ 첫 100단어 내 키워드 배치                          │ │
│  │ ✅ 이미지 alt 텍스트 설정                             │ │
│  │ ⚠️  내부 링크 2개 (권장: 3-5개)                      │ │
│  │ ⚠️  콘텐츠 길이 2,400단어 (경쟁 평균: 3,200)         │ │
│  │ ✅ 구조화 데이터 (Article + FAQ)                      │ │
│  │ ✅ Canonical URL 설정                                │ │
│  │ ❌ Featured Snippet 최적화 미흡                      │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─ SERP 프리뷰 ──────────────────────────────────────┐ │
│  │                                                    │ │
│  │  AI 콘텐츠 자동화 완벽 가이드 (2026) | Content ...  │ │
│  │  https://contentforge.io › blog › ai-content-au... │ │
│  │  AI Agent가 콘텐츠를 수집하고 가공하여 블로그,       │ │
│  │  LinkedIn, X에 자동 발행합니다. 3배 빠른 콘텐츠...   │ │
│  │                                                    │ │
│  │  [Google] [Naver] [Bing]                           │ │
│  └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### SERP 프리뷰

검색 결과에서 어떻게 보이는지 미리보기:
- **Google 검색 결과** 형태
- **Naver 검색 결과** 형태 (한국 시장)
- 메타 타이틀 잘림 여부 확인
- 메타 디스크립션 잘림 여부 확인
- 리치 스니펫 (FAQ, How-to) 프리뷰

---

## Part 5: SEO 기술 스택 추가사항

기존 `09-tech-stack.md`에 추가할 SEO 관련 도구:

| 구분 | 기술 | 용도 |
|------|------|------|
| **SERP 데이터** | SerpAPI / DataForSEO | 검색 순위 추적, 경쟁 분석 |
| **키워드 리서치** | Exa.ai + Claude 분석 | 키워드 발굴, 검색 의도 분석 |
| **성능 모니터링** | Google Search Console API | 실제 검색 성과 데이터 |
| **Web Analytics** | PostHog / Plausible | 트래픽 분석 (프라이버시 친화) |
| **OG 이미지** | next/og (Vercel OG) | Edge에서 동적 OG 이미지 생성 |
| **사이트 감사** | Lighthouse CI | 빌드 시 SEO/성능 자동 점검 |

### CI/CD SEO 자동 검증

```yaml
# .github/workflows/seo-check.yml
- name: Lighthouse CI
  run: |
    lhci autorun
  env:
    LHCI_BUILD_CONTEXT__CURRENT_HASH: ${{ github.sha }}

# Lighthouse 기준:
# Performance: > 90
# SEO: > 95
# Accessibility: > 90
# Best Practices: > 90
```
