'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { MapPin, Search } from 'lucide-react';
import type { Warning } from '@/entities/warning';
import { useSavedItems } from '@/features/warning-save';
import { ShareModal } from '@/features/warning-share';
import { ResultsSection } from '@/widgets/warning-results';
import { WarningDetailModal } from '@/widgets/warning-detail';
import { Footer } from '@/widgets/footer';
import { Toast } from '@/shared/ui/Toast';
import { useToast } from '@/shared/lib/useToast';
import { useBodyScrollLock } from '@/shared/lib/useBodyScrollLock';

interface DestinationViewProps {
  warnings: Warning[];
  countryName: string;
  cityName: string | null;
}

export const DestinationView = ({ warnings, countryName, cityName }: DestinationViewProps) => {
  const { savedItems, toggleSave } = useSavedItems();
  const [selectedWarning, setSelectedWarning] = useState<Warning | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toast, showToast } = useToast();

  useBodyScrollLock(!!selectedWarning || isShareModalOpen);

  const handleCopyLink = useCallback(() => {
    showToast('공유 링크를 복사했어요.');
  }, [showToast]);

  const handleShareFromDetail = useCallback(() => {
    setSelectedWarning(null);
    setTimeout(() => setIsShareModalOpen(true), 300);
  }, []);

  const displayLocation = cityName ? `${countryName} · ${cityName}` : countryName;

  return (
    <div className="relative min-h-screen bg-light-bg font-noto text-black selection:bg-[#5ae14c]/30">
      {/* Light Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-5 md:px-[48px] lg:px-[120px] h-16 flex items-center justify-between">
          <Link href="/" className="font-noto font-bold text-xl tracking-[-1px] text-black">
            헤도돼?
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-[13px] font-noto font-medium text-gray-600">
              <MapPin size={14} /> {displayLocation}
            </span>
            <Link
              href="/"
              className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-black text-white hover:bg-gray-800 transition-colors font-noto text-[13px] font-medium"
            >
              <Search size={14} /> 여행지 변경
            </Link>
          </div>
        </div>
      </header>

      <ResultsSection
        warnings={warnings}
        countryName={countryName}
        cityName={cityName}
        savedItems={savedItems}
        onToggleSave={toggleSave}
        onOpenWarning={setSelectedWarning}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      <WarningDetailModal
        item={selectedWarning}
        isOpen={!!selectedWarning}
        onClose={() => setSelectedWarning(null)}
        isSaved={selectedWarning ? savedItems.has(selectedWarning.id) : false}
        onToggleSave={toggleSave}
        onShare={handleShareFromDetail}
      />

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} onCopyLink={handleCopyLink} />

      <Toast message={toast.message} isVisible={toast.visible} />

      <Footer />
    </div>
  );
};
