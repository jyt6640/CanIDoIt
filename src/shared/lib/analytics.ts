'use client';

import { env } from '@/shared/config/env';

type AnalyticsEvent =
  | { name: 'search'; params: { country: string; city?: string } }
  | { name: 'view_destination'; params: { country: string; city?: string; count: number } }
  | { name: 'save_toggle'; params: { id: string; saved: boolean } }
  | { name: 'open_warning'; params: { id: string } }
  | { name: 'share_open'; params: Record<string, never> }
  | { name: 'share_copy'; params: Record<string, never> }
  | { name: 'behavior_search'; params: { query: string } };

type Gtag = (command: string, action: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

export const isAnalyticsEnabled = () => Boolean(env.gaId);

/** 이벤트 계측. GA 미설정 시 개발 콘솔에만 기록하고 no-op. */
export function track<E extends AnalyticsEvent>(name: E['name'], params: E['params']): void {
  if (typeof window === 'undefined') return;

  if (env.gaId && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', name, params);
  }
}
