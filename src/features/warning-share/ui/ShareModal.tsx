'use client';

import { useState } from 'react';
import { X, Copy, Check, MessageCircle } from 'lucide-react';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { isKakaoShareEnabled, shareToKakao } from '@/shared/lib/kakao';
import { useModalA11y } from '@/shared/lib/useModalA11y';
import { track } from '@/shared/lib/analytics';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 공유 대상 제목 (예: "일본 · 오사카에서 조심할 행동") */
  shareTitle: string;
  /** 토스트 표시용 콜백 */
  onNotify: (message: string) => void;
  shareUrl?: string;
}

export const ShareModal = ({ isOpen, onClose, shareTitle, onNotify, shareUrl }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const kakaoEnabled = isKakaoShareEnabled();
  const dialogRef = useModalA11y<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  const getUrl = () => shareUrl ?? (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = async () => {
    const ok = await copyToClipboard(getUrl());
    if (ok) {
      setCopied(true);
      track('share_copy', {});
      onNotify('공유 링크를 복사했어요.');
      setTimeout(() => setCopied(false), 1500);
    } else {
      onNotify('복사에 실패했어요. 주소를 직접 복사해 주세요.');
    }
  };

  const handleKakao = async () => {
    const ok = await shareToKakao({
      title: shareTitle,
      description: '해도돼? — 여행 전 실수 방지 가이드',
      webUrl: getUrl(),
    });
    if (ok) onClose();
    else onNotify('카카오 공유를 사용할 수 없어요.');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="공유"
        className="relative w-full max-w-[360px] bg-white rounded-[20px] p-6 shadow-2xl animate-zoom-in"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800" aria-label="닫기">
          <X size={20} />
        </button>
        <h3 className="font-noto font-bold text-[18px] text-black mb-2">우리 여행에서 조심할 행동</h3>
        <p className="font-noto text-[13px] text-gray-500 mb-6 leading-relaxed">
          동행자가 앱을 설치하지 않아도 링크로 확인할 수 있어요.
        </p>
        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full h-[48px] rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2 font-noto font-medium text-[14px] text-gray-800 transition-colors"
          >
            {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
            {copied ? '복사됨' : '링크 복사'}
          </button>
          {kakaoEnabled && (
            <button
              onClick={handleKakao}
              className="w-full h-[48px] rounded-xl bg-[#FAE100] hover:bg-[#E5CB00] flex items-center justify-center gap-2 font-noto font-medium text-[14px] text-[#371D1E] transition-colors"
            >
              <MessageCircle size={18} className="fill-[#371D1E]" /> 카카오톡으로 공유
            </button>
          )}
        </div>

        {/* 복사가 막힌 환경을 위한 선택 가능한 링크 폴백 */}
        <p
          className="mt-4 px-3 py-2 bg-gray-50 rounded-lg font-inter text-[12px] text-gray-500 break-all select-all cursor-text"
          title="길게 눌러 복사하세요"
        >
          {getUrl()}
        </p>
      </div>
    </div>
  );
};
