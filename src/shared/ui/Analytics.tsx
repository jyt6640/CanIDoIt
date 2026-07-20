'use client';

import { useState } from 'react';
import Script from 'next/script';
import { env } from '@/shared/config/env';

const CONSENT_KEY = 'hedodwae:analytics-consent';

/** GA4 스크립트 로더. NEXT_PUBLIC_GA_ID 설정 시에만 렌더. */
export const Analytics = () => {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(() => {
    if (typeof window === 'undefined') return null;
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'accepted' || value === 'declined' ? value : null;
  });

  if (!env.gaId) return null;

  const choose = (value: 'accepted' | 'declined') => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  return (
    <>
      {consent === 'accepted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${env.gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${env.gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {consent === null && (
        <aside className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl font-noto">
          <p className="text-sm font-bold text-gray-900">서비스 개선을 위한 익명 통계</p>
          <p className="mt-2 text-xs leading-5 text-gray-600">
            동의한 경우에만 Google Analytics를 불러옵니다. 저장 목록과 행동 질문 내용은 분석 도구로 보내지 않습니다.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => choose('declined')} className="rounded-full px-4 py-2 text-sm text-gray-600">거부</button>
            <button type="button" onClick={() => choose('accepted')} className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">동의</button>
          </div>
        </aside>
      )}
    </>
  );
};
