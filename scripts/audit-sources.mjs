import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const now = new Date();
const staleAfterMs = 180 * 24 * 60 * 60 * 1000;
const officialSuffixes = ['.gov', '.gov.au', '.gov.uk', '.govt.nz', '.gc.ca', '.go.jp', '.go.kr', '.gouv.fr', '.gov.sg', '.gov.hk', '.lg.jp', '.go.id'];
const officialHosts = new Set([
  'abf.gov.au', 'amn.pt', 'amsterdam.nl', 'anac.pt', 'australia.gov.au',
  'barcelona.cat', 'belastingdienst.nl', 'bvg.de', 'cad.gov.hk', 'canada.ca',
  'casa.gov.au', 'cbsa-asfc.gc.ca', 'city.osaka.lg.jp', 'customs.gov.hk',
  'customs.govt.nz', 'doc.govt.nz', 'germany.travel', 'gesetze-im-internet.de',
  'gov.uk', 'government.nl', 'govt.nz', 'homeaffairs.gov.au', 'iamsterdam.com',
  'lba.de', 'lovebali.baliprov.go.id', 'metrolisboa.pt', 'mtr.com.hk', 'ovpay.nl',
  'parks.canada.ca', 'prociv.gov.pt', 'register-drones.caa.co.uk', 'spain.info',
  'taco.gov.hk', 'tfl.gov.uk', 'zoll.de',
]);

const hostnameOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase(); } catch { return null; }
};
const likelyOfficial = (hostname) => officialHosts.has(hostname) || officialSuffixes.some((suffix) => hostname === suffix.slice(1) || hostname.endsWith(suffix));

async function main() {
  const sources = await prisma.source.findMany({
    include: { warning: { select: { key: true, title: true, status: true } } },
    orderBy: { checkedAt: 'asc' },
  });

  const report = sources.map((source) => {
    const hostname = hostnameOf(source.url);
    const checkedAt = source.checkedAt?.getTime() ?? null;
    return {
      warningKey: source.warning.key,
      warningTitle: source.warning.title,
      warningStatus: source.warning.status,
      sourceTitle: source.title,
      url: source.url,
      hostname,
      validUrl: Boolean(hostname),
      secure: Boolean(source.url?.startsWith('https://')),
      likelyOfficial: hostname ? likelyOfficial(hostname) : false,
      stale: checkedAt === null || now.getTime() - checkedAt > staleAfterMs,
      checkedAt: source.checkedAt?.toISOString() ?? null,
    };
  });

  const summary = {
    total: report.length,
    invalidUrl: report.filter((item) => !item.validUrl).length,
    insecure: report.filter((item) => item.validUrl && !item.secure).length,
    officialDomain: report.filter((item) => item.likelyOfficial).length,
    needsOfficialReview: report.filter((item) => item.validUrl && !item.likelyOfficial).length,
    stale: report.filter((item) => item.stale).length,
  };

  console.log(JSON.stringify({ summary, issues: report.filter((item) => !item.validUrl || !item.secure || !item.likelyOfficial || item.stale) }, null, 2));
}

main().finally(() => prisma.$disconnect());
