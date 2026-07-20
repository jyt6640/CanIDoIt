'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { SavedWarningRecord } from '@/entities/warning/api/warningRepository';

interface BehaviorSearchViewProps {
  records: SavedWarningRecord[];
}

const normalize = (value: string) => value.toLocaleLowerCase('ko-KR').replace(/\s+/g, ' ').trim();

export const BehaviorSearchView = ({ records }: BehaviorSearchViewProps) => {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const normalizedQuery = normalize(query);

  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    const terms = normalizedQuery.split(' ').filter((term) => term.length > 1);
    return records.filter(({ warning, country, city }) => {
      const haystack = normalize([
        country.name,
        city?.name ?? '',
        warning.title,
        warning.reason,
        warning.alternative,
        warning.category,
        warning.type,
        ...warning.locations,
        ...(warning.keywords ?? []),
        ...(warning.aliases ?? []),
      ].join(' '));
      return terms.every((term) => haystack.includes(term));
    });
  }, [normalizedQuery, records]);

  return (
    <main className="min-h-screen bg-[#f8f8f8] font-noto">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-5">
          <Link href="/" className="text-xl font-bold">해도돼?</Link>
          <Link href="/saved" className="text-sm font-medium">저장한 여행</Link>
        </div>
      </header>
      <section className="mx-auto max-w-[900px] px-5 py-12">
        <h1 className="text-3xl font-bold md:text-4xl">이거 해도 돼?</h1>
        <p className="mt-3 text-gray-600">검증된 주의사항 안에서만 답을 찾아요.</p>
        <div className="mt-8 flex gap-2 rounded-2xl bg-white p-3 shadow-sm">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="일본 온천에 타투 있어도 돼?"
            className="min-w-0 flex-1 px-3 py-3 text-base outline-none"
          />
          <button type="button" className="rounded-xl bg-black px-4 text-white" aria-label="검색">
            <Search size={18} />
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {normalizedQuery && results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
              검증된 데이터에서 일치하는 결과를 찾지 못했어요.
            </div>
          )}
          {results.map(({ warning, country, city }) => {
            const href = `/${country.slug}${city ? `/${city.slug}` : ''}?warning=${warning.id}`;
            return (
              <Link key={warning.id} href={href} className="block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5">
                <p className="text-xs font-bold text-gray-500">{country.name}{city ? ` · ${city.name}` : ''}</p>
                <h2 className="mt-2 text-lg font-bold">{warning.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">{warning.reason}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
};