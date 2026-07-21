interface SourceLike {
  title: string;
  url?: string | null;
  checkedAt?: string | null;
  kind?: 'OFFICIAL' | 'GOVERNMENT_ADVISORY' | 'COMMUNITY' | 'WIKI' | 'EDITORIAL' | 'VIDEO_CREATOR';
}

const OFFICIAL_HOSTS = new Set([
  'abf.gov.au',
  'amn.pt',
  'amsterdam.nl',
  'anac.pt',
  'australia.gov.au',
  'barcelona.cat',
  'belastingsdienst.nl',
  'bvg.de',
  'cad.gov.hk',
  'canada.ca',
  'casa.gov.au',
  'cbsa-asfc.gc.ca',
  'city.osaka.lg.jp',
  'customs.gov.hk',
  'customs.govt.nz',
  'doc.govt.nz',
  'germany.travel',
  'gesetze-im-internet.de',
  'government.nl',
  'gov.uk',
  'govt.nz',
  'homeaffairs.gov.au',
  'iamsterdam.com',
  'lba.de',
  'lovebali.baliprov.go.id',
  'metrolisboa.pt',
  'mtr.com.hk',
  'ovpay.nl',
  'parks.canada.ca',
  'prociv.gov.pt',
  'register-drones.caa.co.uk',
  'spain.info',
  'taco.gov.hk',
  'tfl.gov.uk',
  'zoll.de',
]);

const OFFICIAL_SUFFIXES = [
  '.gov',
  '.gov.au',
  '.gov.uk',
  '.govt.nz',
  '.gc.ca',
  '.go.jp',
  '.go.kr',
  '.gouv.fr',
  '.gov.sg',
  '.gov.hk',
  '.lg.jp',
  '.go.id',
];

export type SourceTrustLevel =
  | 'OFFICIAL_DOMAIN'
  | 'HTTPS_SOURCE'
  | 'COMMUNITY'
  | 'WIKI'
  | 'EDITORIAL'
  | 'VIDEO_CREATOR'
  | 'NEEDS_REVIEW'
  | 'INVALID';

export interface SourceTrustSummary {
  level: SourceTrustLevel;
  label: string;
  hostname: string | null;
  isSecure: boolean;
  isStale: boolean;
}

export const getSourceHostname = (url?: string | null): string | null => {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
};

export const isLikelyOfficialHostname = (hostname: string): boolean => {
  if (OFFICIAL_HOSTS.has(hostname)) return true;
  return OFFICIAL_SUFFIXES.some((suffix) =>
    hostname === suffix.slice(1) || hostname.endsWith(suffix),
  );
};

export const evaluateSourceTrust = (
  source: SourceLike,
  now = new Date(),
): SourceTrustSummary => {
  const hostname = getSourceHostname(source.url);
  if (!hostname) {
    return { level: 'INVALID', label: '링크 확인 필요', hostname: null, isSecure: false, isStale: true };
  }

  const parsed = new URL(source.url as string);
  const isSecure = parsed.protocol === 'https:';
  const checkedAt = source.checkedAt ? new Date(source.checkedAt) : null;
  const checkedTime = checkedAt && !Number.isNaN(checkedAt.getTime()) ? checkedAt.getTime() : null;
  const staleAfterMs = 180 * 24 * 60 * 60 * 1000;
  const isStale = checkedTime === null || now.getTime() - checkedTime > staleAfterMs;

  if (source.kind === 'COMMUNITY') {
    return { level: 'COMMUNITY', label: '여행자 후기', hostname, isSecure, isStale };
  }
  if (source.kind === 'WIKI') {
    return { level: 'WIKI', label: '위키 참고', hostname, isSecure, isStale };
  }
  if (source.kind === 'EDITORIAL') {
    return { level: 'EDITORIAL', label: '편집·여행 매체', hostname, isSecure, isStale };
  }
  if (source.kind === 'VIDEO_CREATOR') {
    return { level: 'VIDEO_CREATOR', label: '여행 크리에이터 영상', hostname, isSecure, isStale };
  }

  if (isSecure && isLikelyOfficialHostname(hostname)) {
    return { level: 'OFFICIAL_DOMAIN', label: '공식 도메인', hostname, isSecure, isStale };
  }
  if (isSecure) {
    return { level: 'HTTPS_SOURCE', label: '기관 출처', hostname, isSecure, isStale };
  }
  return { level: 'NEEDS_REVIEW', label: '보안 링크 확인 필요', hostname, isSecure, isStale };
};
