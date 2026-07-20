'use client';

import { ChevronDown } from 'lucide-react';

interface NavigationProps {
  onScrollToSearch: () => void;
}

export const Navigation = ({ onScrollToSearch }: NavigationProps) => (
  <nav className="relative z-20 w-full px-5 md:px-[120px] py-4 flex justify-between items-center bg-transparent">
    <div className="font-noto font-bold text-2xl tracking-[-1.2px] text-black cursor-pointer">헤도돼?</div>

    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-8 font-noto font-medium text-[15px] tracking-tight text-gray-800">
      <button className="hover:text-black transition-colors">서비스 소개</button>
      <button className="flex items-center gap-1 hover:text-black transition-colors">
        주의사항 <ChevronDown size={16} />
      </button>
      <button className="hover:text-black transition-colors">사용 방법</button>
      <button className="hover:text-black transition-colors">인기 여행지</button>
      <button className="hover:text-black transition-colors">문의</button>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center gap-2">
      <button className="hidden md:flex items-center justify-center w-[110px] h-[42px] rounded-full hover:bg-black/5 transition-colors font-noto text-[14px] font-medium text-black">
        저장한 여행
      </button>
      <button
        onClick={onScrollToSearch}
        className="flex items-center justify-center w-auto px-6 md:w-[101px] h-[42px] rounded-full bg-black text-white hover:bg-gray-800 transition-colors font-noto text-[14px] font-medium"
      >
        시작하기
      </button>
    </div>
  </nav>
);
