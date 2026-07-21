# 해도돼? (Can I Do It?)

한국인 여행자가 현지에서 모르고 저지르기 쉬운 실수(불법 행동·시설 규칙·문화적 금기·일반 매너)를 중요도순으로 알려주는 웹 서비스입니다.

## 기술 스택

- **Next.js 16** (App Router, Turbopack)
- **React 19** / **TypeScript**
- **Tailwind CSS 3**
- **lucide-react** (아이콘)

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 서버
```

## 품질 검증

Pull Request와 `main` 푸시에서는 GitHub Actions가 아래 순서로 검증합니다.

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

로컬에서는 `npm run check`로 lint, typecheck, test를 한 번에 실행할 수 있습니다. 데이터베이스 마이그레이션은 빌드와 분리되어 있으며 배포 단계에서 `npm run deploy:migrate`를 한 번 실행합니다.

운영 상태 확인 경로는 `/api/health`입니다. 데이터베이스 연결까지 성공하면 HTTP 200과 `status: "ok"`를 반환합니다.

## NVIDIA NIM 검색과 콘텐츠 수집

서버 환경변수에 `NVIDIA_API_KEY`를 설정하면 `/search`에서 NVIDIA NIM이 질문의 국가·도시·행동을 구조화하고, 검증된 Warning만 근거로 답변합니다. 키가 없거나 호출이 실패하면 동일 API가 로컬 검색으로 안전하게 폴백합니다.

```bash
NVIDIA_SEARCH_MODEL=qwen/qwen3.5-397b-a17b
NVIDIA_EXTRACTION_MODEL=nvidia/nemotron-3-super-120b-a12b
NVIDIA_EMBEDDING_MODEL=nvidia/llama-nemotron-embed-1b-v2
NVIDIA_RERANK_MODEL=nvidia/llama-nemotron-rerank-1b-v2
```

공식 출처 파이프라인은 등록된 `OfficialSource`만 수집합니다.

```bash
npm run content:source:add -- AU "Australian Border Force" customs en https://www.abf.gov.au/...
npm run content:collect -- https://official.example/page
npm run content:draft -- <snapshot-id>
npm run content:audit
npm run content:audit:apply
```

`content:source:add`는 국가 코드, 기관명, 출처 유형, 언어, HTTPS URL을 `OfficialSource`에 등록합니다. `content:collect`는 등록된 URL만 요청해 HTML에서 본문을 추출하고 SHA-256 해시를 저장합니다. 이전 스냅샷과 해시가 달라진 문서만 변경으로 표시됩니다.

`content:draft`는 NVIDIA 추출 모델로 규정 후보를 구조화합니다. AI가 제시한 근거 문장이 수집 원문에 실제 존재하는 경우에만 `REVIEWING` 초안으로 저장되며 자동 공개하지 않습니다. 검수자가 출처, 적용 범위, 표현을 확인한 뒤에만 `VERIFIED` 상태로 공개합니다.

`content:audit`는 현재 Warning 출처 전체를 검사해 잘못된 URL, HTTP 링크, 공식 도메인으로 확인되지 않은 링크, 180일 이상 지난 확인일을 JSON 리포트로 출력합니다. 도메인 휴리스틱은 보조 신호이며, 최종 공식성 판단은 기관 페이지와 담당자가 검수해야 합니다.

`content:audit:apply`는 URL이 없는 `VERIFIED` 항목을 `REVIEWING`으로 내리고, 유효한 출처가 있어도 확인일이 모두 180일 이상 지난 항목을 `STALE`로 표시합니다. 자동 실행 전에는 반드시 `content:audit` 결과를 먼저 검토해야 합니다.

서비스 화면의 `/transparency`에서도 이 파이프라인과 공개 기준을 확인할 수 있습니다.

외부 크롤링 엔진 비교와 운영 원칙은 [`docs/crawling-architecture.md`](docs/crawling-architecture.md)에 정리되어 있습니다. 기본값은 `direct-fetch`이며, 동적 공식 페이지는 `CRAWLER_PROVIDER=firecrawl`로 선택할 수 있습니다. 크롤링은 Vercel 요청 안에서 실행하지 않고 CLI·스케줄 워커·외부 플랫폼에서 실행합니다.

기존 Seed 전환 과정에서 생긴 동일 국가·도시·제목 중복은 다음 명령으로 안정 키 레코드에 병합합니다.

```bash
npm run db:dedupe
```

## 아키텍처 — Feature-Sliced Design (FSD)

Next.js App Router의 `pages` 개념과 충돌을 피하기 위해 FSD의 `pages` 레이어는 `views`로 대체했습니다.
레이어는 위 → 아래로만 의존합니다 (`app → views → widgets → features → entities → shared`).

```
src/
├─ app/                     # Next.js 라우팅 + 전역 스타일 (FSD app layer)
│  ├─ layout.tsx
│  ├─ page.tsx              # HomePage 렌더
│  └─ globals.css           # 폰트/CSS 변수/Tailwind
│
├─ views/                   # 화면 조립 (FSD pages)
│  └─ home/                 # 상태 오케스트레이션 (검색·저장·모달·토스트)
│
├─ widgets/                 # 독립적인 큰 UI 블록
│  ├─ hero/                 # 비디오 배경 + 네비 + 헤드라인 + 검색 카드
│  ├─ warning-results/      # 결과 섹션 전체 (필터 상태 소유)
│  ├─ warning-detail/       # 주의사항 상세 모달
│  └─ footer/
│
├─ features/                # 사용자 상호작용 단위
│  ├─ destination-search/   # 나라·도시 검색 카드
│  ├─ warning-filter/       # 카테고리·장소 필터 + useWarningFilter
│  ├─ warning-save/         # 북마크 저장 useSavedItems
│  └─ warning-share/        # 공유 모달
│
├─ entities/                # 도메인 모델
│  └─ warning/              # 타입 · 목데이터 · WarningCard · CriticalCard
│
└─ shared/                  # 공용 유틸/설정/UI
   ├─ config/               # DESTINATION_DATA, CATEGORIES, LOCATIONS
   ├─ lib/                  # getRiskStyles, useToast, useBodyScrollLock
   └─ ui/                   # Toast
```

각 슬라이스는 `index.ts` public API를 통해서만 외부에 노출합니다. 상위 레이어는 이 배럴만 import 합니다.

> 현재 데이터는 서비스 검증용 예시(프로토타입)입니다. 실제 여행 전 공식 기관과 방문 시설의 최신 안내를 확인하세요.

한국인 여행 수요를 기준으로 한 국가·지역·도시 확장 순서는 [`docs/destination-priority.md`](docs/destination-priority.md)에 정리되어 있습니다. 화면의 `인기` 표시는 공식 방문객 순위가 아니라 공개 통계와 검증 데이터 보유량을 함께 반영한 편집 우선순위입니다.

문화·제스처·종교 예절 데이터의 검수 원칙은 [`docs/cultural-content-policy.md`](docs/cultural-content-policy.md)에 정리되어 있습니다. 출처가 불명확한 제스처 속설은 공개하지 않고, 법률·시설 규칙·일반 매너를 구분해 표현합니다.

여행객 후기·커뮤니티·사용자 편집 위키는 문화 신호를 찾는 보조 자료로만 사용합니다. 신뢰 등급, 독립 출처 수, 반례 기록 기준은 [`docs/community-evidence-policy.md`](docs/community-evidence-policy.md)에 정리되어 있습니다.

```bash
npm run content:community:audit
npm run content:video:import
npm run content:video:audit
```

이 감사 명령은 여행자 경험 기반 항목이 `VERIFIED`로 잘못 공개됐는지, 독립 출처가 2개 미만인지, 맥락·부작용·반례가 빠졌는지 검사합니다.

`content:video:import`는 후보 YouTube URL의 oEmbed 메타데이터를 확인해 채널명과 영상 제목을 `VideoSourceCandidate`에 저장합니다. `content:video:audit`는 삭제·비공개·메타데이터 변경과 잘못된 `VERIFIED` 상태를 검사합니다. 영상 자막 전체는 저장하지 않습니다.
