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
