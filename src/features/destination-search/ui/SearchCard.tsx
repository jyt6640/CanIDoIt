'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ArrowUpRight, MapPin, Search, CheckCircle2 } from 'lucide-react';
import type { DestinationCountry } from '@/entities/destination';
import { track } from '@/shared/lib/analytics';

interface SearchCardProps {
  countries: DestinationCountry[];
}

const QUICK_PICKS: { label: string; country: string; city?: string }[] = [
  { label: '일본 · 오사카', country: 'japan', city: 'osaka' },
  { label: '태국 · 방콕', country: 'thailand', city: 'bangkok' },
  { label: '싱가포르', country: 'singapore', city: 'singapore' },
];

export const SearchCard = ({ countries }: SearchCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [countrySlug, setCountrySlug] = useState('');
  const [regionSlug, setRegionSlug] = useState('');
  const [citySlug, setCitySlug] = useState('');
  const [question, setQuestion] = useState('');

  const selectedCountry = countries.find((c) => c.slug === countrySlug);
  const visibleCities = regionSlug
    ? selectedCountry?.cities.filter((city) => city.region?.slug === regionSlug) ?? []
    : selectedCountry?.cities ?? [];

  const go = (country: string, city?: string, region?: string) => {
    if (!country) return;
    track('search', { country, city });
    const href = city
      ? `/${country}/${city}`
      : region
        ? `/${country}/regions/${region}`
        : `/${country}`;
    startTransition(() => router.push(href));
  };

  const isSubmitDisabled = !countrySlug;

  return (
    <div className="w-full max-w-[760px] mx-auto bg-black/24 backdrop-blur-xl border border-white/20 rounded-[20px] p-[14px] shadow-2xl">
      {/* Top Info Row */}
      <div className="flex justify-between items-center px-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-white font-noto font-medium text-[13px]">한국인 여행자 기준</span>
          <span className="bg-[#5ae14c]/90 text-black font-inter font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wide">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-1 text-white/90">
          <CheckCircle2 size={12} />
          <span className="font-noto font-medium text-[12px]">출처 기반 주의사항</span>
        </div>
      </div>

      <form
        className="mb-3 flex gap-2 rounded-[14px] bg-white p-3"
        onSubmit={(event) => {
          event.preventDefault();
          const query = question.trim();
          if (!query) return;
          track('behavior_search', { query });
          router.push(`/search?q=${encodeURIComponent(query)}`);
        }}
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="예: 태국에 전자담배 가져가도 돼?"
          aria-label="행동 질문 검색"
          className="min-w-0 flex-1 rounded-lg bg-gray-50 px-4 py-3 font-noto text-[15px] text-black outline-none ring-black/20 focus:ring-2"
        />
        <button type="submit" className="rounded-lg bg-black px-4 text-white" aria-label="행동 검색">
          <Search size={18} />
        </button>
      </form>

      {/* Main Input Area */}
      <div className="bg-white rounded-[14px] p-4 shadow-inner flex flex-col md:flex-row gap-4 items-center relative">
        {/* Country Field */}
        <div className="w-full md:flex-1 relative">
          <label className="block text-[11px] font-noto text-gray-500 font-semibold mb-1 ml-1">나라</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-black font-noto font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all text-[15px]"
              value={countrySlug}
              onChange={(e) => {
                setCountrySlug(e.target.value);
                setRegionSlug('');
                setCitySlug('');
              }}
            >
              <option value="" disabled>
                여행할 나라를 선택하세요
              </option>
              {countries.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Divider (Desktop) */}
        <div className="hidden md:block w-[1px] h-10 bg-gray-200 mt-5"></div>

        {/* Region Field */}
        <div className="w-full md:flex-1 relative">
          <label className="block text-[11px] font-noto text-gray-500 font-semibold mb-1 ml-1">지역</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-black font-noto font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all text-[15px] disabled:opacity-50 disabled:bg-gray-100"
              value={regionSlug}
              onChange={(e) => {
                setRegionSlug(e.target.value);
                setCitySlug('');
              }}
              disabled={!selectedCountry || selectedCountry.regions.length === 0}
            >
              <option value="">지역은 선택사항입니다</option>
              {selectedCountry?.regions.map((region) => (
                <option key={region.slug} value={region.slug}>{region.name}</option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="hidden md:block w-[1px] h-10 bg-gray-200 mt-5"></div>

        {/* City Field */}
        <div className="w-full md:flex-1 relative">
          <label className="block text-[11px] font-noto text-gray-500 font-semibold mb-1 ml-1">도시</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-black font-noto font-medium focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all text-[15px] disabled:opacity-50 disabled:bg-gray-100"
              value={citySlug}
              onChange={(e) => setCitySlug(e.target.value)}
              disabled={!selectedCountry}
            >
              <option value="">도시는 선택사항입니다</option>
              {visibleCities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => go(countrySlug, citySlug || undefined, regionSlug || undefined)}
          disabled={isSubmitDisabled || isPending}
          aria-label="주의사항 확인하기"
          className={`w-full md:w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all mt-4 md:mt-5 ${
            isSubmitDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:scale-105 hover:bg-gray-800 shadow-lg'
          }`}
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <span className="md:hidden font-noto font-medium mr-2">주의사항 확인하기</span>
              <ArrowUpRight size={20} className="hidden md:block" />
            </>
          )}
        </button>
      </div>

      {/* Loading Text Overlay */}
      {isPending && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[14px] flex items-center justify-center z-10 m-[14px] top-8">
          <p className="font-noto font-medium text-black animate-pulse flex items-center gap-2">
            <Search size={16} /> 여행지 주의사항을 정리하고 있어요
          </p>
        </div>
      )}

      {/* Bottom Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-3 px-2 gap-3 md:gap-0">
        <div className="flex flex-wrap gap-2">
          {QUICK_PICKS.map((q) => (
            <button
              key={q.label}
              onClick={() => go(q.country, q.city)}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-[7px] text-white font-noto text-[12px] transition-colors border border-white/10"
            >
              <MapPin size={12} /> {q.label}
            </button>
          ))}
        </div>
        <p className="text-white/80 font-noto text-[11px] md:text-[12px]">
          도시를 입력하지 않으면 국가 공통 정보를 보여드려요.
        </p>
      </div>
    </div>
  );
};
