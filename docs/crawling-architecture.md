# 공식 여행정보 수집 아키텍처

## 결론

현재 기본 공급자는 `direct-fetch`이고, JavaScript 렌더링이나 본문 추출이 어려운 공식 페이지에는 `firecrawl`을 선택적으로 사용한다. 대규모 사이트 순회가 필요해지면 별도 워커에서 Crawlee를 사용하고, 스케줄·브라우저 자동화 운영을 외부에 맡겨야 할 경우 Apify를 검토한다.

Next.js/Vercel 요청 안에서 장시간 크롤링하지 않는다. 크롤링은 CLI, GitHub Actions, 별도 워커 또는 외부 플랫폼에서 실행하고 결과만 PostgreSQL의 `SourceSnapshot`에 저장한다.

## 공급자 선택

### direct-fetch

- 비용이 없고 제어가 단순하다.
- 정적 HTML과 공개 API 문서에 우선 사용한다.
- JavaScript 렌더링, 차단 우회, 복잡한 본문 추출에는 적합하지 않다.

### Firecrawl

- 호스팅 API로 페이지를 Markdown 형태로 정리할 수 있다.
- 동적 페이지나 본문 추출이 어려운 공식 사이트에 선택적으로 사용한다.
- 외부 비용과 공급자 의존성이 있으므로 URL 단위로 제한한다.

### Crawlee

- RequestQueue, 재시도, 동시성, BFS/DFS 순회를 직접 제어할 수 있다.
- 자체 워커를 운영할 수 있을 때 대규모 공식 사이트 순회에 적합하다.
- Vercel 함수가 아니라 장시간 실행 가능한 별도 런타임에 배치한다.

### Apify

- Actor, Request Queue, Dataset, 스케줄 실행을 제공한다.
- 브라우저 자동화와 운영 대시보드가 필요한 경우 유리하다.
- 비용과 플랫폼 종속성을 고려해 고난도 사이트에만 사용한다.

## 안전 규칙

1. `OfficialSource`에 등록된 HTTPS URL만 수집한다.
2. robots.txt와 기관 이용약관을 검토한다.
3. 사이트별 동시성, 지연시간, 최대 페이지 수를 제한한다.
4. 로그인, CAPTCHA 우회, 개인정보 수집을 하지 않는다.
5. 원문과 해시, 공급자, 응답 메타데이터를 함께 저장한다.
6. AI 초안은 `REVIEWING`으로만 저장하고 자동 공개하지 않는다.

## 실행

```bash
# 기본 정적 HTML 수집
CRAWLER_PROVIDER=direct-fetch npm run content:collect -- https://official.example/page

# Firecrawl 사용
CRAWLER_PROVIDER=firecrawl FIRECRAWL_API_KEY=... npm run content:collect -- https://official.example/page
```

`SourceSnapshot.provider`와 `SourceSnapshot.metadata`를 통해 어떤 엔진으로 어떤 응답을 수집했는지 추적한다.