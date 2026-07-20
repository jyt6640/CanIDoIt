'use client';

import { CATEGORIES } from '@/shared/config/destinations';

interface CategoryFilterProps {
  activeCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryFilter = ({ activeCategory, onSelect }: CategoryFilterProps) => (
  <div className="sticky top-0 z-30 bg-[#f8f8f8]/90 backdrop-blur-md py-4 mb-8 -mx-5 px-5 md:mx-0 md:px-0 border-b border-gray-200/50">
    <div className="flex items-center gap-4">
      <span className="font-noto text-[13px] font-bold text-gray-400 shrink-0 hidden md:block">필터</span>
      <div className="flex overflow-x-auto hide-scrollbar gap-2 w-full">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`shrink-0 px-4 py-2 rounded-full font-noto text-[14px] transition-colors ${
              activeCategory === cat
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  </div>
);
