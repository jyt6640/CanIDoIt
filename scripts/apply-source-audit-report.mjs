import fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const reportPath = process.argv[2];
if (!reportPath) {
  console.error('Usage: node scripts/apply-source-audit-report.mjs <report.json>');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const allRows = [
  ...(report.issues ?? []),
];
const issueIds = new Set(allRows.map((row) => row.sourceId));
const auditedAt = new Date();

for (const row of allRows) {
  const linkStatus = !row.url
    ? 'ERROR'
    : row.status === 403 || row.status === 429
      ? 'BLOCKED'
      : row.status === 404 || row.status === 410
        ? 'NOT_FOUND'
        : 'ERROR';
  await prisma.source.update({
    where: { id: row.sourceId },
    data: {
      linkStatus,
      lastLinkCheckedAt: auditedAt,
      lastHttpStatus: row.status ?? null,
      finalUrl: row.finalUrl ?? null,
    },
  });
}

const healthySources = await prisma.source.findMany({
  where: { id: { notIn: [...issueIds] } },
  select: { id: true },
});
for (const source of healthySources) {
  await prisma.source.update({
    where: { id: source.id },
    data: { linkStatus: 'HEALTHY', lastLinkCheckedAt: auditedAt },
  });
}

const verified = await prisma.warning.findMany({
  where: { archived: false, status: 'VERIFIED' },
  include: { sources: true },
});
let downgraded = 0;
for (const warning of verified) {
  const official = warning.sources.filter((source) =>
    source.kind === 'OFFICIAL' || source.kind === 'GOVERNMENT_ADVISORY',
  );
  const hasUsableOfficial = official.some((source) =>
    source.url && !['NOT_FOUND', 'ERROR'].includes(source.linkStatus),
  );
  if (!hasUsableOfficial) {
    await prisma.warning.update({
      where: { id: warning.id },
      data: {
        status: 'REVIEWING',
        verifiedAt: null,
        expiresAt: null,
        reviewedBy: null,
        confidence: Math.min(warning.confidence ?? 60, 60),
      },
    });
    downgraded += 1;
  }
}

console.log(JSON.stringify({ issuesApplied: allRows.length, healthyApplied: healthySources.length, downgraded }));
await prisma.$disconnect();