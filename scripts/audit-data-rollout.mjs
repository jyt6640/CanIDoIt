import { PrismaClient } from '@prisma/client';
import { OFFICIAL_EXPANSION_V2 } from '../prisma/seed-data/official-expansion-v2.mjs';
import { CULTURAL_SIGNALS_BULK_V2 } from '../prisma/seed-data/cultural-signals-bulk-v2.mjs';

const prisma = new PrismaClient();
const normalize = (value = '') => value.toLocaleLowerCase('ko-KR').replace(/[^\p{L}\p{N}]+/gu, '').trim();

async function main() {
  const expectedOfficialKeys = OFFICIAL_EXPANSION_V2.flatMap((country) => country.warnings.map((warning) => warning.key));
  const expectedCulturalKeys = CULTURAL_SIGNALS_BULK_V2.flatMap((country) => country.warnings.map((warning) => warning.key));
  const expectedKeys = [...expectedOfficialKeys, ...expectedCulturalKeys];

  const [countries, regions, cities, warnings, sources, batchWarnings] = await Promise.all([
    prisma.country.count(),
    prisma.region.count(),
    prisma.city.count(),
    prisma.warning.count({ where: { archived: false } }),
    prisma.source.count(),
    prisma.warning.findMany({
      where: { key: { in: expectedKeys } },
      include: { country: true, city: true, region: true, sources: true },
    }),
  ]);

  const foundKeys = new Set(batchWarnings.map((warning) => warning.key));
  const missingKeys = expectedKeys.filter((key) => !foundKeys.has(key));
  const invalidOfficial = batchWarnings
    .filter((warning) => expectedOfficialKeys.includes(warning.key))
    .filter((warning) =>
      warning.status !== 'VERIFIED' ||
      warning.sources.length === 0 ||
      warning.sources.some((source) => !source.url || !source.checkedAt),
    )
    .map((warning) => warning.key);
  const invalidCultural = batchWarnings
    .filter((warning) => expectedCulturalKeys.includes(warning.key))
    .filter((warning) =>
      warning.status !== 'REVIEWING' ||
      warning.independentSourceCount < 2 ||
      !warning.contextNotes ||
      !warning.sideEffects ||
      !warning.counterpoint,
    )
    .map((warning) => warning.key);

  const allWarnings = await prisma.warning.findMany({
    where: { archived: false },
    select: {
      key: true,
      title: true,
      country: { select: { slug: true } },
      region: { select: { slug: true } },
      city: { select: { slug: true } },
    },
  });
  const fingerprints = new Map();
  for (const warning of allWarnings) {
    const fingerprint = [
      warning.country.slug,
      warning.region?.slug ?? 'no-region',
      warning.city?.slug ?? 'no-city',
      normalize(warning.title),
    ].join('|');
    const list = fingerprints.get(fingerprint) ?? [];
    list.push(warning.key);
    fingerprints.set(fingerprint, list);
  }
  const duplicateGroups = [...fingerprints.entries()]
    .filter(([, keys]) => keys.length > 1)
    .map(([fingerprint, keys]) => ({ fingerprint, keys }));

  const report = {
    totals: { countries, regions, cities, warnings, sources },
    expected: {
      official: expectedOfficialKeys.length,
      cultural: expectedCulturalKeys.length,
      total: expectedKeys.length,
    },
    found: batchWarnings.length,
    missingKeys,
    invalidOfficial,
    invalidCultural,
    duplicateGroups,
  };

  console.log(JSON.stringify(report, null, 2));
  if (missingKeys.length || invalidOfficial.length || invalidCultural.length || duplicateGroups.length) {
    process.exitCode = 1;
  }
}

main().finally(() => prisma.$disconnect());
