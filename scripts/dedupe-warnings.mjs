import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const normalize = (value = '') => value.toLocaleLowerCase('ko-KR').replace(/[^\p{L}\p{N}]+/gu, '').trim();
const isStableKey = (key, countrySlug) => key.startsWith(`${countrySlug}-`);

async function main() {
  const warnings = await prisma.warning.findMany({
    where: { archived: false },
    include: { country: true, city: true, sources: true },
    orderBy: { createdAt: 'asc' },
  });

  const groups = new Map();
  for (const warning of warnings) {
    const fingerprint = [warning.country.slug, warning.city?.slug ?? 'common', normalize(warning.title)].join('|');
    const group = groups.get(fingerprint) ?? [];
    group.push(warning);
    groups.set(fingerprint, group);
  }

  let merged = 0;
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const canonical = group.find((item) => isStableKey(item.key, item.country.slug)) ?? group[0];
    const duplicates = group.filter((item) => item.id !== canonical.id);
    const legacyKeys = new Set(canonical.legacyKeys);
    const sourceFingerprints = new Set(canonical.sources.map((item) => `${item.title}|${item.url ?? ''}`));

    for (const duplicate of duplicates) {
      legacyKeys.add(duplicate.key);
      for (const legacyKey of duplicate.legacyKeys) legacyKeys.add(legacyKey);
    }

    await prisma.$transaction(async (tx) => {
      for (const duplicate of duplicates) {
        for (const source of duplicate.sources) {
          const fingerprint = `${source.title}|${source.url ?? ''}`;
          if (sourceFingerprints.has(fingerprint)) continue;
          sourceFingerprints.add(fingerprint);
          await tx.source.create({
            data: {
              warningId: canonical.id,
              title: source.title,
              url: source.url,
              checkedAt: source.checkedAt,
            },
          });
        }
      }
      await tx.warning.update({
        where: { id: canonical.id },
        data: { legacyKeys: [...legacyKeys] },
      });
      await tx.warning.deleteMany({ where: { id: { in: duplicates.map((item) => item.id) } } });
    });
    merged += duplicates.length;
  }

  const remaining = await prisma.warning.count({ where: { archived: false } });
  console.log(JSON.stringify({ merged, remaining }));
}

main().finally(() => prisma.$disconnect());
