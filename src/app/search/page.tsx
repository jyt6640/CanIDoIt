import type { Metadata } from 'next';
import { getAllPublicWarnings } from '@/entities/warning/api/warningRepository';
import { BehaviorSearchView } from '@/views/search';

export const metadata: Metadata = {
  title: '이거 해도 돼? 검색 | 해도돼?',
  description: '검증된 여행 주의사항에서 행동 질문을 검색하세요.',
};

export const dynamic = 'force-dynamic';

export default async function SearchPage() {
  const records = await getAllPublicWarnings();
  return <BehaviorSearchView records={records} />;
}