import 'server-only';
import { prisma } from '@/shared/db/prisma';
import type { Warning } from '../model/types';

export interface DestinationCity {
  name: string;
  slug: string;
}

export interface DestinationCountry {
  name: string;
  slug: string;
  cities: DestinationCity[];
}

export interface DestinationWarnings {
  country: { name: string; slug: string };
  city: { name: string; slug: string } | null;
  warnings: Warning[];
}

type PrismaWarning = {
  id: string;
  title: string;
  category: string;
  risk: string;
  type: string;
  range: string;
  reason: string;
  alternative: string;
  diffFromKorea: string | null;
  checkNeeded: string | null;
  locations: string;
  sources: { title: string; url: string | null; checkedAt: Date | null }[];
};

function toWarning(w: PrismaWarning): Warning {
  let locations: string[] = [];
  try {
    const parsed = JSON.parse(w.locations);
    if (Array.isArray(parsed)) locations = parsed.filter((x): x is string => typeof x === 'string');
  } catch {
    locations = [];
  }

  return {
    id: w.id,
    title: w.title,
    category: w.category,
    risk: w.risk,
    type: w.type,
    range: w.range,
    reason: w.reason,
    alternative: w.alternative,
    diffFromKorea: w.diffFromKorea,
    checkNeeded: w.checkNeeded,
    locations,
    sources: w.sources.map((s) => ({
      title: s.title,
      url: s.url,
      checkedAt: s.checkedAt ? s.checkedAt.toISOString() : null,
    })),
  };
}

/** 모든 국가와 도시 목록 (검색 셀렉트 / 정적 경로 생성용) */
export async function getCountries(): Promise<DestinationCountry[]> {
  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' },
    include: { cities: { orderBy: { name: 'asc' } } },
  });
  return countries.map((c) => ({
    name: c.name,
    slug: c.slug,
    cities: c.cities.map((city) => ({ name: city.name, slug: city.slug })),
  }));
}

/**
 * 여행지별 주의사항 조회.
 * - citySlug 없음: 국가 공통 주의사항만
 * - citySlug 있음: 국가 공통 + 해당 도시 특화 주의사항
 * 반환값이 null 이면 해당 국가(또는 도시)가 존재하지 않음.
 */
export async function getDestinationWarnings(
  countrySlug: string,
  citySlug?: string,
): Promise<DestinationWarnings | null> {
  const country = await prisma.country.findUnique({
    where: { slug: countrySlug },
    include: { cities: true },
  });
  if (!country) return null;

  let city: { id: string; name: string; slug: string } | null = null;
  if (citySlug) {
    const found = country.cities.find((c) => c.slug === citySlug);
    if (!found) return null;
    city = { id: found.id, name: found.name, slug: found.slug };
  }

  const warnings = await prisma.warning.findMany({
    where: {
      countryId: country.id,
      // 도시 지정 시: 국가 공통(cityId null) + 해당 도시. 미지정 시: 국가 공통만.
      ...(city ? { OR: [{ cityId: null }, { cityId: city.id }] } : { cityId: null }),
    },
    orderBy: { order: 'asc' },
    include: { sources: true },
  });

  return {
    country: { name: country.name, slug: country.slug },
    city: city ? { name: city.name, slug: city.slug } : null,
    warnings: warnings.map(toWarning),
  };
}
