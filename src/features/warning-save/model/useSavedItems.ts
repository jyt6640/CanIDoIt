'use client';

import { useCallback, useState } from 'react';

/** 저장(북마크)한 주의사항 id 집합을 관리 */
export const useSavedItems = () => {
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());

  const toggleSave = useCallback((id: number) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isSaved = useCallback((id: number) => savedItems.has(id), [savedItems]);

  return { savedItems, toggleSave, isSaved };
};
