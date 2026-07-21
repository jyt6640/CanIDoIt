import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { REGION_CATALOG } from '../prisma/seed-data/regions.mjs';

const prisma = new PrismaClient();
const batchName = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
const ALLOWED_BATCHES = new Map([
  ['official-expansion-v2', ['official-expansion-v2.mjs', 'OFFICIAL_EXPANSION_V2']],
  ['cultural-signals-bulk-v2', ['cultural-signals-bulk-v2.mjs', 'CULTURAL_SIGNALS_BULK_V2']],
]);

if (!batchName || !ALLOWED_BATCHES.has(batchName)) {
  console.error(`Usage: npm run db:batch -- <${[...ALLOWED_BATCHES.keys()].join('|')}> [--dry-run]`);
  process.exit(1);
}

const riskMap = {
  '매우 높음': 'CRITICAL',
  '높음': 'HIGH',
  '보통': 'MEDIUM',
  '참고': 'INFO',
};

const [fileName, exportName] = ALLOWED_BATCHES.get(batchName);
const modulePath = path.resolve('prisma/seed-data', fileName);
const imported = await import(pathToFileURL(modulePath));
const batch = imported[exportName];

if (!Array.isArray(batch)) throw new Error(`Batch export not found: ${exportName}`);

const summary = {
  batch: batchName,
  countries: batch.length,
  cities: batch.reduce((sum, country) => sum + country.cities.length, 0),
  warnings: batch.reduce((sum, country) => sum + country.warnings.length, 0),
  dryRun,
  applied: { countries: 0, regions: 0, cities: 0, warnings: 0, sources: 0 },
};

if (dryRun) {
  console.log(JSON.stringify(summary, null, 2));
  await prisma.$disconnect();
  process.exit(0);
}

if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
  throw new Error('Production batch apply requires ALLOW_PRODUCTION_SEED=true.');
}

for (const countryData of batch) {
  const hasOfficialSource = countryData.warnings.some((warning) =>
    (warning.sources ?? []).some((source) =>
      source.url && ['OFFICIAL', 'GOVERNMENT_ADVISORY'].includes(source.kind ?? 'OFFICIAL'),
    ),
  );
  const country = await prisma.country.upsert({
    where: { slug: countryData.slug },
    update: {
      name: countryData.name,
      contentStatus: hasOfficialSource ? 'AVAILABLE' : 'IN_REVIEW',
    },
    create: {
      name: countryData.name,
      slug: countryData.slug,
      contentStatus: hasOfficialSource ? 'AVAILABLE' : 'IN_REVIEW',
    },
  });
  summary.applied.countries += 1;

  const regionIds = {};
  for (const regionData of REGION_CATALOG[countryData.slug] ?? []) {
    const region = await prisma.region.upsert({
      where: { countryId_slug: { countryId: country.id, slug: regionData.slug } },
      update: {
        name: regionData.name,
        type: regionData.type,
        contentStatus: 'PARTIAL',
      },
      create: {
        name: regionData.name,
        slug: regionData.slug,
        type: regionData.type,
        countryId: country.id,
        contentStatus: 'PARTIAL',
      },
    });
    regionIds[regionData.slug] = region.id;
    summary.applied.regions += 1;
  }

  const cityToRegionSlug = Object.fromEntries(
    (REGION_CATALOG[countryData.slug] ?? []).flatMap((region) =>
      region.cities.map((citySlug) => [citySlug, region.slug]),
    ),
  );
  const cityIds = {};
  for (const cityData of countryData.cities) {
    const regionSlug = cityToRegionSlug[cityData.slug];
    const city = await prisma.city.upsert({
      where: { countryId_slug: { countryId: country.id, slug: cityData.slug } },
      update: {
        name: cityData.name,
        regionId: regionSlug ? regionIds[regionSlug] ?? null : null,
        contentStatus: 'PARTIAL',
      },
      create: {
        name: cityData.name,
        slug: cityData.slug,
        countryId: country.id,
        regionId: regionSlug ? regionIds[regionSlug] ?? null : null,
        contentStatus: 'PARTIAL',
      },
    });
    cityIds[cityData.slug] = city.id;
    summary.applied.cities += 1;
  }

  for (let order = 0; order < countryData.warnings.length; order += 1) {
    const warning = countryData.warnings[order];
    const status = warning.status ?? ((warning.sources ?? []).length > 0 ? 'VERIFIED' : 'REVIEWING');
    const warningData = {
      title: warning.title,
      category: warning.category,
      risk: riskMap[warning.risk],
      type: warning.type,
      range: warning.range,
      reason: warning.reason,
      alternative: warning.alternative,
      diffFromKorea: warning.diffFromKorea ?? null,
      checkNeeded: warning.checkNeeded ?? null,
      locations: warning.locations ?? [],
      keywords: Array.from(new Set([warning.category, warning.type, ...(warning.locations ?? [])])),
      aliases: [warning.title.replace(/(하지|마세요|않도록|금지).*/g, '').trim()].filter(Boolean),
      evidenceLevel: warning.evidenceLevel ?? 'OFFICIAL',
      contextNotes: warning.contextNotes ?? null,
      sideEffects: warning.sideEffects ?? null,
      counterpoint: warning.counterpoint ?? null,
      independentSourceCount: warning.independentSourceCount ?? (warning.sources ?? []).length,
      order: 3000 + order,
      archived: false,
      status,
      verifiedAt: status === 'VERIFIED' ? new Date('2026-07-21T00:00:00.000Z') : null,
      expiresAt: status === 'VERIFIED' ? new Date('2026-10-19T00:00:00.000Z') : null,
      reviewedBy: status === 'VERIFIED' ? 'content-team' : null,
      confidence: warning.confidence ?? ((warning.sources ?? []).some((source) => source.url) ? 90 : 60),
      countryId: country.id,
      cityId: warning.city ? cityIds[warning.city] ?? null : null,
      regionId: warning.region ? regionIds[warning.region] ?? null : null,
    };
    const sources = (warning.sources ?? []).map((source) => ({
      title: source.title,
      url: source.url ?? null,
      checkedAt: source.checkedAt ? new Date(source.checkedAt) : null,
      kind: source.kind ?? 'OFFICIAL',
      platform: source.platform ?? null,
      creatorName: source.creatorName ?? null,
      publishedAt: source.publishedAt ? new Date(source.publishedAt) : null,
      timestampSeconds: source.timestampSeconds ?? null,
      claimSummary: source.claimSummary ?? null,
    }));

    await prisma.warning.upsert({
      where: { key: warning.key },
      update: { ...warningData, sources: { deleteMany: {}, create: sources } },
      create: { key: warning.key, ...warningData, sources: { create: sources } },
    });
    summary.applied.warnings += 1;
    summary.applied.sources += sources.length;
  }
}

console.log(JSON.stringify(summary, null, 2));
await prisma.$disconnect();
