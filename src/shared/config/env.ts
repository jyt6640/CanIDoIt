/**
 * 클라이언트에 노출되는 환경변수 중앙 접근점.
 *
 * NEXT_PUBLIC_* 값은 빌드 시 번들에 인라인되므로 "비밀"이 아니다.
 * (진짜 비밀은 서버 전용 env + API 라우트에서만 다뤄야 한다.)
 * process.env 를 직접 참조해야 Next.js가 정적으로 인라인한다.
 */
export const env = {
  /** 히어로 배경 비디오 URL (없으면 비디오 없이 배경만 렌더) */
  heroVideoUrl:
    process.env.NEXT_PUBLIC_HERO_VIDEO_URL ||
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4',
  /** 히어로 비디오 poster 이미지 URL (로딩 전/모션 최소화 시 폴백) */
  heroPosterUrl: process.env.NEXT_PUBLIC_HERO_POSTER_URL ?? '',
  /** 사이트 기준 URL (메타데이터 canonical, 공유 링크 생성 등) */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'https://can-i-do-it.vercel.app'),
  /** 카카오 JavaScript 앱 키 (없으면 카카오 공유 버튼 비활성) */
  kakaoJsKey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? '',
  /** Google Analytics 4 측정 ID (예: G-XXXXXXX). 없으면 계측 비활성 */
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? '',
} as const;
