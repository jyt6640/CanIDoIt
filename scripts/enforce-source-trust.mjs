import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const now = new Date();
const staleAfterMs = 180 * 24 * 60 * 60 * 1000;

const isValidHttps = (url) => {
  if (!url) return false;
  try { return new URL(url).protocol === 'https:'; } catch { return false; }
};

async function main() {
  const warnings = await prisma.warning.findMany({
    where: { archived: false, status: { in: ['VERIFIED', 'STALE'] } },
    include: { sources: true },
  });

  let downgradedToReviewing = 0;
  let markedStale = 0;

  for (const warning of warnings) {
    const validSources = warning.sources.filter((source) => isValidHttps(source.url));
    if (validSources.length === 0) {
      await prisma.warning.update({
        where: { id: warning.id },
        data: { status: 'REVIEWING', verifiedAt: null, expiresAt: null, confidence: Math.min(warning.confidence ?? 60, 60) },
      });
      downgradedToReviewing += 1;
      continue;
    }

    const allStale = validSources.every((source) => {
      const checkedAt = source.checkedAt?.getTime() ?? null;
      return checkedAt === null || now.getTime() - checkedAt > staleAfterMs;
    });

    if (allStale && warning.status !== 'STALE') {
      await prisma.warning.update({ where: { id: warning.id }, data: { status: 'STALE' } });
      markedStale += 1;
    }
  }

  console.log(JSON.stringify({ checked: warnings.length, downgradedToReviewing, markedStale }));
}

main().finally(() => prisma.$disconnect());
