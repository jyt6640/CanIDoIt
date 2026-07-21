import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
import { assertMcpScope, authenticateMcp } from './auth';

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe('MCP auth', () => {
  it('authenticates scoped bearer tokens', () => {
    process.env.CANIDOIT_MCP_READ_TOKEN = 'read-token-with-enough-entropy';
    process.env.CANIDOIT_MCP_WRITE_TOKEN = 'write-token-with-enough-entropy';
    process.env.CANIDOIT_MCP_ADMIN_TOKEN = 'admin-token-with-enough-entropy';

    expect(authenticateMcp('Bearer read-token-with-enough-entropy')?.scope).toBe('read');
    expect(authenticateMcp('Bearer write-token-with-enough-entropy')?.scope).toBe('write');
    expect(authenticateMcp('Bearer admin-token-with-enough-entropy')?.scope).toBe('admin');
    expect(authenticateMcp('Bearer wrong')).toBeNull();
  });

  it('blocks a read principal from write scope', () => {
    expect(() => assertMcpScope({ actor: 'test', scope: 'read', tokenHash: 'hash' }, 'write')).toThrow('MCP_FORBIDDEN');
    expect(() => assertMcpScope({ actor: 'test', scope: 'admin', tokenHash: 'hash' }, 'write')).not.toThrow();
  });
});
