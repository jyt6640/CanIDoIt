import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function readOEmbed(url) {
  const endpoint = new URL('https://www.youtube.com/oembed');
  endpoint.searchParams.set('url', url);
  endpoint.searchParams.set('format', 'json');
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) return null;
  return response.json();
}

async function main() {
  const candidates = await prisma.videoSourceCandidate.findMany({
    where: { status: { in: ['REVIEWING', 'VERIFIED'] } },
    orderBy: { discoveredAt: 'asc' },
  });

  const issues = [];
  for (const candidate of candidates) {
    const metadata = await readOEmbed(candidate.url).catch(() => null);
    if (!metadata) {
      issues.push({ id: candidate.id, url: candidate.url, issue: 'video unavailable or private' });
      continue;
    }
    if (metadata.author_name !== candidate.channelName || metadata.title !== candidate.title) {
      issues.push({
        id: candidate.id,
        url: candidate.url,
        issue: 'metadata changed',
        stored: { channelName: candidate.channelName, title: candidate.title },
        current: { channelName: metadata.author_name, title: metadata.title },
      });
    }
    if (!candidate.claimSummary.trim()) {
      issues.push({ id: candidate.id, url: candidate.url, issue: 'missing claim summary' });
    }
    if (candidate.status === 'VERIFIED') {
      issues.push({ id: candidate.id, url: candidate.url, issue: 'video candidate cannot be VERIFIED directly' });
    }
  }

  console.log(JSON.stringify({ checked: candidates.length, issueCount: issues.length, issues }, null, 2));
  if (issues.length > 0) process.exitCode = 1;
}

main().finally(() => prisma.$disconnect());
