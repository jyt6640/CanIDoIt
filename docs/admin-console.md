# 관리자 콘솔 운영 가이드

## 환경변수

관리자 콘솔은 단일 운영자 계정과 서명된 HttpOnly 세션 쿠키를 사용합니다. Vercel의 Production과 Preview 환경에 다음 값을 등록합니다.

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<충분히 긴 무작위 비밀번호>
ADMIN_SESSION_SECRET=<32자 이상의 무작위 문자열>
```

`ADMIN_PASSWORD`와 `ADMIN_SESSION_SECRET`는 Sensitive 환경변수로 등록합니다. 값 변경 후에는 새 배포가 필요합니다.

크롤링과 AI 초안 생성에는 기존 서버 환경변수를 사용합니다.

```env
CRAWLER_PROVIDER=direct-fetch
FIRECRAWL_API_KEY=<Firecrawl을 사용할 때만>
NVIDIA_API_KEY=<NVIDIA NIM 키>
NVIDIA_EXTRACTION_MODEL=nvidia/nemotron-3-super-120b-a12b
```

## 접근

- 로그인: `/admin/login`
- 대시보드: `/admin`
- Warning 검수: `/admin/review`
- OfficialSource·크롤링: `/admin/sources`
- AI 초안: `/admin/drafts`
- 영상 후보: `/admin/videos`
- 작업·감사 이력: `/admin/jobs`

관리자 라우트는 `robots` 메타데이터와 `robots.txt`에서 색인을 차단합니다. 인증되지 않은 접근은 로그인 화면으로 이동합니다.

## 검수 규칙

### Warning

`VERIFIED`로 변경하려면 URL과 확인일이 있는 `OFFICIAL` 또는 `GOVERNMENT_ADVISORY` 출처가 최소 1개 필요합니다. `COMMUNITY_SIGNAL`은 공식 근거와 교차 확인하기 전에는 `VERIFIED`로 바꿀 수 없습니다.

검수 완료 시 다음 값이 자동 기록됩니다.

- `reviewedBy`: 로그인한 관리자 아이디
- `verifiedAt`: 현재 시각
- `expiresAt`: 관리자 입력 재검토 주기

### AI 초안

NVIDIA 추출 모델이 생성한 초안은 원문에 evidence 문장이 실제로 포함된 경우에만 `ContentDraft(REVIEWING)`으로 저장됩니다. 관리자가 국가·지역·도시·안정 key를 확인해 Warning 검수 큐로 전환해야 합니다. 전환된 Warning도 `REVIEWING` 상태입니다.

### 영상 후보

YouTube URL은 oEmbed로 채널명과 제목을 확인합니다. 영상 후보는 직접 `VERIFIED` 근거가 되지 않으며, 주장 요약과 타임스탬프를 검수한 뒤 다른 독립 출처와 교차 확인해야 합니다.

## 크롤링 작업

OfficialSource는 HTTPS URL만 등록할 수 있습니다.

1. `/admin/sources`에서 국가코드·기관명·유형·언어·URL 등록
2. `수집 실행`으로 대상 하나만 크롤링
3. `SourceSnapshot`의 해시와 변경 여부 확인
4. 변경된 최신 스냅샷에서 `AI 초안 생성`
5. `/admin/drafts`에서 evidence와 구조화 JSON 검수
6. Warning 검수 큐로 전환

크롤링과 AI 요청은 대상 하나씩 실행하며 결과와 실패 원인은 `AdminJob`에 저장됩니다. 대규모 사이트 순회는 관리자 HTTP 요청 안에서 수행하지 않고 별도 워커나 외부 크롤링 플랫폼을 사용합니다.

## 감사·작업 이력

모든 주요 관리자 변경은 `AdminActionLog`에 기록됩니다.

- 로그인 성공·실패·로그아웃
- Warning 수정·상태 전환
- 출처 추가·수정·삭제
- OfficialSource 등록·수정·활성화
- ContentDraft 전환·보관
- 영상 후보 등록·수정·보관
- 크롤링·AI·링크·DB 감사 작업 성공·실패

`/admin/jobs`에서 최근 100개 작업과 활동 로그를 확인하고 실패한 작업을 같은 대상으로 재실행할 수 있습니다.

## 보안 제한

- 세션 쿠키는 HttpOnly, SameSite=Strict, Production Secure로 설정합니다.
- 모든 변경 API는 세션과 Origin을 서버에서 다시 확인합니다.
- 관리 API는 클라이언트가 보낸 상태값·위험도·출처 종류를 허용목록으로 검증합니다.
- 외부 URL은 HTTPS만 허용합니다.
- 비밀번호와 세션 비밀값은 저장소·채팅·클라이언트 번들에 넣지 않습니다.
- 현재 구조는 소규모 운영자용 단일 계정 방식입니다. 여러 운영자와 세밀한 권한이 필요해지면 OIDC 기반 인증과 역할별 권한으로 교체합니다.
