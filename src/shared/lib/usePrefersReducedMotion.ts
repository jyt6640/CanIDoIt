'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/** 사용자의 prefers-reduced-motion 설정을 구독 */
export const usePrefersReducedMotion = (): boolean => {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
