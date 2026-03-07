# AI Agent 파이프라인 (편집국 구조)

## 개요

Content Forge의 핵심은 콘텐츠 발행사의 편집국처럼 역할이 분담된 AI Agent들이 파이프라인을 통해 순차적으로 콘텐츠를 가공하는 것입니다. 각 Agent는 명확한 역할과 책임을 가지며, 단계별 산출물이 투명하게 기록됩니다.

## 편집국 Agent 구조

```
┌─────────────────────────────────────────────────────────────┐
│                    Content Forge 편집국                       │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │ Analyst  │──▶│  Writer  │──▶│  Editor  │──▶│ Designer │ │
│  │ (분석관) │   │  (기자)  │   │ (편집자) │   │(디자이너)│ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
│       │              │              │              │         │
│       ▼              ▼              ▼              ▼         │
│  [분석 리포트]   [초안 콘텐츠]  [교정 콘텐츠]  [최종 에셋]   │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────────┐            │
│  │   SEO    │   │   Fact   │   │  Compliance  │            │
│  │Optimizer │   │ Checker  │   │   Officer    │            │
│  │(SEO전문) │   │(팩트체커)│   │ (준법감시인) │            │
│  └──────────┘   └──────────┘   └──────────────┘            │
│                                                              │
│  ┌──────────────┐   ┌──────────────┐                        │
│  │  Localizer   │   │   Platform   │                        │
│  │  (현지화)    │   │  Formatter   │                        │
│  │              │   │ (포맷 변환)  │                        │
│  └──────────────┘   └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Agent 역할 상세

### 1. Analyst (분석관)
**역할**: 수집된 원본 콘텐츠를 분석하여 핵심 인사이트 추출

**입력**: Raw Content (수집된 원본)
**출력**: Analysis Report

```yaml
analysis_report:
  summary: "핵심 요약 (2-3문장)"
  key_insights:
    - insight: "주요 인사이트 1"
      importance: high
      evidence: "근거가 되는 원문 인용"
    - insight: "주요 인사이트 2"
      importance: medium
  topics: ["AI", "자동화", "생산성"]
  sentiment: positive
  target_audience: "tech-savvy professionals"
  content_potential:  # 콘텐츠화 가능성 평가
    blog_post: high
    social_media: medium
    newsletter: high
  recommended_angle: "실무 적용 관점에서 해석"
  related_contexts: ["이전 트렌드와의 연결점"]
```

### 2. Writer (기자/작가)
**역할**: 분석 결과를 바탕으로 각 플랫폼별 콘텐츠 초안 작성

**입력**: Analysis Report + 사용자 processing_prompt + 플랫폼 목표
**출력**: Draft Contents (플랫폼별)

```yaml
drafts:
  blog:
    title: "..."
    body: "..."  # 마크다운
    excerpt: "..."
    estimated_read_time: "5min"
  linkedin:
    text: "..."  # 3000자 이내
    hashtags: ["#AI", "#생산성"]
  twitter:
    thread:
      - "트윗 1 (280자)"
      - "트윗 2"
    single: "단일 트윗 버전"
  instagram:
    caption: "..."
    image_prompt: "이미지 생성을 위한 프롬프트"
    hashtags: ["#ai", "#tech"]
```

### 3. Editor (편집자)
**역할**: 초안의 품질, 톤, 일관성, 정확성 검수 및 교정

**입력**: Draft Contents
**출력**: Edited Contents + Edit Report

```yaml
edit_report:
  changes_made:
    - location: "paragraph 2"
      type: "clarity"
      before: "..."
      after: "..."
      reason: "문장이 모호하여 명확하게 수정"
  quality_scores:
    readability: 8.5
    engagement: 7.0
    accuracy: 9.0
    tone_consistency: 8.0
    platform_fit: 8.5
  suggestions:
    - "도입부에 후크를 더 강하게"
    - "CTA를 구체적으로"
```

### 4. Designer (디자이너)
**역할**: 콘텐츠에 필요한 비주얼 에셋 생성 지시

**입력**: Edited Contents
**출력**: Design Assets / Design Specifications

```yaml
design_specs:
  blog:
    hero_image:
      prompt: "이미지 생성 프롬프트"
      style: "minimal, tech, blue tones"
      dimensions: "1200x630"
    inline_images: []
    infographic: null
  instagram:
    main_image:
      prompt: "..."
      dimensions: "1080x1080"
      text_overlay: "핵심 메시지"
    carousel: []  # 여러 장일 경우
  twitter:
    card_image:
      prompt: "..."
      dimensions: "1200x675"
  og_image:
    prompt: "..."
    dimensions: "1200x630"
```

### 5. SEO Optimizer (SEO 전문가)
**역할**: 블로그 등 텍스트 콘텐츠의 검색 최적화

**입력**: Edited Content (blog)
**출력**: SEO-optimized Content + SEO Report

```yaml
seo_report:
  target_keywords: ["AI 자동화", "콘텐츠 마케팅"]
  meta_title: "..."
  meta_description: "..."
  slug: "ai-content-automation-guide"
  heading_structure: ["H1", "H2", "H2", "H3"]
  internal_links_suggested: []
  readability_score: 75
  keyword_density: 2.1%
```

### 6. Fact Checker (팩트체커)
**역할**: 콘텐츠 내 사실 관계 검증

**입력**: Edited Contents + 원본 소스
**출력**: Fact Check Report

```yaml
fact_check_report:
  verified_claims:
    - claim: "GPT-4는 2023년 3월에 출시되었다"
      status: verified
      source: "https://openai.com/..."
  unverified_claims:
    - claim: "시장 규모가 10조원이다"
      status: unverified
      suggestion: "출처 확인 필요"
  potential_issues:
    - "통계 수치의 출처가 불명확"
  overall_reliability: 0.85
```

### 7. Compliance Officer (준법감시인)
**역할**: 저작권, 인용 규정, 플랫폼 정책 준수 확인

**입력**: Final Contents + 원본 소스
**출력**: Compliance Report

```yaml
compliance_report:
  copyright_check:
    - content: "인용된 텍스트"
      status: "fair_use"
      recommendation: "출처 표기 필요"
  platform_policy:
    - platform: "instagram"
      issues: []
    - platform: "linkedin"
      issues: ["외부 링크 포함 시 도달률 감소 주의"]
  disclosure_needed: false
  overall_status: "pass"
```

### 8. Localizer (현지화 전문가)
**역할**: 콘텐츠의 문화적/언어적 현지화

**입력**: Contents + 목표 시장/언어
**출력**: Localized Contents

- 단순 번역이 아닌 문화적 맥락 반영
- 현지 트렌드, 사례, 표현 적용
- 로컬 해시태그, 키워드 최적화

### 9. Platform Formatter (포맷 변환기)
**역할**: 최종 콘텐츠를 각 플랫폼의 정확한 포맷으로 변환

**입력**: All processed contents
**출력**: Platform-ready formatted contents

- 글자 수 제한 적용
- 이모지, 줄바꿈, 해시태그 포맷팅
- 미디어 첨부 형식 맞춤
- 링크 처리 (단축 URL, UTM 파라미터)

## 파이프라인 구성

### 기본 파이프라인 (Full Pipeline)
```
Analyst → Writer → Editor → Fact Checker → SEO Optimizer → Designer → Compliance → Platform Formatter
```

### 간소화 파이프라인 (Quick Pipeline)
```
Analyst → Writer → Editor → Platform Formatter
```

### 커스텀 파이프라인
사용자가 필요한 Agent만 선택하여 파이프라인 구성 가능

```yaml
custom_pipeline:
  name: "LinkedIn 전용 빠른 발행"
  steps:
    - agent: analyst
      config: { depth: "shallow" }
    - agent: writer
      config: { platforms: ["linkedin"], tone: "professional" }
    - agent: editor
      config: { focus: ["tone", "engagement"] }
    - agent: platform_formatter
      config: { platform: "linkedin" }
```

## 파이프라인 모니터링

### 실시간 진행 상태
```
Pipeline Run #1234
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Analyst]  ████████████ Done (12s)
  → 3 key insights extracted
  → Recommended: blog + linkedin

[Writer]   ████████████ Done (28s)
  → Blog draft: 1,200 words
  → LinkedIn: 450 chars

[Editor]   ██████░░░░░░ In Progress (15s)
  → 4 edits applied so far
  → Quality: 8.2/10 (preliminary)

[Designer]  ░░░░░░░░░░░░ Waiting
[Formatter] ░░░░░░░░░░░░ Waiting

Total elapsed: 55s | Est. remaining: 45s
```

### 중간 데이터 열람
각 단계의 입력/출력을 diff 형태로 확인 가능
- 어떤 분석이 이루어졌는지
- 초안에서 편집본으로 무엇이 변경되었는지
- 팩트체크에서 어떤 주장이 검증되었는지

### 파이프라인 통계
- 평균 처리 시간 (단계별)
- 성공/실패율
- 토큰 사용량 및 비용
- 품질 점수 추이
