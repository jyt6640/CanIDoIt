'use client';

import { X, Copy, MessageCircle } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyLink: () => void;
}

export const ShareModal = ({ isOpen, onClose, onCopyLink }: ShareModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[360px] bg-white rounded-[20px] p-6 shadow-2xl animate-zoom-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
          <X size={20} />
        </button>
        <h3 className="font-noto font-bold text-[18px] text-black mb-2">우리 여행에서 조심할 행동</h3>
        <p className="font-noto text-[13px] text-gray-500 mb-6 leading-relaxed">
          동행자가 앱을 설치하지 않아도 링크로 확인할 수 있어요.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              onCopyLink();
              onClose();
            }}
            className="w-full h-[48px] rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2 font-noto font-medium text-[14px] text-gray-800 transition-colors"
          >
            <Copy size={18} /> 링크 복사
          </button>
          <button
            onClick={() => {
              onCopyLink();
              onClose();
            }}
            className="w-full h-[48px] rounded-xl bg-[#FAE100] hover:bg-[#E5CB00] flex items-center justify-center gap-2 font-noto font-medium text-[14px] text-[#371D1E] transition-colors"
          >
            <MessageCircle size={18} className="fill-[#371D1E]" /> 카카오톡으로 공유
          </button>
        </div>
      </div>
    </div>
  );
};
