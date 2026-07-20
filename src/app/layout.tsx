import type { Metadata, Viewport } from 'next';
import { env } from '@/shared/config/env';
import { Analytics } from '@/shared/ui/Analytics';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: '해도돼? — 여행자를 위한 실수 방지 가이드',
  description:
    '나라와 도시만 입력하면 한국인 여행자가 현지에서 모르고 저지르기 쉬운 불법 행동, 시설 규칙, 문화적 금기와 일반 매너를 중요도순으로 알려드려요.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
