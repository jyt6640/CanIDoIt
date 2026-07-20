import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '해도돼? 여행 실수 방지 가이드',
    short_name: '해도돼?',
    description: '검증된 여행 주의사항을 저장하고 오프라인에서도 확인하세요.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f8f8',
    theme_color: '#000000',
    lang: 'ko',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}