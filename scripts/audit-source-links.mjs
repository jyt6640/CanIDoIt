import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const concurrency = Number(process.env.SOURCE_AUDIT_CONCURRENCY ?? 8);
const timeoutMs = Number(process.env.SOURCE_AUDIT_TIMEOUT_MS ?? 12_000);

async function checkUrl(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': 'CanIDoItSourceAudit/1.0' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    return {
      reachable: response.ok,
      status: response.status,
      finalUrl: response.url,
      contentType: response.headers.get('content-type'),
    };
  } catch (error) {
    return {
      reachable: false,
      status: null,
      finalUrl: null,
      contentType: null,
      error: error instanceof Error ? error.message : 'unknown',
    };
  }
}

const toLinkStatus = (row) => {
  if (!row.url) return 'ERROR';
  if (row.reachable) return 'HEALTHY';
  if (row.status === 403 || row.status === 429) return 'BLOCKED';
  if (row.status === 404 || row.status === 410) return 'NOT_FOUND';
  return 'ERROR';
};

async function main() {
  const sources = await prisma.source.findMany({
    include: { warning: { select: { key: true, title: true, status: true } } },
    orderBy: { id: 'asc' },
  });
  const rows = [];
  let cursor = 0;

  async function worker() {
    while (cursor < sources.length) {
      const index = cursor++;
      const source = sources[index];
      if (!source.url) {
        rows[index] = {
          sourceId: source.id,
          warningKey: source.warning.key,
          title: source.title,
          url: null,
          reachable: false,
          status: null,
          issue: 'MISSING_URL',
        };
        continue;
      }
      const checked = await checkUrl(source.url);
      rows[index] = {
        sourceId: source.id,
        warningKey: source.warning.key,
        title: source.title,
        url: source.url,
        ...checked,
        issue: checked.reachable ? null : 'UNREACHABLE_URL',
      };
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, () => worker()));
  const auditedAt = new Date();
  for (const row of rows) {
    await prisma.source.update({
      where: { id: row.sourceId },
      data: {
        linkStatus: toLinkStatus(row),
        lastLinkCheckedAt: auditedAt,
        lastHttpStatus: row.status,
        finalUrl: row.finalUrl,
      },
    });
  }
  const issues = rows.filter((row) => row.issue);
  console.log(JSON.stringify({
    checked: rows.length,
    reachable: rows.filter((row) => row.reachable).length,
    issueCount: issues.length,
    issues,
  }, null, 2));
  if (issues.length) process.exitCode = 1;
}

main().finally(() => prisma.$disconnect());
