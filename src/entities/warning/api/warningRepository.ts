import 'server-only';
import { cache } from 'react';
import { prisma } from '@/shared/db/prisma';
import type { DestinationCountry } from '@/entities/destination';
import type { Warning } from '../model/types';

export interface DestinationWarnings {
  country: { name: string; slug: string };
  city: { name: string; slug: string } | null;
  region: { name: string; slug: string; type: string } | null;
  warnings: Warning[];
}

export interface SavedWarningRecord {
  warning: Warning;
  country: { name: string; slug: string };
  city: { name: string; slug: string } | null;
  region: { name: string; slug: string; type: string } | null;
}

type PrismaWarning = {
  id: string;
  key: string;
  title: string;
  category: string;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  type: string;
  range: string;
  reason: string;
  alternative: string;
  diffFromKorea: string | null;
  checkNeeded: string | null;
  locations: string[];
  keywords: string[];
  aliases: string[];
  legacyKeys: string[];
  sources: {
    title: string;
    url: string | null;
    checkedAt: Date | null;
    kind: 'OFFICIAL' | 'GOVERNMENT_ADVISORY' | 'COMMUNITY' | 'WIKI' | 'EDITORIAL';
    platform: string | null;
  }[];
  status: 'DRAFT' | 'REVIEWING' | 'VERIFIED' | 'STALE' | 'ARCHIVED';
  verifiedAt: Date | null;
  expiresAt: Date | null;
  reviewedBy: string | null;
  confidence: number | null;
  evidenceLevel: 'OFFICIAL' | 'CORROBORATED' | 'COMMUNITY_SIGNAL';
  contextNotes: string | null;
  sideEffects: string | null;
  counterpoint: string | null;
  independentSourceCount: number;
};

const RISK_LABEL: Record<PrismaWarning['risk'], string> = {
  CRITICAL: '매우 높음',
  HIGH: '높음',
  MEDIUM: '보통',
  INFO: '참고',
};

function toWarning(w: PrismaWarning): Warning {

  return {
    id: w.key,
    title: w.title,
    category: w.category,
    risk: RISK_LABEL[w.risk],
    type: w.type,
    range: w.range,
    reason: w.reason,
    alternative: w.alternative,
    diffFromKorea: w.diffFromKorea,
    checkNeeded: w.checkNeeded,
    locations: w.locations,
    keywords: w.keywords,
    aliases: w.aliases,
    legacyKeys: w.legacyKeys,
    sources: w.sources.map((s) => ({
      title: s.title,
      url: s.url,
      checkedAt: s.checkedAt ? s.checkedAt.toISOString() : null,
      kind: s.kind,
      platform: s.platform,
    })),
    status: w.expiresAt && w.expiresAt < new Date() && w.status === 'VERIFIED' ? 'STALE' : w.status,
    verifiedAt: w.verifiedAt?.toISOString() ?? null,
    expiresAt: w.expiresAt?.toISOString() ?? null,
    reviewedBy: w.reviewedBy,
    confidence: w.confidence,
    evidenceLevel: w.evidenceLevel,
    contextNotes: w.contextNotes,
    sideEffects: w.sideEffects,
    counterpoint: w.counterpoint,
    independentSourceCount: w.independentSourceCount,
  };
}

/** 모든 국가와 도시 목록 (검색 셀렉트 / 정적 경로 생성용) */
export const getCountries = cache(async (): Promise<DestinationCountry[]> => {
  const countries = await prisma.country.findMany({
    orderBy: [{ priorityScore: 'desc' }, { name: 'asc' }],
    include: {
      regions: { orderBy: [{ priorityScore: 'desc' }, { name: 'asc' }] },
      cities: { orderBy: [{ priorityScore: 'desc' }, { name: 'asc' }], include: { region: true } },
    },
  });
  return countries.map((c) => ({
    name: c.name,
    slug: c.slug,
    priorityScore: c.priorityScore,
    contentStatus: c.contentStatus,
    prioritySource: c.prioritySource,
    priorityCheckedAt: c.priorityCheckedAt?.toISOString() ?? null,
    regions: c.regions.map((region) => ({
      name: region.name, slug: region.slug, type: region.type,
      priorityScore: region.priorityScore,
      contentStatus: region.contentStatus,
    })),
    cities: c.cities.map((city) => ({
      name: city.name,
      slug: city.slug,
      priorityScore: city.priorityScore,
      contentStatus: city.contentStatus,
      region: city.region ? { name: city.region.name, slug: city.region.slug, type: city.region.type } : null,
    })),
  }));
});

/**
 * 여행지별 주의사항 조회.
 * - citySlug 없음: 국가 공통 주의사항만
 * - citySlug 있음: 국가 공통 + 해당 도시 특화 주의사항
 * 반환값이 null 이면 해당 국가(또는 도시)가 존재하지 않음.
 */
export const getDestinationWarnings = cache(async (
  countrySlug: string,
  citySlug?: string,
): Promise<DestinationWarnings | null> => {
  const country = await prisma.country.findUnique({
    where: { slug: countrySlug },
    include: { cities: { include: { region: true } } },
  });
  if (!country) return null;

  let city: { id: string; name: string; slug: string; region: { id: string; name: string; slug: string; type: string } | null } | null = null;
  if (citySlug) {
    const found = country.cities.find((c) => c.slug === citySlug);
    if (!found) return null;
    city = { id: found.id, name: found.name, slug: found.slug, region: found.region };
  }

  const warnings = await prisma.warning.findMany({
    where: {
      countryId: country.id,
      archived: false,
      status: { in: ['VERIFIED', 'STALE', 'REVIEWING'] },
      // 도시 지정 시: 국가 공통(cityId null) + 해당 도시. 미지정 시: 국가 공통만.
      ...(city
        ? {
            OR: [
              { cityId: null, regionId: null },
              ...(city.region ? [{ cityId: null, regionId: city.region.id }] : []),
              { cityId: city.id },
            ],
          }
        : { cityId: null, regionId: null }),
    },
    orderBy: { order: 'asc' },
    include: { sources: true },
  });

  return {
    country: { name: country.name, slug: country.slug },
    city: city ? { name: city.name, slug: city.slug } : null,
    region: city?.region ? { name: city.region.name, slug: city.region.slug, type: city.region.type } : null,
    warnings: warnings.map(toWarning),
  };
});

export const getRegionWarnings = cache(async (
  countrySlug: string,
  regionSlug: string,
): Promise<DestinationWarnings | null> => {
  const country = await prisma.country.findUnique({
    where: { slug: countrySlug },
    include: {
      regions: { include: { cities: true } },
    },
  });
  if (!country) return null;

  const region = country.regions.find((item) => item.slug === regionSlug);
  if (!region) return null;

  const warnings = await prisma.warning.findMany({
    where: {
      countryId: country.id,
      archived: false,
      status: { in: ['VERIFIED', 'STALE', 'REVIEWING'] },
      OR: [
        { cityId: null, regionId: null },
        { cityId: null, regionId: region.id },
        { cityId: { in: region.cities.map((city) => city.id) } },
      ],
    },
    orderBy: { order: 'asc' },
    include: { sources: true },
  });

  return {
    country: { name: country.name, slug: country.slug },
    region: { name: region.name, slug: region.slug, type: region.type },
    city: null,
    warnings: warnings.map(toWarning),
  };
});

export const getAllPublicWarnings = cache(async (): Promise<SavedWarningRecord[]> => {
  const warnings = await prisma.warning.findMany({
    where: {
      archived: false,
      status: { in: ['VERIFIED', 'STALE', 'REVIEWING'] },
    },
    orderBy: [{ country: { name: 'asc' } }, { city: { name: 'asc' } }, { order: 'asc' }],
    include: { sources: true, country: true, city: true, region: true },
  });

  return warnings.map((warning) => ({
    warning: toWarning(warning),
    country: { name: warning.country.name, slug: warning.country.slug },
    city: warning.city ? { name: warning.city.name, slug: warning.city.slug } : null,
    region: warning.region ? { name: warning.region.name, slug: warning.region.slug, type: warning.region.type } : null,
  }));
});
