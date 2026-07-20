import Script from 'next/script';
import { env } from '@/shared/config/env';

/** GA4 스크립트 로더. NEXT_PUBLIC_GA_ID 설정 시에만 렌더. */
export const Analytics = () => {
  if (!env.gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${env.gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${env.gaId}');
        `}
      </Script>
    </>
  );
};
