import { Bookmark, BookmarkCheck } from 'lucide-react';
import { getRiskStyles } from '@/shared/lib/risk';
import type { Warning } from '../model/types';

interface CriticalCardProps {
  item: Warning;
  index: number;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
  onClick: (item: Warning) => void;
}

export const CriticalCard = ({ item, index, isSaved, onToggleSave, onClick }: CriticalCardProps) => {
  const styles = getRiskStyles(item.risk);
  const RiskIcon = styles.icon;

  return (
    <div
      onClick={() => onClick(item)}
      className="bg-white rounded-[18px] p-5 border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:border-gray-200 transition-all cursor-pointer flex gap-4 items-start"
    >
      <div className="w-[32px] h-[32px] shrink-0 bg-black text-white rounded-full flex items-center justify-center font-fustat font-bold text-[16px]">
        {index + 1}
      </div>
      <div className="flex-grow">
        <div className="flex gap-2 items-center mb-2">
          <span className="text-gray-500 font-noto text-[12px] font-medium">{item.category}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className={`inline-flex items-center gap-1 font-noto text-[11px] font-bold tracking-tight ${styles.text}`}>
            <RiskIcon size={12} strokeWidth={2.5} /> {item.risk}
          </span>
        </div>
        <h3 className="font-noto font-bold text-[16px] leading-[1.4] text-black pr-6">{item.title}</h3>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(item.id);
        }}
        className="shrink-0 p-2 text-gray-400 hover:text-black transition-colors"
        aria-label={isSaved ? '저장 취소' : '저장하기'}
      >
        {isSaved ? <BookmarkCheck size={20} className="text-black fill-black" /> : <Bookmark size={20} />}
      </button>
    </div>
  );
};
