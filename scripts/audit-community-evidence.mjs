import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const warnings = await prisma.warning.findMany({
    where: {
      archived: false,
      OR: [
        { evidenceLevel: { in: ['CORROBORATED', 'COMMUNITY_SIGNAL'] } },
        { sources: { some: { kind: { in: ['COMMUNITY', 'WIKI', 'EDITORIAL'] } } } },
      ],
    },
    include: { sources: true, country: true, region: true, city: true },
  });

  const issues = warnings.flatMap((warning) => {
    const officialSources = warning.sources.filter((source) =>
      source.kind === 'OFFICIAL' || source.kind === 'GOVERNMENT_ADVISORY',
    );
    const independentUrls = new Set(warning.sources.map((source) => source.url).filter(Boolean));
    const warningIssues = [];

    if (warning.evidenceLevel === 'COMMUNITY_SIGNAL' && warning.status === 'VERIFIED') {
      warningIssues.push('COMMUNITY_SIGNAL cannot be VERIFIED');
    }
    if (warning.status === 'VERIFIED' && officialSources.length === 0) {
      warningIssues.push('VERIFIED warning has no official source');
    }
    if (warning.independentSourceCount < 2 || independentUrls.size < 2) {
      warningIssues.push('fewer than two independent sources');
    }
    if (!warning.contextNotes || !warning.sideEffects || !warning.counterpoint) {
      warningIssues.push('missing context, side effects, or counterpoint');
    }

    return warningIssues.length
      ? [{
          key: warning.key,
          destination: [warning.country.name, warning.region?.name, warning.city?.name].filter(Boolean).join(' · '),
          status: warning.status,
          evidenceLevel: warning.evidenceLevel,
          issues: warningIssues,
        }]
      : [];
  });

  console.log(JSON.stringify({ checked: warnings.length, issueCount: issues.length, issues }, null, 2));
  if (issues.length > 0) process.exitCode = 1;
}

main().finally(() => prisma.$disconnect());
