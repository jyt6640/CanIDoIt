import { beforeEach, describe, expect, it, vi } from 'vitest';

const { callMcpTool } = vi.hoisted(() => ({ callMcpTool: vi.fn() }));

vi.mock('server-only', () => ({}));

vi.mock('./tools', () => ({
  mcpTools: [
    {
      name: 'canidoit_health',
      description: 'health',
      inputSchema: { type: 'object', properties: {} },
      requiredScope: 'read',
    },
  ],
  callMcpTool,
}));

import { handleMcpJsonRpc } from './server';

const principal = { actor: 'mcp:test', scope: 'admin' as const, tokenHash: 'hash' };

beforeEach(() => {
  callMcpTool.mockReset();
});

describe('MCP JSON-RPC server', () => {
  it('initializes with the supported protocol and tools capability', async () => {
    const response = await handleMcpJsonRpc({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }, principal);
    expect(response).toMatchObject({
      jsonrpc: '2.0',
      id: 1,
      result: {
        protocolVersion: '2025-03-26',
        capabilities: { tools: { listChanged: false } },
      },
    });
  });

  it('lists tools', async () => {
    const response = await handleMcpJsonRpc({ jsonrpc: '2.0', id: 2, method: 'tools/list' }, principal);
    expect(response?.result).toEqual({
      tools: [{ name: 'canidoit_health', description: 'health', inputSchema: { type: 'object', properties: {} } }],
    });
  });

  it('calls a tool and wraps structured content', async () => {
    callMcpTool.mockResolvedValue({ warnings: 10 });
    const response = await handleMcpJsonRpc({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: { name: 'canidoit_health', arguments: {} },
    }, principal);
    expect(callMcpTool).toHaveBeenCalledWith({ name: 'canidoit_health', arguments: {}, principal });
    expect(response?.result).toMatchObject({ structuredContent: { warnings: 10 } });
  });

  it('does not respond to notifications', async () => {
    await expect(handleMcpJsonRpc({ jsonrpc: '2.0', method: 'notifications/initialized' }, principal)).resolves.toBeNull();
  });
});
