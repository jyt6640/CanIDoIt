'use client';

import {
  X,
  AlertCircle,
  CheckCircle2,
  Info,
  Bookmark,
  BookmarkCheck,
  Share2,
} from 'lucide-react';
import { getRiskStyles } from '@/shared/lib/risk';
import type { Warning } from '@/entities/warning';

interface WarningDetailModalProps {
  item: Warning | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onShare: (item: Warning) => void;
}

export const WarningDetailModal = ({
  item,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onShare,
}: WarningDetailModalProps) => {
  if (!isOpen || !item) return null;
  const styles = getRiskStyles(item.risk);
  const RiskIcon = styles.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-[600px] bg-white rounded-t-[24px] md:rounded-[24px] shadow-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-gray-100 shrink-0">
          <div className="flex gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-noto text-[12px] font-bold tracking-tight ${styles.bg} ${styles.text} ${styles.border} border`}
            >
              <RiskIcon size={14} strokeWidth={2.5} /> {item.risk}
            </span>
            <span className="px-2.5 py-1 rounded-md font-noto text-[12px] font-medium bg-gray-100 text-gray-600">
              {item.category}
            </span>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 md:p-8 overflow-y-auto pb-[100px]">
          <div className="mb-8">
            <h4 className="font-noto text-[14px] font-bold text-red-500 mb-2 flex items-center gap-1.5">
              <X size={16} strokeWidth={3} /> 하지 말아야 할 행동
            </h4>
            <h2 className="font-noto text-[22px] md:text-[26px] font-bold text-black leading-[1.35] tracking-tight">
              {item.title}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-[16px] p-5">
              <h4 className="font-noto text-[14px] font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                <AlertCircle size={16} /> 왜 조심해야 하나요?
              </h4>
              <p className="font-noto text-[15px] text-gray-700 leading-[1.6]">{item.reason}</p>
            </div>

            <div className="bg-[#5ae14c]/10 border border-[#5ae14c]/20 rounded-[16px] p-5">
              <h4 className="font-noto text-[14px] font-bold text-green-700 mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> 대신 이렇게 하세요
              </h4>
              <p className="font-noto text-[15px] text-gray-800 leading-[1.6] font-medium">{item.alternative}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-noto text-[12px] text-gray-500 mb-1">구분</h4>
                <p className="font-noto text-[14px] font-medium text-gray-900">{item.type}</p>
              </div>
              <div>
                <h4 className="font-noto text-[12px] text-gray-500 mb-1">적용 범위</h4>
                <p className="font-noto text-[14px] font-medium text-gray-900">{item.range}</p>
              </div>
            </div>

            {item.diffFromKorea && (
              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-noto text-[14px] font-bold text-gray-800 mb-2">한국과 다른 점</h4>
                <p className="font-noto text-[14px] text-gray-600 leading-[1.6]">{item.diffFromKorea}</p>
              </div>
            )}

            {item.checkNeeded && (
              <div className="flex gap-3 bg-blue-50/50 p-4 rounded-[12px] text-blue-800">
                <Info size={18} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-noto text-[13px] font-bold mb-1">확인 필요</h4>
                  <p className="font-noto text-[13px] leading-[1.5]">{item.checkNeeded}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-white border-t border-gray-100 flex gap-3 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => onToggleSave(item.id)}
            className={`flex-1 h-[52px] rounded-xl flex items-center justify-center gap-2 font-noto font-medium text-[15px] transition-colors ${
              isSaved ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
            {isSaved ? '저장됨' : '저장하기'}
          </button>
          <button
            onClick={() => onShare(item)}
            className="flex-1 h-[52px] rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center justify-center gap-2 font-noto font-medium text-[15px] transition-colors"
          >
            <Share2 size={20} />
            공유
          </button>
        </div>
      </div>
    </div>
  );
};
