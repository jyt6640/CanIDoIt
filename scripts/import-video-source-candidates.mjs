import { PrismaClient } from '@prisma/client';
import { VIDEO_SOURCE_CANDIDATES } from '../prisma/seed-data/video-source-candidates.mjs';

const prisma = new PrismaClient();

async function readOEmbed(url) {
  const endpoint = new URL('https://www.youtube.com/oembed');
  endpoint.searchParams.set('url', url);
  endpoint.searchParams.set('format', 'json');
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`YouTube oEmbed ${response.status}`);
  return response.json();
}

async function main() {
  let imported = 0;
  let failed = 0;

  for (const candidate of VIDEO_SOURCE_CANDIDATES) {
    try {
      const metadata = await readOEmbed(candidate.url);
      await prisma.videoSourceCandidate.upsert({
        where: { url: candidate.url },
        update: {
          countrySlug: candidate.countrySlug ?? null,
          regionSlug: candidate.regionSlug ?? null,
          citySlug: candidate.citySlug ?? null,
          channelName: metadata.author_name,
          title: metadata.title,
          claimSummary: candidate.claimSummary,
          status: 'REVIEWING',
        },
        create: {
          countrySlug: candidate.countrySlug ?? null,
          regionSlug: candidate.regionSlug ?? null,
          citySlug: candidate.citySlug ?? null,
          channelName: metadata.author_name,
          title: metadata.title,
          url: candidate.url,
          claimSummary: candidate.claimSummary,
          status: 'REVIEWING',
        },
      });
      imported += 1;
    } catch (error) {
      failed += 1;
      console.error(JSON.stringify({
        event: 'video_candidate_import_failed',
        url: candidate.url,
        error: error instanceof Error ? error.message : 'unknown',
      }));
    }
  }

  console.log(JSON.stringify({ imported, failed, total: VIDEO_SOURCE_CANDIDATES.length }));
}

main().finally(() => prisma.$disconnect());
