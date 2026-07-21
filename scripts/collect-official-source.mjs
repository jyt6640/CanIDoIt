import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const sourceUrl = process.argv[2];

if (!sourceUrl) {
  console.error('Usage: npm run content:collect -- <official-source-url>');
  process.exit(1);
}

const source = await prisma.officialSource.findUnique({ where: { url: sourceUrl } });
if (!source || !source.enabled) {
  console.error('Enabled OfficialSource not found for URL.');
  process.exit(1);
}

const response = await fetch(source.url, {
  headers: { 'user-agent': 'CanIDoItBot/1.0 (+official travel guidance monitor)' },
  signal: AbortSignal.timeout(20_000),
});
if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

const html = await response.text();
const extractedText = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 250_000);
const contentHash = crypto.createHash('sha256').update(extractedText).digest('hex');
const previous = await prisma.sourceSnapshot.findFirst({
  where: { sourceId: source.id },
  orderBy: { fetchedAt: 'desc' },
});

const snapshot = await prisma.sourceSnapshot.upsert({
  where: { sourceId_contentHash: { sourceId: source.id, contentHash } },
  update: {},
  create: {
    sourceId: source.id,
    contentHash,
    extractedText,
    changed: Boolean(previous && previous.contentHash !== contentHash),
  },
});
await prisma.officialSource.update({ where: { id: source.id }, data: { lastFetchedAt: new Date() } });

console.log(JSON.stringify({ source: source.url, snapshotId: snapshot.id, changed: snapshot.changed }));
await prisma.$disconnect();
