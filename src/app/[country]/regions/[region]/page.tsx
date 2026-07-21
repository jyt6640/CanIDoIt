import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DestinationView } from '@/views/destination';
import { getRegionWarnings } from '@/entities/warning/api/warningRepository';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ country: string; region: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country, region } = await params;
  const data = await getRegionWarnings(country, region);
  if (!data?.region) return { title: '지역을 찾을 수 없어요 — 해도돼?' };
  const name = `${data.country.name} · ${data.region.name}`;
  const title = `${name}에서 조심할 행동 — 해도돼?`;
  const description = `${name} 여행 전 국가 공통, 지역 공통, 주요 도시 주의사항 ${data.warnings.length}가지를 정리했어요.`;
  return {
    title,
    description,
    alternates: { canonical: `/${country}/regions/${region}` },
    openGraph: { title, description, url: `/${country}/regions/${region}`, type: 'website' },
  };
}

export default async function RegionPage({ params }: PageProps) {
  const { country, region } = await params;
  const data = await getRegionWarnings(country, region);
  if (!data?.region) notFound();

  return (
    <DestinationView
      countrySlug={country}
      regionSlug={region}
      citySlug={null}
      warnings={data.warnings}
      countryName={data.country.name}
      regionName={data.region.name}
      cityName={null}
    />
  );
}