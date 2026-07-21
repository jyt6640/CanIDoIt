# CanIDoIt 관리자 MCP

## Endpoint

```text
https://can-i-do-it.vercel.app/api/mcp
```

전송 방식은 stateless Streamable HTTP JSON-RPC 2.0입니다. `initialize`, `ping`, `tools/list`, `tools/call`, `notifications/initialized`를 지원합니다.

## 인증과 권한

모든 POST 요청은 Bearer token이 필요합니다.

```env
CANIDOIT_MCP_READ_TOKEN=<read-only token>
CANIDOIT_MCP_WRITE_TOKEN=<review and pipeline token>
CANIDOIT_MCP_ADMIN_TOKEN=<source registration and verification token>
```

각 값은 서로 다른 48바이트 이상의 무작위 문자열로 생성하고 Vercel Sensitive 환경변수로 저장합니다. 하위 권한 토큰은 상위 권한을 얻지 못합니다.

- `read`: 지표, 검수 큐, 출처, 초안, 작업 조회
- `write`: 상태 변경, 링크 감사, 크롤링·초안 작업 실행
- `admin`: OfficialSource 등록·활성화 변경, Warning VERIFIED 전환

모든 도구 호출은 `AdminActionLog`에 actor, scope, token hash prefix, target id와 함께 기록됩니다. 토큰 원문은 저장하지 않습니다.

## 제공 도구

- `canidoit_health`
- `review_queue_list`
- `warning_get`
- `warning_set_status`
- `sources_list`
- `source_audit`
- `official_sources_list`
- `official_source_register`
- `official_source_toggle`
- `pipeline_run`
- `drafts_list`
- `draft_set_status`
- `jobs_list`

`warning_set_status`로 `VERIFIED`를 지정하려면 admin scope와 확인일이 있는 공식 또는 정부 출처가 필요합니다. MCP는 ContentDraft를 자동 공개하지 않으며 `draft_set_status`는 `REVIEWING`과 `ARCHIVED`만 허용합니다.

## 연결 예시

MCP 클라이언트 설정 형식은 클라이언트마다 다르지만 URL과 Authorization header는 다음과 같습니다.

```json
{
  "url": "https://can-i-do-it.vercel.app/api/mcp",
  "headers": {
    "Authorization": "Bearer ${CANIDOIT_MCP_ADMIN_TOKEN}"
  }
}
```

실제 토큰을 저장소, 채팅, 로그, 스크린샷에 포함하지 않습니다.

## JSON-RPC smoke test

```bash
curl -sS https://can-i-do-it.vercel.app/api/mcp \
  -H "Authorization: Bearer $CANIDOIT_MCP_READ_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

서버는 요청당 64 KiB 제한과 토큰별 분당 요청 제한을 적용합니다. 장시간 수집 작업은 `AdminJob`으로 기록되며 `jobs_list`로 결과를 확인합니다.
