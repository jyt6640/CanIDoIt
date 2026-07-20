'use client';

import { useCallback, useEffect, useState } from 'react';
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
import { track } from '@/shared/lib/analytics';

interface DestinationViewProps {
  countrySlug: string;
  citySlug: string | null;
  warnings: Warning[];
  countryName: string;
  cityName: string | null;
}

export const DestinationView = ({
  countrySlug,
  citySlug,
  warnings,
  countryName,
  cityName,
}: DestinationViewProps) => {
  const { savedItems, toggleSave } = useSavedItems();
  const [selectedWarning, setSelectedWarning] = useState<Warning | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<{ title: string; url: string } | null>(null);
  const { toast, showToast } = useToast();

  useBodyScrollLock(!!selectedWarning || isShareModalOpen);

  useEffect(() => {
    track('view_destination', {
      country: countrySlug,
      city: citySlug ?? undefined,
      count: warnings.length,
    });
  }, [countrySlug, citySlug, warnings.length]);

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('warning');
    if (!key) return;
    const warning = warnings.find((item) => item.id === key);
    if (!warning) return;
    const timer = window.setTimeout(() => setSelectedWarning(warning), 0);
    return () => window.clearTimeout(timer);
  }, [warnings]);

  const handleToggleSave = useCallback(
    (id: string) => {
      toggleSave(id);
      track('save_toggle', { id, saved: !savedItems.has(id) });
    },
    [toggleSave, savedItems],
  );

  const handleOpenWarning = useCallback((item: Warning) => {
    setSelectedWarning(item);
    const url = new URL(window.location.href);
    url.searchParams.set('warning', item.id);
    window.history.replaceState(null, '', url);
    track('open_warning', { id: item.id });
  }, []);

  const handleOpenShare = useCallback(() => {
    setShareTarget(null);
    setIsShareModalOpen(true);
    track('share_open', {});
  }, []);

  const handleShareFromDetail = useCallback((item: Warning) => {
    const url = new URL(window.location.href);
    url.searchParams.set('warning', item.id);
    setShareTarget({ title: item.title, url: url.toString() });
    setSelectedWarning(null);
    setTimeout(() => {
      setIsShareModalOpen(true);
      track('share_open', {});
    }, 300);
  }, []);

  const handleCloseWarning = useCallback(() => {
    setSelectedWarning(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('warning');
    window.history.replaceState(null, '', url);
  }, []);

  const displayLocation = cityName ? `${countryName} · ${cityName}` : countryName;

  return (
    <div className="relative min-h-screen bg-light-bg font-noto text-black selection:bg-[#5ae14c]/30">
      {/* Light Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 px-5 backdrop-blur-md md:px-12 lg:px-[120px]">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between">
          <Link href="/" className="font-noto font-bold text-xl tracking-[-1px] text-black">
            해도돼?
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
        onToggleSave={handleToggleSave}
        onOpenWarning={handleOpenWarning}
        onOpenShare={handleOpenShare}
      />

      <WarningDetailModal
        item={selectedWarning}
        isOpen={!!selectedWarning}
        onClose={handleCloseWarning}
        isSaved={selectedWarning ? savedItems.has(selectedWarning.id) : false}
        onToggleSave={handleToggleSave}
        onShare={handleShareFromDetail}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareTitle={shareTarget?.title ?? `${displayLocation}에서 조심할 행동`}
        shareUrl={shareTarget?.url}
        onNotify={showToast}
      />

      <Toast message={toast.message} isVisible={toast.visible} />

      <Footer />
    </div>
  );
};
