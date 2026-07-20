'use client';

import { useRef } from 'react';
import { SearchCard } from '@/features/destination-search';
import type { DestinationCountry } from '@/entities/destination';
import { VideoBackground } from './VideoBackground';
import { Navigation } from './Navigation';
import { HeroBadge } from './HeroBadge';

interface HeroProps {
  countries: DestinationCountry[];
}

export const Hero = ({ countries }: HeroProps) => {
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section className="relative w-full h-screen min-h-[700px] flex flex-col">
      <VideoBackground />
      <Navigation onScrollToSearch={scrollToSearch} />

      {/* Hero Content */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center px-5 md:px-[120px] -mt-[50px]">
        <div className="w-full max-w-[1000px] mx-auto text-center">
          <HeroBadge />

          <h1 className="font-noto font-bold text-[46px] leading-[1.1] tracking-[-2px] md:text-[80px] md:leading-[1.05] md:tracking-[-4px] text-black mb-7">
            여행 전에,
            <br />
            실수부터 막으세요.
          </h1>

          <p className="font-noto font-medium text-[16px] md:text-[19px] leading-[1.65] tracking-[-0.4px] text-[#505050] max-w-[760px] mx-auto mb-[42px] px-4">
            나라와 도시만 입력하면 한국인 여행자가 현지에서 모르고 저지르기 쉬운
            <br className="hidden md:block" />
            불법 행동, 시설 규칙, 문화적 금기와 일반 매너를 중요도순으로 알려드려요.
          </p>

          <div ref={searchSectionRef} className="scroll-mt-32">
            <SearchCard countries={countries} />
          </div>
        </div>
      </div>
    </section>
  );
};
