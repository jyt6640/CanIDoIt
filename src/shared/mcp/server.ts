import 'server-only';

import type { McpPrincipal } from './auth';
import { callMcpTool, mcpTools } from './tools';

interface JsonRpcRequest {
  jsonrpc?: unknown;
  id?: unknown;
  method?: unknown;
  params?: unknown;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: unknown;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

const success = (id: unknown, result: unknown): JsonRpcResponse => ({ jsonrpc: '2.0', id, result });
const failure = (id: unknown, code: number, message: string, data?: unknown): JsonRpcResponse => ({
  jsonrpc: '2.0',
  id,
  error: { code, message, ...(data === undefined ? {} : { data }) },
});

const toolResult = (value: unknown, isError = false) => ({
  content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
  structuredContent: value && typeof value === 'object' ? value : { value },
  ...(isError ? { isError: true } : {}),
});

export const handleMcpJsonRpc = async (body: unknown, principal: McpPrincipal): Promise<JsonRpcResponse | null> => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return failure(null, -32600, 'Invalid Request');
  const request = body as JsonRpcRequest;
  const id = request.id ?? null;
  if (request.jsonrpc !== '2.0' || typeof request.method !== 'string') return failure(id, -32600, 'Invalid Request');

  if (request.method.startsWith('notifications/')) return null;
  if (request.method === 'ping') return success(id, {});
  if (request.method === 'initialize') {
    return success(id, {
      protocolVersion: '2025-03-26',
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: 'canidoit-admin', version: '1.0.0' },
      instructions: 'CanIDoIt 여행 데이터 검수, 출처 감사, 공식 문서 수집 및 초안 작업을 관리합니다. mutation 도구는 scope에 따라 제한됩니다.',
    });
  }
  if (request.method === 'tools/list') {
    return success(id, {
      tools: mcpTools.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
    });
  }
  if (request.method === 'tools/call') {
    const params = request.params && typeof request.params === 'object' && !Array.isArray(request.params)
      ? request.params as Record<string, unknown>
      : {};
    const name = typeof params.name === 'string' ? params.name : '';
    if (!name) return failure(id, -32602, 'Invalid params: tool name is required');
    try {
      const result = await callMcpTool({ name, arguments: params.arguments, principal });
      return success(id, toolResult(result));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown tool error';
      if (message === 'MCP_FORBIDDEN') return failure(id, -32003, 'Insufficient MCP scope');
      if (message === 'MCP_TOOL_NOT_FOUND') return failure(id, -32601, 'Tool not found');
      if (message.startsWith('MCP_INVALID_ARGUMENT')) return failure(id, -32602, message);
      if (message.startsWith('MCP_NOT_FOUND')) return failure(id, -32004, message);
      return success(id, toolResult({ error: message }, true));
    }
  }
  return failure(id, -32601, 'Method not found');
};
