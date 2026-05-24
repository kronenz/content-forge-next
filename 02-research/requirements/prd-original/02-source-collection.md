# 소스 수집 시스템

## 개요

사용자가 신뢰할 수 있는 정보 소스를 등록하면, 스케줄러가 주기적으로 최신 콘텐츠를 수집합니다. 추가로 Research Agent가 능동적으로 관련 정보를 탐색합니다.

## 소스 유형

### 1. RSS/Atom Feed
- 블로그, 뉴스 사이트, 기술 미디어 등
- 표준화된 포맷으로 안정적 수집
- 예: TechCrunch, Hacker News, 개인 블로그

### 2. Web Scraping
- RSS가 없는 사이트의 구조화된 크롤링
- CSS Selector / XPath 기반 데이터 추출
- 변경 감지 (diff) 기능으로 업데이트만 수집

### 3. API 연동
- Twitter/X API, Reddit API, GitHub Trending 등
- 구조화된 데이터 직접 수신
- Rate limit 관리 내장

### 4. Research Agent (능동적 수집)
- **Claude API**: 특정 주제에 대한 심층 분석 및 정보 수집
- **Exa.ai**: 시맨틱 검색 기반 최신 웹 콘텐츠 수집
- **Tavily**: AI 최적화 검색 API
- **Perplexity API**: 실시간 웹 검색 + 요약
- 사용자가 연구 주제/키워드를 지정하면 자동으로 관련 소스 탐색

### 5. Newsletter / Email
- 이메일 수신 → 파싱 → 콘텐츠 추출
- 주요 뉴스레터 구독 자동화

### 6. 수동 입력
- 사용자가 직접 URL이나 텍스트를 입력
- 북마클릿 / 브라우저 확장 프로그램을 통한 빠른 수집

## 소스 관리 기능

### 소스 등록
```yaml
source:
  name: "TechCrunch AI News"
  type: rss
  url: "https://techcrunch.com/category/artificial-intelligence/feed/"
  schedule: "every 1 hour"
  filters:
    keywords: ["AI", "LLM", "agent"]
    exclude: ["sponsored", "advertisement"]
  processing_prompt: |
    이 기사에서 핵심 기술 트렌드와 비즈니스 임팩트를 추출해주세요.
    한국 시장에 적용 가능한 인사이트를 포함해주세요.
  tags: ["tech", "ai", "trend"]
  priority: high
```

### 핵심 설정 항목
| 항목 | 설명 |
|------|------|
| **schedule** | 수집 주기 (cron 또는 자연어) |
| **filters** | 키워드 필터, 제외 패턴, 날짜 범위 |
| **processing_prompt** | 이 소스에 적용할 AI 가공 지시 프롬프트 |
| **tags** | 분류 태그 |
| **priority** | 처리 우선순위 |
| **language** | 원문 언어 / 목표 언어 |

### 소스 그룹

소스를 주제/목적별 그룹으로 묶어 관리하고, 파이프라인 구성 시 그룹 단위로 소스를 선택할 수 있습니다.

#### 그룹 할당
- 소스 생성/편집 시 그룹명 입력 (자동완성 지원)
- 기존 그룹 목록을 드롭다운으로 표시, 새 그룹명 직접 입력도 가능
- 그룹 미지정 소스는 "기타"로 분류

#### 그룹 관리
- **이름 변경**: 그룹 헤더에서 인라인 편집, 해당 그룹의 모든 소스에 일괄 반영
- **그룹 해제**: 그룹 삭제 시 소스는 유지하고 groupName만 null로 설정

#### 파이프라인 연동
- 파이프라인 템플릿에 소스 연결 시 그룹 단위 선택/해제 지원
- 그룹 체크박스: 전체 선택(체크), 부분 선택(indeterminate), 미선택 3상태
- 소스 개별 선택도 병행 가능

#### 예시 그룹 구성
```
"AI 트렌드" 그룹 → TechCrunch AI, Hacker News, AI Blog
"마케팅 인사이트" 그룹 → Marketing Brew, HubSpot Blog
"경쟁사 모니터링" 그룹 → Competitor RSS, Industry News
```

## 수집 데이터 처리

### 중복 감지
- 콘텐츠 해시 기반 정확한 중복 제거
- 유사도 임베딩 기반 유사 콘텐츠 감지 (Vector DB)
- 동일 주제 다른 소스의 경우 → 병합 후 파이프라인 진입

### 메타데이터 추출
- 제목, 본문, 작성자, 발행일
- 이미지, 링크, 인용문
- 카테고리, 태그 (자동 분류)

### 수집 상태 모니터링
```
소스별 대시보드:
- 마지막 수집 시간
- 수집 성공/실패 횟수
- 수집된 콘텐츠 수 (일/주/월)
- 소스 건강도 (응답 시간, 에러율)
```

## Research Agent 상세

### 작동 방식
1. 사용자가 연구 주제/질문을 등록
2. Research Agent가 여러 검색 서비스를 조합하여 정보 수집
3. 수집된 정보를 구조화하여 Raw Content로 저장
4. 출처(source attribution)를 명확히 기록

### 연구 모드
- **트렌드 추적**: 특정 키워드/주제의 최신 동향을 주기적으로 수집
- **심층 리서치**: 특정 질문에 대한 깊이 있는 조사 (일회성)
- **경쟁사 모니터링**: 특정 회사/제품의 뉴스 및 업데이트 추적
- **여론 분석**: 특정 주제에 대한 소셜 미디어 반응 수집

### Research Agent 파이프라인
```
[주제/질문] → [검색 전략 수립] → [다중 소스 검색] → [결과 종합] → [품질 필터링] → [Raw Content]
                  ↓                    ↓
             Exa.ai 쿼리          Claude 분석
             Tavily 검색          출처 검증
             Perplexity 요약
```
