'use client';

import { LOCATIONS } from '@/shared/config/destinations';

interface LocationFilterProps {
  activeLocation: string;
  onSelect: (location: string) => void;
}

export const LocationFilter = ({ activeLocation, onSelect }: LocationFilterProps) => (
  <div className="mb-12">
    <h3 className="font-noto font-bold text-[22px] md:text-[24px] mb-2">지금 어디에 가시나요?</h3>
    <p className="font-noto text-[15px] text-gray-500 mb-5">
      방문하려는 장소를 선택하면 관련 주의사항만 빠르게 확인할 수 있어요.
    </p>
    <div className="flex overflow-x-auto hide-scrollbar gap-3 pb-2 -mx-5 px-5 md:mx-0 md:px-0">
      {LOCATIONS.map((loc) => {
        const Icon = loc.icon;
        const isActive = activeLocation === loc.name;
        return (
          <button
            key={loc.name}
            onClick={() => onSelect(loc.name)}
            className={`flex items-center gap-2 shrink-0 px-4 py-3 rounded-[12px] border transition-all ${
              isActive
                ? 'bg-black text-white border-black shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon size={18} />
            <span className="font-noto text-[15px] font-medium">{loc.name}</span>
          </button>
        );
      })}
    </div>
  </div>
);
