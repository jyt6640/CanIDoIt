'use client';

import { useCallback, useEffect, useState } from 'react';

export const SAVED_ITEMS_STORAGE_KEY = 'hedodwae:saved';
const SAVED_CHANGED_EVENT = 'hedodwae:saved-changed';

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * 저장(북마크)한 주의사항 id 집합을 localStorage에 영속화하며 관리.
 * SSR 안전: 초기값은 빈 집합, 마운트 후 하이드레이트.
 */
export const useSavedItems = () => {
  const [savedItems, setSavedItems] = useState<Set<string>>(() => new Set(readStorage()));

  // 다른 탭에서의 변경 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SAVED_ITEMS_STORAGE_KEY) setSavedItems(new Set(readStorage()));
    };
    const onSavedChange = () => setSavedItems(new Set(readStorage()));
    window.addEventListener('storage', onStorage);
    window.addEventListener(SAVED_CHANGED_EVENT, onSavedChange);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(SAVED_CHANGED_EVENT, onSavedChange);
    };
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // 저장 실패(용량 초과/프라이빗 모드 등)는 무시
      }
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => savedItems.has(id), [savedItems]);

  return { savedItems, toggleSave, isSaved };
};

export function replaceSavedItems(ids: string[]) {
  window.localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(SAVED_CHANGED_EVENT));
}
