import 'server-only';

import crypto from 'node:crypto';

export type McpScope = 'read' | 'write' | 'admin';

export interface McpPrincipal {
  actor: string;
  scope: McpScope;
  tokenHash: string;
}

const scopeRank: Record<McpScope, number> = { read: 1, write: 2, admin: 3 };

const safeEqual = (left: string, right: string) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const configuredTokens = () => [
  { token: process.env.CANIDOIT_MCP_READ_TOKEN, scope: 'read' as const, actor: 'mcp:read' },
  { token: process.env.CANIDOIT_MCP_WRITE_TOKEN, scope: 'write' as const, actor: 'mcp:write' },
  { token: process.env.CANIDOIT_MCP_ADMIN_TOKEN ?? process.env.CANIDOIT_MCP_TOKEN, scope: 'admin' as const, actor: 'mcp:admin' },
].filter((item): item is { token: string; scope: McpScope; actor: string } => Boolean(item.token));

export const authenticateMcp = (authorization: string | null): McpPrincipal | null => {
  if (!authorization?.startsWith('Bearer ')) return null;
  const candidate = authorization.slice('Bearer '.length).trim();
  if (!candidate) return null;

  for (const configured of configuredTokens()) {
    if (safeEqual(candidate, configured.token)) {
      return {
        actor: configured.actor,
        scope: configured.scope,
        tokenHash: crypto.createHash('sha256').update(candidate).digest('hex').slice(0, 16),
      };
    }
  }
  return null;
};

export const assertMcpScope = (principal: McpPrincipal, required: McpScope) => {
  if (scopeRank[principal.scope] < scopeRank[required]) throw new Error('MCP_FORBIDDEN');
};

export const hasConfiguredMcpToken = () => configuredTokens().length > 0;
