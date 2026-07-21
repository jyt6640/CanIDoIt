import 'server-only';

import type { AdminJobType, Prisma, SourceLinkStatus, WarningStatus } from '@prisma/client';
import { prisma } from '@/shared/db/prisma';
import { writeAdminLog } from '@/shared/admin/audit';
import { createAndRunAdminJob } from '@/shared/admin/pipeline';
import { assertMcpScope, type McpPrincipal, type McpScope } from './auth';

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  requiredScope: McpScope;
}

const objectSchema = (properties: Record<string, unknown>, required: string[] = []) => ({
  type: 'object',
  additionalProperties: false,
  properties,
  ...(required.length ? { required } : {}),
});

export const mcpTools: McpToolDefinition[] = [
  {
    name: 'canidoit_health',
    description: '서비스 데이터 품질, 검수 큐, 출처 링크, 관리자 작업 요약을 조회합니다.',
    requiredScope: 'read',
    inputSchema: objectSchema({}),
  },
  {
    name: 'review_queue_list',
    description: 'Warning 검수 큐를 상태, 국가, 검색어로 조회합니다.',
    requiredScope: 'read',
    inputSchema: objectSchema({
      status: { type: 'string', enum: ['DRAFT', 'REVIEWING', 'VERIFIED', 'STALE', 'ARCHIVED'] },
      countrySlug: { type: 'string' },
      query: { type: 'string' },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 30 },
    }),
  },
  {
    name: 'warning_get',
    description: 'Warning 상세와 출처를 id 또는 key로 조회합니다.',
    requiredScope: 'read',
    inputSchema: objectSchema({ id: { type: 'string' }, key: { type: 'string' } }),
  },
  {
    name: 'warning_set_status',
    description: 'Warning 상태를 변경합니다. VERIFIED는 admin scope와 유효한 공식 출처가 필요합니다.',
    requiredScope: 'write',
    inputSchema: objectSchema({
      id: { type: 'string' },
      key: { type: 'string' },
      status: { type: 'string', enum: ['DRAFT', 'REVIEWING', 'VERIFIED', 'STALE', 'ARCHIVED'] },
      note: { type: 'string', maxLength: 1000 },
    }, ['status']),
  },
  {
    name: 'sources_list',
    description: 'Warning 출처와 링크 상태를 필터링해 조회합니다.',
    requiredScope: 'read',
    inputSchema: objectSchema({
      linkStatus: { type: 'string', enum: ['UNKNOWN', 'HEALTHY', 'BLOCKED', 'NOT_FOUND', 'ERROR'] },
      warningKey: { type: 'string' },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
    }),
  },
  {
    name: 'source_audit',
    description: '단일 Warning Source URL을 요청해 링크 상태를 DB에 저장합니다.',
    requiredScope: 'write',
    inputSchema: objectSchema({ sourceId: { type: 'string' } }, ['sourceId']),
  },
  {
    name: 'official_sources_list',
    description: '크롤링 대상 OfficialSource와 최근 수집 상태를 조회합니다.',
    requiredScope: 'read',
    inputSchema: objectSchema({
      enabled: { type: 'boolean' },
      countryCode: { type: 'string' },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
    }),
  },
  {
    name: 'official_source_register',
    description: 'HTTPS 공식 출처를 등록하거나 갱신합니다.',
    requiredScope: 'admin',
    inputSchema: objectSchema({
      countryCode: { type: 'string', minLength: 2, maxLength: 3 },
      agencyName: { type: 'string', minLength: 2 },
      sourceType: { type: 'string', minLength: 2 },
      language: { type: 'string', default: 'en' },
      url: { type: 'string', format: 'uri' },
    }, ['countryCode', 'agencyName', 'sourceType', 'url']),
  },
  {
    name: 'official_source_toggle',
    description: 'OfficialSource 수집 활성화 상태를 변경합니다.',
    requiredScope: 'admin',
    inputSchema: objectSchema({ id: { type: 'string' }, enabled: { type: 'boolean' } }, ['id', 'enabled']),
  },
  {
    name: 'pipeline_run',
    description: '공식 출처 수집, 초안 생성, 출처 감사, DB 감사를 실행하고 AdminJob을 기록합니다.',
    requiredScope: 'write',
    inputSchema: objectSchema({
      type: { type: 'string', enum: ['COLLECT_SOURCE', 'DRAFT_CONTENT', 'AUDIT_SOURCE', 'AUDIT_DATABASE'] },
      targetId: { type: 'string' },
    }, ['type']),
  },
  {
    name: 'drafts_list',
    description: 'ContentDraft 검수 큐를 조회합니다.',
    requiredScope: 'read',
    inputSchema: objectSchema({
      status: { type: 'string', enum: ['DRAFT', 'REVIEWING', 'VERIFIED', 'STALE', 'ARCHIVED'] },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 30 },
    }),
  },
  {
    name: 'draft_set_status',
    description: 'ContentDraft를 REVIEWING 또는 ARCHIVED로 변경합니다. MCP에서 자동 공개하지 않습니다.',
    requiredScope: 'write',
    inputSchema: objectSchema({
      id: { type: 'string' },
      status: { type: 'string', enum: ['REVIEWING', 'ARCHIVED'] },
      note: { type: 'string', maxLength: 1000 },
    }, ['id', 'status']),
  },
  {
    name: 'jobs_list',
    description: '관리자 파이프라인 작업과 성공·실패 상태를 조회합니다.',
    requiredScope: 'read',
    inputSchema: objectSchema({ limit: { type: 'integer', minimum: 1, maximum: 100, default: 30 } }),
  },
];

const asRecord = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value)
  ? value as Record<string, unknown>
  : {};
const text = (args: Record<string, unknown>, key: string) => typeof args[key] === 'string' ? String(args[key]).trim() : '';
const integer = (args: Record<string, unknown>, key: string, fallback: number, max = 100) => {
  const value = Number(args[key]);
  return Number.isInteger(value) ? Math.min(Math.max(value, 1), max) : fallback;
};
const bool = (args: Record<string, unknown>, key: string) => typeof args[key] === 'boolean' ? args[key] as boolean : undefined;

const locateWarning = async (args: Record<string, unknown>) => {
  const id = text(args, 'id');
  const key = text(args, 'key');
  if (!id && !key) throw new Error('MCP_INVALID_ARGUMENT:id_or_key_required');
  return prisma.warning.findFirst({
    where: id ? { id } : { key },
    include: { country: true, region: true, city: true, sources: true },
  });
};

const auditSourceLink = async (sourceId: string) => {
  const source = await prisma.source.findUnique({ where: { id: sourceId } });
  if (!source) throw new Error('MCP_NOT_FOUND:source');
  if (!source.url) {
    return prisma.source.update({
      where: { id: sourceId },
      data: { linkStatus: 'ERROR', lastLinkCheckedAt: new Date(), lastHttpStatus: null, finalUrl: null },
    });
  }
  let status: SourceLinkStatus = 'ERROR';
  let httpStatus: number | null = null;
  let finalUrl: string | null = null;
  try {
    const response = await fetch(source.url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': 'CanIDoItMcpAudit/1.0' },
      signal: AbortSignal.timeout(12_000),
    });
    httpStatus = response.status;
    finalUrl = response.url;
    status = response.ok ? 'HEALTHY' : response.status === 403 || response.status === 429
      ? 'BLOCKED'
      : response.status === 404 || response.status === 410
        ? 'NOT_FOUND'
        : 'ERROR';
  } catch {
    status = 'ERROR';
  }
  return prisma.source.update({
    where: { id: sourceId },
    data: { linkStatus: status, lastLinkCheckedAt: new Date(), lastHttpStatus: httpStatus, finalUrl },
  });
};

export const callMcpTool = async ({
  name,
  arguments: rawArguments,
  principal,
}: {
  name: string;
  arguments?: unknown;
  principal: McpPrincipal;
}) => {
  const definition = mcpTools.find((tool) => tool.name === name);
  if (!definition) throw new Error('MCP_TOOL_NOT_FOUND');
  assertMcpScope(principal, definition.requiredScope);
  const args = asRecord(rawArguments);
  let result: unknown;

  if (name === 'canidoit_health') {
    const [warnings, sources, officialSources, drafts, jobs, warningStatuses, linkStatuses] = await Promise.all([
      prisma.warning.count({ where: { archived: false } }),
      prisma.source.count(),
      prisma.officialSource.count(),
      prisma.contentDraft.count({ where: { status: 'REVIEWING' } }),
      prisma.adminJob.count({ where: { status: { in: ['QUEUED', 'RUNNING'] } } }),
      prisma.warning.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.source.groupBy({ by: ['linkStatus'], _count: { _all: true } }),
    ]);
    result = { warnings, sources, officialSources, reviewingDrafts: drafts, activeJobs: jobs, warningStatuses, linkStatuses };
  } else if (name === 'review_queue_list') {
    const status = text(args, 'status') as WarningStatus | '';
    const countrySlug = text(args, 'countrySlug');
    const query = text(args, 'query');
    result = await prisma.warning.findMany({
      where: {
        archived: status === 'ARCHIVED' ? true : false,
        ...(status ? { status } : { status: { in: ['REVIEWING', 'STALE'] } }),
        ...(countrySlug ? { country: { slug: countrySlug } } : {}),
        ...(query ? { OR: [{ title: { contains: query, mode: 'insensitive' } }, { key: { contains: query, mode: 'insensitive' } }] } : {}),
      },
      include: { country: true, region: true, city: true, sources: true },
      orderBy: [{ updatedAt: 'desc' }],
      take: integer(args, 'limit', 30),
    });
  } else if (name === 'warning_get') {
    result = await locateWarning(args);
    if (!result) throw new Error('MCP_NOT_FOUND:warning');
  } else if (name === 'warning_set_status') {
    const warning = await locateWarning(args);
    if (!warning) throw new Error('MCP_NOT_FOUND:warning');
    const status = text(args, 'status') as WarningStatus;
    if (!['DRAFT', 'REVIEWING', 'VERIFIED', 'STALE', 'ARCHIVED'].includes(status)) throw new Error('MCP_INVALID_ARGUMENT:status');
    if (status === 'VERIFIED') {
      assertMcpScope(principal, 'admin');
      const validOfficial = warning.sources.some((source) =>
        Boolean(source.url && source.checkedAt) && ['OFFICIAL', 'GOVERNMENT_ADVISORY'].includes(source.kind),
      );
      if (!validOfficial) throw new Error('MCP_VERIFICATION_REQUIRES_OFFICIAL_SOURCE');
    }
    result = await prisma.warning.update({
      where: { id: warning.id },
      data: {
        status,
        archived: status === 'ARCHIVED',
        reviewedBy: status === 'VERIFIED' ? principal.actor : null,
        verifiedAt: status === 'VERIFIED' ? new Date() : null,
        expiresAt: status === 'VERIFIED' ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) : null,
      },
    });
  } else if (name === 'sources_list') {
    const linkStatus = text(args, 'linkStatus') as SourceLinkStatus | '';
    const warningKey = text(args, 'warningKey');
    result = await prisma.source.findMany({
      where: {
        ...(linkStatus ? { linkStatus } : {}),
        ...(warningKey ? { warning: { key: warningKey } } : {}),
      },
      include: { warning: { select: { key: true, title: true, status: true } } },
      orderBy: { lastLinkCheckedAt: 'asc' },
      take: integer(args, 'limit', 50),
    });
  } else if (name === 'source_audit') {
    result = await auditSourceLink(text(args, 'sourceId'));
  } else if (name === 'official_sources_list') {
    const enabled = bool(args, 'enabled');
    const countryCode = text(args, 'countryCode');
    result = await prisma.officialSource.findMany({
      where: {
        ...(enabled === undefined ? {} : { enabled }),
        ...(countryCode ? { countryCode: countryCode.toUpperCase() } : {}),
      },
      include: { _count: { select: { snapshots: true, drafts: true } } },
      orderBy: [{ enabled: 'desc' }, { updatedAt: 'desc' }],
      take: integer(args, 'limit', 50),
    });
  } else if (name === 'official_source_register') {
    const url = new URL(text(args, 'url'));
    if (url.protocol !== 'https:') throw new Error('MCP_INVALID_ARGUMENT:https_required');
    result = await prisma.officialSource.upsert({
      where: { url: url.toString() },
      update: {
        countryCode: text(args, 'countryCode').toUpperCase(),
        agencyName: text(args, 'agencyName'),
        sourceType: text(args, 'sourceType'),
        language: text(args, 'language') || 'en',
        enabled: true,
      },
      create: {
        countryCode: text(args, 'countryCode').toUpperCase(),
        agencyName: text(args, 'agencyName'),
        sourceType: text(args, 'sourceType'),
        language: text(args, 'language') || 'en',
        url: url.toString(),
      },
    });
  } else if (name === 'official_source_toggle') {
    result = await prisma.officialSource.update({ where: { id: text(args, 'id') }, data: { enabled: bool(args, 'enabled') } });
  } else if (name === 'pipeline_run') {
    const type = text(args, 'type') as AdminJobType;
    const targetId = text(args, 'targetId') || null;
    if (!['COLLECT_SOURCE', 'DRAFT_CONTENT', 'AUDIT_SOURCE', 'AUDIT_DATABASE'].includes(type)) throw new Error('MCP_INVALID_ARGUMENT:type');
    if (type !== 'AUDIT_DATABASE' && !targetId) throw new Error('MCP_INVALID_ARGUMENT:targetId');
    const jobId = await createAndRunAdminJob({ type, targetType: type === 'DRAFT_CONTENT' ? 'SourceSnapshot' : 'OfficialSource', targetId, actor: principal.actor });
    result = await prisma.adminJob.findUnique({ where: { id: jobId } });
  } else if (name === 'drafts_list') {
    const status = text(args, 'status') as WarningStatus | '';
    result = await prisma.contentDraft.findMany({
      where: status ? { status } : { status: 'REVIEWING' },
      include: { source: true, snapshot: { select: { id: true, fetchedAt: true, changed: true, provider: true } } },
      orderBy: { createdAt: 'desc' },
      take: integer(args, 'limit', 30),
    });
  } else if (name === 'draft_set_status') {
    const status = text(args, 'status') as WarningStatus;
    if (!['REVIEWING', 'ARCHIVED'].includes(status)) throw new Error('MCP_INVALID_ARGUMENT:status');
    result = await prisma.contentDraft.update({ where: { id: text(args, 'id') }, data: { status, reviewedAt: new Date() } });
  } else if (name === 'jobs_list') {
    result = await prisma.adminJob.findMany({ orderBy: { createdAt: 'desc' }, take: integer(args, 'limit', 30) });
  }

  await writeAdminLog({
    actor: principal.actor,
    action: `MCP_${name.toUpperCase()}`,
    targetType: 'McpTool',
    targetId: text(args, 'id') || text(args, 'sourceId') || text(args, 'targetId') || null,
    metadata: {
      scope: principal.scope,
      tokenHash: principal.tokenHash,
      note: text(args, 'note') || null,
    } as Prisma.InputJsonObject,
  });
  return result;
};
