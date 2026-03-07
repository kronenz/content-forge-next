# 콘텐츠 발행 시스템

## 개요

가공이 완료되고 검토를 통과한 콘텐츠를 각 플랫폼에 최적화된 형태로 발행합니다.

## 지원 플랫폼

### 텍스트 기반 지식 공유 플랫폼

| 플랫폼 | 연동 방식 | 주요 포맷 |
|--------|----------|----------|
| **자체 블로그** | 직접 발행 (내장) | Markdown/HTML, 자유 레이아웃 |
| **Medium** | API | Rich text, 이미지, 코드 블록 |
| **Hashnode** | API | Markdown, 시리즈, 태그 |
| **DEV.to** | API | Markdown, 프론트매터 |
| **Tistory** | Open API | HTML, 카테고리 |
| **Velog** | 비공식 API | Markdown, 시리즈 |
| **Brunch** | 수동/반자동 | 에디터 포맷 |
| **Substack** | API | 뉴스레터 포맷 |
| **Ghost** | Admin API | Rich editor 포맷 |
| **WordPress** | REST API | HTML/블록 에디터 |
| **Notion** | API | 블록 기반 |

### 숏폼 / 소셜 미디어 플랫폼

| 플랫폼 | 연동 방식 | 주요 포맷 |
|--------|----------|----------|
| **LinkedIn** | API | 텍스트 (3,000자) + 이미지/문서 |
| **X (Twitter)** | API v2 | 트윗 (280자) + 스레드 + 이미지 |
| **Threads** | API | 텍스트 (500자) + 이미지 |
| **Instagram** | Graph API | 이미지/캐러셀 + 캡션 |
| **Facebook** | Graph API | 텍스트 + 이미지/링크 |
| **Bluesky** | AT Protocol | 텍스트 (300자) + 이미지 |

### 기타

| 플랫폼 | 용도 |
|--------|------|
| **Email Newsletter** | 구독자 발송 |
| **Slack / Discord** | 팀 내부 공유 |
| **Telegram** | 채널 발행 |

## 발행 워크플로우

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ 검토완료  │────▶│ 발행예약  │────▶│   발행   │────▶│  추적    │
│          │     │          │     │          │     │          │
│ Approved │     │ Scheduled│     │ Published│     │ Tracking │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      │                                  │
                 ┌────┴────┐                        ┌────┴────┐
                 │ 즉시발행 │                        │ 성과수집 │
                 │ 예약발행 │                        │ 분석     │
                 │ 최적시간 │                        └─────────┘
                 └─────────┘
```

### 발행 옵션

#### 1. 즉시 발행
- 검토 승인 후 바로 발행

#### 2. 예약 발행
- 특정 날짜/시간 지정
- 반복 발행 스케줄 (매주 월요일 오전 9시 등)

#### 3. 최적 시간 발행
- 플랫폼별 최적 발행 시간 자동 추천
- 과거 발행 성과 데이터 기반 학습
- 타겟 오디언스 활동 시간대 분석

#### 4. 크로스 포스팅 전략
- 플랫폼 간 발행 시차 설정 (예: 블로그 → 2시간 후 LinkedIn → 1시간 후 X)
- 캐니발라이제이션 방지를 위한 간격 조절
- 각 플랫폼 우선순위 설정

## 플랫폼별 최적화

### 자체 블로그
```yaml
blog_config:
  template: "article"  # article, tutorial, review, listicle
  seo:
    meta_title: "..."
    meta_description: "..."
    og_image: "..."
    canonical_url: "..."
  features:
    table_of_contents: true
    reading_time: true
    related_posts: true
    social_share_buttons: true
  custom_domain: "blog.contentforge.io"
```

### LinkedIn
```yaml
linkedin_config:
  post_type: "text"  # text, article, document, poll
  formatting:
    use_line_breaks: true
    emoji_style: "minimal"  # none, minimal, moderate
    hashtag_count: 3-5
    hook_style: "question"  # question, statistic, bold_statement
  engagement:
    ask_question: true  # 마지막에 질문으로 끝내기
    call_to_action: "comment"
  scheduling:
    best_times: ["화 09:00", "수 08:00", "목 12:00"]
```

### X (Twitter)
```yaml
twitter_config:
  format: "thread"  # single, thread
  thread_style:
    hook_tweet: "강력한 첫 트윗"
    thread_length: 5-8
    closer: "요약 + CTA"
    numbering: true  # "1/7" 형식
  media:
    attach_image: true
    image_position: "first_tweet"
  engagement:
    retweet_prompt: true
    poll_option: false
```

### Instagram
```yaml
instagram_config:
  post_type: "carousel"  # single, carousel, reel_cover
  carousel:
    slide_count: 5-10
    style: "educational"  # educational, quote, infographic
    brand_colors: ["#1a1a2e", "#16213e", "#0f3460"]
  caption:
    length: "medium"  # short, medium, long
    cta: "저장하고 나중에 다시 보세요"
    hashtag_count: 15-20
    hashtag_placement: "comment"  # inline, end, comment
```

## 발행 후 추적

### 수집 가능한 메트릭

| 메트릭 | 블로그 | LinkedIn | X | Instagram |
|--------|--------|----------|---|-----------|
| 조회수/노출 | O | O | O | O |
| 좋아요/반응 | O | O | O | O |
| 댓글 | O | O | O | O |
| 공유/리포스트 | O | O | O | - |
| 클릭률 | O | O | O | O |
| 저장 | - | O | O | O |
| 팔로워 증가 | - | O | O | O |

### 성과 분석 대시보드
- 플랫폼별 성과 비교
- 콘텐츠 유형별 성과 분석
- 시간대별 최적 발행 시간 학습
- ROI 분석 (투입 비용 vs 도달/전환)

## 발행 안전장치

### 실패 처리
- API 실패 시 자동 재시도 (exponential backoff)
- 재시도 횟수 초과 시 사용자 알림
- 부분 실패 처리 (일부 플랫폼만 성공한 경우)

### 롤백
- 발행 취소 (플랫폼 API 지원 시)
- 수정 후 재발행
- 발행 이력 관리

### Rate Limit 관리
- 플랫폼별 API 호출 제한 준수
- 큐 기반 순차 발행
- 일일/시간별 발행 횟수 제한
