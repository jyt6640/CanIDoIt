'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  onScrollToSearch: () => void;
}

const MENU_ITEMS = [
  { label: '이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '문의', href: 'https://github.com/jyt6640/CanIDoIt/issues/new' },
];

export const Navigation = ({ onScrollToSearch }: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative z-30 w-full px-5 md:px-[120px] py-4 flex justify-between items-center bg-transparent">
      <div className="font-noto font-bold text-2xl tracking-[-1.2px] text-black cursor-pointer">해도돼?</div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 font-noto font-medium text-[15px] tracking-tight text-gray-800">
        {MENU_ITEMS.map((item) => (
          <Link key={item.label} href={item.href} className="hover:text-black transition-colors">
            {item.label}
          </Link>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link href="/saved" className="hidden md:flex items-center justify-center w-[110px] h-[42px] rounded-full hover:bg-black/5 transition-colors font-noto text-[14px] font-medium text-black">
          저장한 여행
        </Link>
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
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-5 py-3 text-left font-noto font-medium text-[15px] text-gray-800 hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/saved"
              onClick={() => setMenuOpen(false)}
              className="px-5 py-3 text-left font-noto font-medium text-[15px] text-gray-800 hover:bg-gray-50 transition-colors border-t border-gray-100"
            >
              저장한 여행
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
