'use client';

import { useCallback, useRef, useState } from 'react';
import type { Warning } from '@/entities/warning';
import { useSavedItems } from '@/features/warning-save';
import { ShareModal } from '@/features/warning-share';
import { Hero } from '@/widgets/hero';
import { ResultsSection } from '@/widgets/warning-results';
import { WarningDetailModal } from '@/widgets/warning-detail';
import { Footer } from '@/widgets/footer';
import { Toast } from '@/shared/ui/Toast';
import { useToast } from '@/shared/lib/useToast';
import { useBodyScrollLock } from '@/shared/lib/useBodyScrollLock';

export const HomePage = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const { savedItems, toggleSave } = useSavedItems();

  const [selectedWarning, setSelectedWarning] = useState<Warning | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { toast, showToast } = useToast();

  const resultsRef = useRef<HTMLElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(!!selectedWarning || isShareModalOpen);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    // Simulate network delay (prototype)
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }, 600);
  }, []);

  const scrollToSearch = useCallback(() => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleCopyLink = useCallback(() => {
    // In a real app, write to clipboard
    showToast('공유 링크를 복사했어요.');
  }, [showToast]);

  const handleShareFromDetail = useCallback(() => {
    setSelectedWarning(null);
    setTimeout(() => setIsShareModalOpen(true), 300); // wait for close animation
  }, []);

  return (
    <div className="relative min-h-screen bg-light-bg font-noto text-black selection:bg-[#5ae14c]/30">
      <Hero
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onSearch={handleSearch}
        isSearching={isSearching}
        onScrollToSearch={scrollToSearch}
        searchSectionRef={searchSectionRef}
      />

      <ResultsSection
        ref={resultsRef}
        hasSearched={hasSearched}
        selectedCountry={selectedCountry}
        selectedCity={selectedCity}
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
