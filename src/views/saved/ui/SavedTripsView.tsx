'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Bookmark, Share2, Trash2 } from 'lucide-react';
import type { SavedWarningRecord } from '@/entities/warning/api/warningRepository';
import { WarningCard } from '@/entities/warning';
import { useSavedItems } from '@/features/warning-save';
import { copyToClipboard } from '@/shared/lib/clipboard';

interface SavedTripsViewProps {
  records: SavedWarningRecord[];
}

export const SavedTripsView = ({ records }: SavedTripsViewProps) => {
  const { savedItems, toggleSave } = useSavedItems();
  const searchParams = useSearchParams();
  const sharedIds = new Set((searchParams.get('items') ?? '').split(',').filter(Boolean));
  const isSharedView = sharedIds.size > 0;
  const visibleIds = isSharedView ? sharedIds : savedItems;
  const saved = records.filter(({ warning }) => visibleIds.has(warning.id));
  const grouped = Map.groupBy(saved, ({ country, city }) => `${country.name}|${city?.name ?? '국가 공통'}`);

  return (
    <main className="min-h-screen bg-[#f8f8f8] font-noto">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 md:px-12">
          <Link href="/" className="text-xl font-bold tracking-[-1px]">해도돼?</Link>
          <Link href="/" className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">여행지 찾기</Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1200px] px-5 py-12 md:px-12 md:py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-gray-500">SAVED TRIPS</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">저장한 여행</h1>
            <p className="mt-3 text-gray-600">
              {isSharedView ? `공유받은 주의사항 ${saved.length}개예요.` : `총 ${saved.length}개의 주의사항을 저장했어요.`}
            </p>
          </div>
          {!isSharedView && saved.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const url = new URL('/saved', window.location.origin);
                url.searchParams.set('items', saved.map(({ warning }) => warning.id).join(','));
                void copyToClipboard(url.toString());
              }}
              className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
            >
              <Share2 size={16} /> 목록 공유
            </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <Bookmark className="mx-auto text-gray-300" size={36} />
            <h2 className="mt-4 text-lg font-bold">아직 저장한 주의사항이 없어요.</h2>
            <p className="mt-2 text-sm text-gray-500">여행지 페이지에서 북마크를 눌러 중요한 항목을 저장하세요.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {[...grouped.entries()].map(([group, items]) => {
              const [countryName, cityName] = group.split('|');
              return (
                <section key={group}>
                  <h2 className="mb-5 text-xl font-bold">{countryName} · {cityName}</h2>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {items.map(({ warning }) => (
                      <div key={warning.id} className="relative">
                        <WarningCard
                          item={warning}
                          isSaved
                          onToggleSave={toggleSave}
                          onClick={() => undefined}
                        />
                        {!isSharedView && <button
                          type="button"
                          onClick={() => toggleSave(warning.id)}
                          className="absolute bottom-4 right-4 rounded-full bg-white p-2 text-gray-500 shadow"
                          aria-label="저장 취소"
                        >
                          <Trash2 size={16} />
                        </button>}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};