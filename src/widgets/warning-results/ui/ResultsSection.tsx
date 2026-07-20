'use client';

import { useMemo } from 'react';
import { Search, Info, AlertTriangle, Bookmark, Share2, ArrowRight, X } from 'lucide-react';
import { WarningCard, CriticalCard, type Warning } from '@/entities/warning';
import { useWarningFilter, CategoryFilter, LocationFilter } from '@/features/warning-filter';

interface ResultsSectionProps {
  warnings: Warning[];
  countryName: string;
  cityName: string | null;
  savedItems: Set<string>;
  onToggleSave: (id: string) => void;
  onOpenWarning: (item: Warning) => void;
  onOpenShare: () => void;
}

export const ResultsSection = ({
  warnings,
  countryName,
  cityName,
  savedItems,
  onToggleSave,
  onOpenWarning,
  onOpenShare,
}: ResultsSectionProps) => {
  const { activeCategory, setActiveCategory, activeLocation, selectLocation, filteredWarnings, resetFilters } =
    useWarningFilter(warnings);

  const topCriticalWarnings = useMemo(
    () => warnings.filter((item) => item.risk === '매우 높음' || item.risk === '높음').slice(0, 5),
    [warnings],
  );
  const savedWarningsList = useMemo(
    () => warnings.filter((item) => savedItems.has(item.id)),
    [warnings, savedItems],
  );
  // 여행지 데이터에서 직접 도출한 "무심코 하기 쉬운 행동 → 대신 이렇게" 비교
  const comparison = useMemo(() => warnings.filter((w) => w.alternative).slice(0, 5), [warnings]);

  const displayLocation = cityName ? `${countryName} · ${cityName}` : countryName;
  const focusName = cityName || countryName;

  return (
    <section className="bg-[#f8f8f8] py-[64px] md:py-[88px] px-5 md:px-[48px] lg:px-[120px]">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="font-inter font-bold text-[13px] tracking-[2px] text-gray-500 uppercase mb-3">
            Travel Mistake Guide
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
            <div>
              <h2 className="font-noto font-bold text-[32px] md:text-[42px] tracking-tight mb-3">
                <span className="text-black">{displayLocation}</span>에서 조심할 행동
              </h2>
              <p className="font-noto text-[16px] text-gray-600 max-w-[600px] leading-relaxed">
                한국에서는 자연스럽지만 현지에서는 문제가 될 수 있는 행동을
                <br className="hidden md:block" />
                피해가 큰 순서대로 정리했어요.
              </p>
            </div>

            {/* Action stats/buttons */}
            <div className="flex items-center gap-4 shrink-0 bg-white px-5 py-3 rounded-full border border-gray-200 shadow-sm">
              <div className="font-noto text-[14px] font-medium mr-2">
                <span className="text-gray-500">총</span>{' '}
                <span className="text-black font-bold">{warnings.length}</span>
                <span className="text-gray-500">개</span>
              </div>
              <div className="w-[1px] h-4 bg-gray-300"></div>
              <button
                className="flex items-center gap-1.5 text-gray-500 hover:text-black font-noto text-[14px] transition-colors"
                aria-label="저장한 항목 보기"
              >
                <Bookmark size={16} /> <span className="hidden md:inline">저장 {savedItems.size}</span>
              </button>
              <button
                onClick={onOpenShare}
                className="flex items-center gap-1.5 text-gray-500 hover:text-black font-noto text-[14px] transition-colors"
              >
                <Share2 size={16} /> <span className="hidden md:inline">공유</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        {!cityName && (
          <div className="bg-gray-100 rounded-xl p-4 mb-12 flex gap-3 items-start border border-gray-200">
            <Info className="text-gray-500 shrink-0 mt-0.5" size={20} />
            <p className="font-noto text-[14px] text-gray-700 leading-relaxed">
              국가 공통 주의사항을 보여드리고 있어요.
              <br className="md:hidden" /> 도시를 추가하면 지역별 특화 규칙을 함께 확인할 수 있습니다.
            </p>
          </div>
        )}

        {/* Critical Alerts Section */}
        {topCriticalWarnings.length > 0 && (
          <div className="mb-20">
            <div className="mb-6">
              <h3 className="font-noto font-bold text-[22px] md:text-[26px] mb-2 flex items-center gap-2">
                <AlertTriangle className="text-[#c2410c]" /> {focusName} 여행 전 이것만은 기억하세요
              </h3>
              <p className="font-noto text-[15px] text-gray-500">
                실수했을 때 피해가 크거나 여행자가 자주 놓치는 핵심 항목이에요.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {topCriticalWarnings.map((item, idx) => (
                <CriticalCard
                  key={item.id}
                  item={item}
                  index={idx}
                  isSaved={savedItems.has(item.id)}
                  onToggleSave={onToggleSave}
                  onClick={onOpenWarning}
                />
              ))}
            </div>
          </div>
        )}

        {/* Comparison Section (데이터에서 도출) */}
        {comparison.length > 0 && (
          <div className="mb-20 bg-white rounded-[24px] p-6 md:p-10 border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <h3 className="font-noto font-bold text-[20px] md:text-[24px] mb-8 text-center">
              무심코 하기 쉬운 행동, {focusName}에서는 이렇게 바꾸세요
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {comparison.map((w) => (
                <div key={w.id} className="flex items-center justify-between group">
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 font-noto text-[14px] text-gray-500 line-through decoration-gray-300 line-clamp-2">
                    {w.title}
                  </div>
                  <div className="px-3 text-gray-300 group-hover:text-black transition-colors shrink-0">
                    <ArrowRight size={20} />
                  </div>
                  <div className="flex-1 bg-[#5ae14c]/10 rounded-lg p-4 font-noto text-[14px] font-medium text-green-900 border border-[#5ae14c]/20 line-clamp-2">
                    {w.alternative}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Quick View */}
        <LocationFilter activeLocation={activeLocation} onSelect={selectLocation} />

        {/* Category Filter */}
        <CategoryFilter activeCategory={activeCategory} onSelect={setActiveCategory} />

        {/* Warnings Grid */}
        <div className="mb-20">
          <div className="flex justify-between items-end mb-6">
            <h3 className="font-noto font-bold text-[20px] text-gray-800">
              상세 주의사항 <span className="text-gray-400 font-normal ml-1">({filteredWarnings.length})</span>
            </h3>
          </div>

          {filteredWarnings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filteredWarnings.map((item) => (
                <WarningCard
                  key={item.id}
                  item={item}
                  isSaved={savedItems.has(item.id)}
                  onToggleSave={onToggleSave}
                  onClick={onOpenWarning}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <Search size={32} className="mx-auto mb-4 text-gray-300" />
              <p className="font-noto text-[16px] text-gray-600 font-medium">
                선택한 상황에 해당하는 주의사항이 아직 없어요.
              </p>
              <p className="font-noto text-[14px] text-gray-400 mt-2">다른 카테고리나 장소를 선택해보세요.</p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2 rounded-full border border-gray-300 font-noto text-[14px] hover:bg-gray-50"
              >
                필터 초기화
              </button>
            </div>
          )}
        </div>

        {/* Saved Items Section */}
        <div className="border-t border-gray-200 pt-16 mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
              <Bookmark size={20} />
            </div>
            <div>
              <h3 className="font-noto font-bold text-[22px]">꼭 기억할 내용</h3>
              <p className="font-noto text-[14px] text-gray-500 mt-1">저장한 항목 {savedItems.size}개</p>
            </div>
          </div>

          {savedWarningsList.length > 0 ? (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {savedWarningsList.map((item) => (
                  <div
                    key={`saved-${item.id}`}
                    className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onOpenWarning(item)}
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></div>
                      <span className="font-noto text-[15px] text-gray-800 font-medium line-clamp-1">{item.title}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(item.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                      aria-label="저장 취소"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={onOpenShare}
                  className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-noto text-[14px] font-medium hover:bg-gray-800 transition-colors shadow-md"
                >
                  <Share2 size={16} /> 동행자에게 공유하기
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-10 text-center border border-gray-200 border-dashed">
              <p className="font-noto text-[15px] text-gray-500">
                중요한 주의사항 우측 상단의 북마크 아이콘을 눌러 저장하면,
                <br /> 여행 중 빠르게 다시 확인할 수 있어요.
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-[#e7e5e4]/50 rounded-xl p-6 text-center max-w-[800px] mx-auto border border-gray-200">
          <Info className="mx-auto mb-3 text-gray-400" size={24} />
          <p className="font-noto text-[13px] text-gray-600 leading-relaxed">
            <strong>법률과 시설 규칙은 변경될 수 있습니다.</strong>
            <br />
            헤도돼?는 확인되지 않은 지역 정보를 임의로 생성하지 않습니다. 실제 여행 전 공식 기관과 방문 시설의 최신 안내를
            반드시 확인하세요.
          </p>
        </div>
      </div>
    </section>
  );
};
