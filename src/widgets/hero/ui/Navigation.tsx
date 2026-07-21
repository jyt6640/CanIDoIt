'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  onScrollToSearch: () => void;
}

const MENU_ITEMS = [
  { label: '데이터 투명성', href: '/transparency' },
  { label: '이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '문의', href: 'https://github.com/jyt6640/CanIDoIt/issues/new' },
];

export const Navigation = ({ onScrollToSearch }: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative z-30 w-full bg-transparent px-5 py-4 md:px-12">
      <div className="mx-auto grid h-[42px] w-full max-w-[1200px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
        <Link
          href="/"
          className="justify-self-start font-noto text-2xl font-bold tracking-[-1.2px] text-black"
        >
          해도돼?
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 justify-self-center font-noto text-[15px] font-medium tracking-tight text-gray-800 md:flex">
          {MENU_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className="transition-colors hover:text-black">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="col-start-3 flex items-center justify-self-end gap-2">
          <Link href="/saved" className="hidden h-[42px] w-[110px] items-center justify-center rounded-full font-noto text-[14px] font-medium text-black transition-colors hover:bg-black/5 md:flex">
            저장한 여행
          </Link>
          <button
            onClick={onScrollToSearch}
            className="flex h-[42px] w-auto items-center justify-center rounded-full bg-black px-6 font-noto text-[14px] font-medium text-white transition-colors hover:bg-gray-800 md:w-[101px]"
          >
            시작하기
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-black transition-colors hover:bg-black/5 md:hidden"
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="absolute left-5 right-5 top-full mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl animate-fade-in md:hidden">
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
