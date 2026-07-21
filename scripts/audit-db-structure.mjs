import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const normalize = (value = '') => value.toLocaleLowerCase('ko-KR').replace(/[^\p{L}\p{N}]+/gu, '').trim();

async function main() {
  const [countries, regions, cities, warnings] = await Promise.all([
    prisma.country.findMany({ select: { id: true, slug: true } }),
    prisma.region.findMany({ select: { id: true, slug: true, countryId: true } }),
    prisma.city.findMany({ select: { id: true, slug: true, countryId: true, regionId: true } }),
    prisma.warning.findMany({
      where: { archived: false },
      include: { country: true, region: true, city: true, sources: true },
    }),
  ]);

  const issues = [];
  const keyCounts = new Map();
  const fingerprints = new Map();
  const countryIds = new Set(countries.map((item) => item.id));
  const regionById = new Map(regions.map((item) => [item.id, item]));
  const cityById = new Map(cities.map((item) => [item.id, item]));

  for (const warning of warnings) {
    keyCounts.set(warning.key, (keyCounts.get(warning.key) ?? 0) + 1);
    if (!warning.key.startsWith(`${warning.country.slug}-`)) {
      issues.push({ key: warning.key, type: 'KEY_COUNTRY_PREFIX_MISMATCH' });
    }
    if (!warning.title.trim() || !warning.reason.trim() || !warning.alternative.trim() || !warning.range.trim()) {
      issues.push({ key: warning.key, type: 'MISSING_REQUIRED_TEXT' });
    }
    if (!countryIds.has(warning.countryId)) {
      issues.push({ key: warning.key, type: 'ORPHAN_COUNTRY' });
    }
    if (warning.regionId) {
      const region = regionById.get(warning.regionId);
      if (!region || region.countryId !== warning.countryId) {
        issues.push({ key: warning.key, type: 'REGION_COUNTRY_MISMATCH' });
      }
    }
    if (warning.cityId) {
      const city = cityById.get(warning.cityId);
      if (!city || city.countryId !== warning.countryId) {
        issues.push({ key: warning.key, type: 'CITY_COUNTRY_MISMATCH' });
      }
      if (warning.regionId && city?.regionId && city.regionId !== warning.regionId) {
        issues.push({ key: warning.key, type: 'CITY_REGION_MISMATCH' });
      }
    }
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

  for (const [key, count] of keyCounts) {
    if (count > 1) issues.push({ key, type: 'DUPLICATE_KEY', count });
  }
  for (const [fingerprint, keys] of fingerprints) {
    if (keys.length > 1) issues.push({ fingerprint, keys, type: 'DUPLICATE_LOCATION_TITLE' });
  }

  console.log(JSON.stringify({
    totals: { countries: countries.length, regions: regions.length, cities: cities.length, warnings: warnings.length },
    issueCount: issues.length,
    issues,
  }, null, 2));
  if (issues.length) process.exitCode = 1;
}

main().finally(() => prisma.$disconnect());
