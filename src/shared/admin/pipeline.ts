import 'server-only';

import crypto from 'node:crypto';
import type { AdminJobType, Prisma } from '@prisma/client';
import { prisma } from '@/shared/db/prisma';
import { nimChatJson, nvidiaModels } from '@/shared/ai/nvidiaNim';
import { writeAdminLog } from './audit';
import { assertDirectFetchContentType, sanitizeExtractedText } from './sourceContent';

const cleanHtml = (html: string) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"');

const fetchDirect = async (url: string) => {
  const response = await fetch(url, {
    headers: { 'user-agent': 'CanIDoItAdminBot/1.0 (+official travel guidance monitor)' },
    redirect: 'follow',
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Direct fetch failed: HTTP ${response.status}`);
  const contentType = response.headers.get('content-type');
  assertDirectFetchContentType(contentType);
  const html = await response.text();
  const text = sanitizeExtractedText(cleanHtml(html));
  if (!text) throw new Error('Direct fetch returned empty text content.');
  return {
    provider: 'direct-fetch',
    text,
    metadata: {
      status: response.status,
      finalUrl: response.url,
      contentType,
    },
  };
};

const fetchFirecrawl = async (url: string) => {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error('FIRECRAWL_API_KEY is not configured.');
  const response = await fetch('https://api.firecrawl.dev/v2/scrape', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error(`Firecrawl failed: HTTP ${response.status}`);
  const payload = await response.json() as {
    data?: { markdown?: string; metadata?: Record<string, unknown> };
    markdown?: string;
    metadata?: Record<string, unknown>;
  };
  const text = sanitizeExtractedText(payload.data?.markdown ?? payload.markdown ?? '');
  if (!text) throw new Error('Firecrawl returned empty content.');
  return {
    provider: 'firecrawl',
    text,
    metadata: payload.data?.metadata ?? payload.metadata ?? {},
  };
};

const collectSource = async (sourceId: string) => {
  const source = await prisma.officialSource.findUnique({ where: { id: sourceId } });
  if (!source || !source.enabled) throw new Error('Enabled OfficialSource not found.');
  const parsed = new URL(source.url);
  if (parsed.protocol !== 'https:') throw new Error('OfficialSource must use HTTPS.');

  const provider = process.env.CRAWLER_PROVIDER === 'firecrawl' ? 'firecrawl' : 'direct-fetch';
  const collected = provider === 'firecrawl'
    ? await fetchFirecrawl(source.url)
    : await fetchDirect(source.url);
  const text = sanitizeExtractedText(collected.text).slice(0, 250_000);
  if (!text) throw new Error('Collected source produced no usable text.');
  const contentHash = crypto.createHash('sha256').update(text).digest('hex');
  const previous = await prisma.sourceSnapshot.findFirst({
    where: { sourceId },
    orderBy: { fetchedAt: 'desc' },
  });
  const snapshot = await prisma.sourceSnapshot.upsert({
    where: { sourceId_contentHash: { sourceId, contentHash } },
    update: {},
    create: {
      sourceId,
      contentHash,
      extractedText: text,
      provider: collected.provider,
      metadata: collected.metadata as Prisma.InputJsonValue,
      changed: Boolean(previous && previous.contentHash !== contentHash),
    },
  });
  await prisma.officialSource.update({ where: { id: sourceId }, data: { lastFetchedAt: new Date() } });
  return {
    sourceId,
    snapshotId: snapshot.id,
    provider: snapshot.provider,
    changed: snapshot.changed,
    contentLength: snapshot.extractedText.length,
    contentHash: snapshot.contentHash,
  };
};

interface DraftCandidate {
  title?: string;
  category?: string;
  risk?: string;
  type?: string;
  range?: string;
  reason?: string;
  alternative?: string;
  evidence?: string;
  keywords?: string[];
  aliases?: string[];
}

const draftSnapshot = async (snapshotId: string) => {
  const snapshot = await prisma.sourceSnapshot.findUnique({
    where: { id: snapshotId },
    include: { source: true },
  });
  if (!snapshot) throw new Error('SourceSnapshot not found.');

  const fallback = { warnings: [] as DraftCandidate[] };
  const payload = await nimChatJson<{ warnings?: DraftCandidate[] }>([
    {
      role: 'system',
      content: [
        '공식 여행 문서에서 여행자가 알아야 할 규정 후보만 구조화하라.',
        '원문에 없는 벌금, 형량, 날짜, 예외를 만들지 마라.',
        '출력 JSON: {warnings:[{title,category,risk,type,range,reason,alternative,evidence,keywords,aliases}]}',
        'risk는 CRITICAL|HIGH|MEDIUM|INFO 중 하나다.',
        'evidence는 제공된 원문에 그대로 존재하는 짧은 근거 문장이어야 한다.',
      ].join(' '),
    },
    {
      role: 'user',
      content: JSON.stringify({
        countryCode: snapshot.source.countryCode,
        agencyName: snapshot.source.agencyName,
        sourceUrl: snapshot.source.url,
        text: snapshot.extractedText.slice(0, 180_000),
      }),
    },
  ], fallback, { model: nvidiaModels.extraction, maxTokens: 3000, timeoutMs: 50_000 });

  const candidates = Array.isArray(payload.warnings) ? payload.warnings : [];
  let created = 0;
  for (const candidate of candidates) {
    const evidence = typeof candidate.evidence === 'string' ? candidate.evidence.trim() : '';
    if (!evidence || !snapshot.extractedText.includes(evidence)) continue;
    await prisma.contentDraft.create({
      data: {
        sourceId: snapshot.sourceId,
        snapshotId: snapshot.id,
        model: nvidiaModels.extraction,
        payload: candidate as Prisma.InputJsonValue,
        evidence,
        status: 'REVIEWING',
      },
    });
    created += 1;
  }
  return { snapshotId, model: nvidiaModels.extraction, candidates: candidates.length, created };
};

const auditSource = async (sourceId: string) => {
  const source = await prisma.officialSource.findUnique({ where: { id: sourceId } });
  if (!source) throw new Error('OfficialSource not found.');
  try {
    const response = await fetch(source.url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': 'CanIDoItSourceAudit/1.0' },
      signal: AbortSignal.timeout(12_000),
    });
    return {
      sourceId,
      reachable: response.ok,
      status: response.status,
      finalUrl: response.url,
      contentType: response.headers.get('content-type'),
    };
  } catch (error) {
    return {
      sourceId,
      reachable: false,
      status: null,
      error: error instanceof Error ? error.message : 'unknown',
    };
  }
};

const auditDatabase = async () => {
  const [warnings, sources, reviewing, stale, brokenLinks, drafts, videos] = await Promise.all([
    prisma.warning.count({ where: { archived: false } }),
    prisma.source.count(),
    prisma.warning.count({ where: { status: 'REVIEWING' } }),
    prisma.warning.count({ where: { status: 'STALE' } }),
    prisma.source.count({ where: { linkStatus: { in: ['NOT_FOUND', 'ERROR'] } } }),
    prisma.contentDraft.count({ where: { status: 'REVIEWING' } }),
    prisma.videoSourceCandidate.count({ where: { status: 'REVIEWING' } }),
  ]);
  return { warnings, sources, reviewing, stale, brokenLinks, drafts, videos };
};

export const executeAdminJob = async (jobId: string, actor: string) => {
  const job = await prisma.adminJob.findUnique({ where: { id: jobId } });
  if (!job) throw new Error('AdminJob not found.');
  await prisma.adminJob.update({
    where: { id: jobId },
    data: { status: 'RUNNING', startedAt: new Date(), error: null },
  });

  try {
    let output: Record<string, unknown>;
    if (job.type === 'COLLECT_SOURCE') {
      if (!job.targetId) throw new Error('COLLECT_SOURCE requires targetId.');
      output = await collectSource(job.targetId);
    } else if (job.type === 'DRAFT_CONTENT') {
      if (!job.targetId) throw new Error('DRAFT_CONTENT requires targetId.');
      output = await draftSnapshot(job.targetId);
    } else if (job.type === 'AUDIT_SOURCE') {
      if (!job.targetId) throw new Error('AUDIT_SOURCE requires targetId.');
      output = await auditSource(job.targetId);
    } else if (job.type === 'AUDIT_DATABASE') {
      output = await auditDatabase();
    } else {
      throw new Error(`Unsupported job type: ${job.type satisfies never}`);
    }

    await prisma.adminJob.update({
      where: { id: jobId },
      data: {
        status: 'SUCCEEDED',
        output: output as Prisma.InputJsonValue,
        finishedAt: new Date(),
      },
    });
    await writeAdminLog({ actor, action: `JOB_${job.type}_SUCCEEDED`, targetType: 'AdminJob', targetId: jobId, metadata: output });
    return output;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown';
    await prisma.adminJob.update({
      where: { id: jobId },
      data: { status: 'FAILED', error: message.slice(0, 2000), finishedAt: new Date() },
    });
    await writeAdminLog({ actor, action: `JOB_${job.type}_FAILED`, targetType: 'AdminJob', targetId: jobId, metadata: { error: message } });
    throw error;
  }
};

export const createAndRunAdminJob = async ({
  type,
  targetType,
  targetId,
  actor,
}: {
  type: AdminJobType;
  targetType?: string | null;
  targetId?: string | null;
  actor: string;
}) => {
  const job = await prisma.adminJob.create({
    data: { type, targetType: targetType ?? null, targetId: targetId ?? null, requestedBy: actor },
  });
  await executeAdminJob(job.id, actor);
  return job.id;
};
