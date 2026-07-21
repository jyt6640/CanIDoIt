import { NextResponse } from 'next/server';
import { authenticateMcp, hasConfiguredMcpToken } from '@/shared/mcp/auth';
import { handleMcpJsonRpc } from '@/shared/mcp/server';

export const maxDuration = 60;

const MAX_BODY_BYTES = 64 * 1024;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 90;
const buckets = new Map<string, { startedAt: number; count: number }>();

const allowRequest = (key: string) => {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.startedAt >= WINDOW_MS) {
    buckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) return false;
  bucket.count += 1;
  return true;
};

const mcpHeaders = {
  'cache-control': 'no-store',
  'content-type': 'application/json; charset=utf-8',
  'x-content-type-options': 'nosniff',
};

export async function POST(request: Request) {
  if (!hasConfiguredMcpToken()) {
    return NextResponse.json({ error: 'MCP_NOT_CONFIGURED' }, { status: 503, headers: mcpHeaders });
  }

  const principal = authenticateMcp(request.headers.get('authorization'));
  if (!principal) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, {
      status: 401,
      headers: { ...mcpHeaders, 'www-authenticate': 'Bearer realm="CanIDoIt MCP"' },
    });
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'PAYLOAD_TOO_LARGE' }, { status: 413, headers: mcpHeaders });
  }
  if (!allowRequest(principal.tokenHash)) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, {
      status: 429,
      headers: { ...mcpHeaders, 'retry-after': '60' },
    });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400, headers: mcpHeaders });
  }
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'PAYLOAD_TOO_LARGE' }, { status: 413, headers: mcpHeaders });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, { status: 400, headers: mcpHeaders });
  }

  const response = await handleMcpJsonRpc(body, principal);
  if (response === null) return new Response(null, { status: 202, headers: mcpHeaders });
  return NextResponse.json(response, { status: 200, headers: mcpHeaders });
}

export async function GET() {
  return NextResponse.json({
    name: 'canidoit-admin',
    transport: 'streamable-http-json',
    protocolVersion: '2025-03-26',
    endpoint: '/api/mcp',
    authentication: 'Bearer token required',
  }, { status: 200, headers: mcpHeaders });
}
