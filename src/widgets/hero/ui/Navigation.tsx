'use client';

import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

interface NavigationProps {
  onScrollToSearch: () => void;
}

const MENU_ITEMS = ['서비스 소개', '주의사항', '사용 방법', '인기 여행지', '문의'];

export const Navigation = ({ onScrollToSearch }: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative z-30 w-full px-5 md:px-[120px] py-4 flex justify-between items-center bg-transparent">
      <div className="font-noto font-bold text-2xl tracking-[-1.2px] text-black cursor-pointer">해도돼?</div>

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
        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex items-center justify-center w-[42px] h-[42px] rounded-full hover:bg-black/5 transition-colors text-black"
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mx-5 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
          <div className="flex flex-col py-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3 text-left font-noto font-medium text-[15px] text-gray-800 hover:bg-gray-50 transition-colors"
              >
                {item}
              </button>
            ))}
            <button
              onClick={() => setMenuOpen(false)}
              className="px-5 py-3 text-left font-noto font-medium text-[15px] text-gray-800 hover:bg-gray-50 transition-colors border-t border-gray-100"
            >
              저장한 여행
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
