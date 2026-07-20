'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'hedodwae:saved';

function readStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
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
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  // 마운트 시 localStorage에서 로드
  useEffect(() => {
    setSavedItems(new Set(readStorage()));
    setHydrated(true);
  }, []);

  // 변경 시 저장 (하이드레이트 이후에만 — 초기 빈 값으로 덮어쓰기 방지)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedItems]));
    } catch {
      // 저장 실패(용량 초과/프라이빗 모드 등)는 무시
    }
  }, [savedItems, hydrated]);

  // 다른 탭에서의 변경 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSavedItems(new Set(readStorage()));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleSave = useCallback((id: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isSaved = useCallback((id: string) => savedItems.has(id), [savedItems]);

  return { savedItems, toggleSave, isSaved };
};
