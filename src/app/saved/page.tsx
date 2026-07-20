import type { Metadata } from 'next';
import { getAllPublicWarnings } from '@/entities/warning/api/warningRepository';
import { SavedTripsView } from '@/views/saved';

export const metadata: Metadata = {
  title: '저장한 여행 | 해도돼?',
  description: '여행지별로 저장한 주의사항을 한곳에서 확인하세요.',
};

export const dynamic = 'force-dynamic';

export default async function SavedPage() {
  const records = await getAllPublicWarnings();
  return <SavedTripsView records={records} />;
}