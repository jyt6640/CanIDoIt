import { MapPin } from 'lucide-react';

export const HeroBadge = () => (
  <div className="flex items-center bg-white/40 backdrop-blur-md rounded-full p-1 pr-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/60 w-fit mx-auto mb-[30px]">
    <div className="bg-[#0e1311] text-white rounded-full px-3 py-1 flex items-center gap-1">
      <MapPin size={12} className="text-white" />
      <span className="font-inter font-medium text-[13px]">New</span>
    </div>
    <span className="ml-3 font-noto text-[14px] text-gray-700 font-medium">
      한국인 여행자를 위한 실수 방지 가이드
    </span>
  </div>
);
