/**
 * 클라이언트에 노출되는 환경변수 중앙 접근점.
 *
 * NEXT_PUBLIC_* 값은 빌드 시 번들에 인라인되므로 "비밀"이 아니다.
 * (진짜 비밀은 서버 전용 env + API 라우트에서만 다뤄야 한다.)
 * process.env 를 직접 참조해야 Next.js가 정적으로 인라인한다.
 */
export const env = {
  /** 히어로 배경 비디오 URL (없으면 비디오 없이 배경만 렌더) */
  heroVideoUrl: process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? '',
  /** 사이트 기준 URL (메타데이터 canonical, 공유 링크 생성 등) */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const;
