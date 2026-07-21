import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const strongPatterns = [
  /\b\d+[,.]?\d*\s*(유로|달러|원|파운드|바트|위안)\b/i,
  /최대\s*\d+/,
  /벌금\s*\(?\d+/,
  /100%/,
  /전면\s*금지/,
  /절대\s*(삼가|금지|하지)/,
  /무조건/,
  /즉시\s*(체포|구금)/,
];

async function main() {
  const warnings = await prisma.warning.findMany({
    where: { archived: false },
    include: { sources: true, country: true, region: true, city: true },
  });
  const reviewQueue = [];

  for (const warning of warnings) {
    const text = [warning.title, warning.reason, warning.alternative, warning.diffFromKorea ?? ''].join(' ');
    const matchedPatterns = strongPatterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
    const validOfficialSources = warning.sources.filter((source) =>
      Boolean(source.url && source.checkedAt) && ['OFFICIAL', 'GOVERNMENT_ADVISORY'].includes(source.kind),
    );
    const reasons = [];

    if (warning.status === 'VERIFIED' && validOfficialSources.length === 0) {
      reasons.push('VERIFIED_WITHOUT_DATED_OFFICIAL_SOURCE');
    }
    if (matchedPatterns.length > 0 && validOfficialSources.length === 0) {
      reasons.push('STRONG_CLAIM_WITHOUT_OFFICIAL_SOURCE');
    }
    if (warning.status === 'VERIFIED' && (!warning.verifiedAt || !warning.expiresAt)) {
      reasons.push('VERIFIED_DATE_MISSING');
    }
    if (warning.evidenceLevel === 'COMMUNITY_SIGNAL' && warning.status === 'VERIFIED') {
      reasons.push('COMMUNITY_SIGNAL_VERIFIED');
    }
    if (warning.evidenceLevel !== 'OFFICIAL' && (
      !warning.contextNotes || !warning.sideEffects || !warning.counterpoint || warning.independentSourceCount < 2
    )) {
      reasons.push('CONTEXT_EVIDENCE_INCOMPLETE');
    }

    if (reasons.length) {
      reviewQueue.push({
        key: warning.key,
        title: warning.title,
        destination: [warning.country.name, warning.region?.name, warning.city?.name].filter(Boolean).join(' · '),
        status: warning.status,
        matchedPatterns,
        officialSourceCount: validOfficialSources.length,
        reasons,
      });
    }
  }

  console.log(JSON.stringify({ checked: warnings.length, reviewCount: reviewQueue.length, reviewQueue }, null, 2));
}

main().finally(() => prisma.$disconnect());
