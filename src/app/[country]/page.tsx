import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DestinationView } from '@/views/destination';
import { getDestinationWarnings } from '@/entities/warning/api/warningRepository';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const data = await getDestinationWarnings(country);
  if (!data) return { title: '여행지를 찾을 수 없어요 — 헤도돼?' };

  const name = data.country.name;
  const title = `${name}에서 조심할 행동 — 헤도돼?`;
  const description = `${name} 여행 전 한국인 여행자가 놓치기 쉬운 주의사항 ${data.warnings.length}가지를 중요도순으로 정리했어요.`;
  return {
    title,
    description,
    alternates: { canonical: `/${country}` },
    openGraph: { title, description, url: `/${country}`, type: 'website' },
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { country } = await params;
  const data = await getDestinationWarnings(country);
  if (!data) notFound();

  return (
    <DestinationView
      countrySlug={country}
      citySlug={null}
      warnings={data.warnings}
      countryName={data.country.name}
      cityName={null}
    />
  );
}
