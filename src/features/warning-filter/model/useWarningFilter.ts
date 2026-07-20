'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Warning } from '@/entities/warning';

/** 카테고리·장소 필터 상태와 필터링 결과를 관리 */
export const useWarningFilter = (warnings: Warning[]) => {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [activeLocation, setActiveLocation] = useState('전체');

  const filteredWarnings = useMemo(() => {
    return warnings.filter((item) => {
      const matchCategory = activeCategory === '전체' || item.category === activeCategory;
      const matchLocation =
        activeLocation === '전체' || (item.locations && item.locations.includes(activeLocation));
      return matchCategory && matchLocation;
    });
  }, [warnings, activeCategory, activeLocation]);

  const categories = useMemo(
    () => ['전체', ...Array.from(new Set(warnings.map((item) => item.category)))],
    [warnings],
  );
  const locations = useMemo(
    () => ['전체', ...Array.from(new Set(warnings.flatMap((item) => item.locations)))],
    [warnings],
  );

  /** 장소 선택 시 과도한 필터링을 막기 위해 카테고리를 초기화 */
  const selectLocation = useCallback((location: string) => {
    setActiveLocation(location);
    if (location !== '전체') setActiveCategory('전체');
  }, []);

  const resetFilters = useCallback(() => {
    setActiveCategory('전체');
    setActiveLocation('전체');
  }, []);

  return {
    activeCategory,
    setActiveCategory,
    activeLocation,
    selectLocation,
    filteredWarnings,
    categories,
    locations,
    resetFilters,
  };
};
