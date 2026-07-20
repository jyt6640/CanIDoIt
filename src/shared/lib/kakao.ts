import { env } from '@/shared/config/env';

interface KakaoShareParams {
  title: string;
  description: string;
  webUrl: string;
}

interface KakaoSDK {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: {
    sendDefault: (settings: unknown) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

const SDK_SRC = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';

let loadPromise: Promise<KakaoSDK | null> | null = null;

function loadSdk(): Promise<KakaoSDK | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.Kakao) return Promise.resolve(window.Kakao);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<KakaoSDK | null>((resolve) => {
    const script = document.createElement('script');
    script.src = SDK_SRC;
    script.async = true;
    script.onload = () => resolve(window.Kakao ?? null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return loadPromise;
}

/** 카카오 공유 사용 가능 여부 (JS 키 설정 시에만) */
export const isKakaoShareEnabled = () => Boolean(env.kakaoJsKey);

/** 카카오톡 공유 실행. 성공 시 true. */
export async function shareToKakao(params: KakaoShareParams): Promise<boolean> {
  if (!env.kakaoJsKey) return false;
  const Kakao = await loadSdk();
  if (!Kakao) return false;

  if (!Kakao.isInitialized()) Kakao.init(env.kakaoJsKey);

  try {
    Kakao.Share.sendDefault({
      objectType: 'text',
      text: `${params.title}\n${params.description}`,
      link: { webUrl: params.webUrl, mobileWebUrl: params.webUrl },
    });
    return true;
  } catch {
    return false;
  }
}
