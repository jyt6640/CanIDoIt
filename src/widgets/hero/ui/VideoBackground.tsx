'use client';

import { useEffect, useRef } from 'react';
import { env } from '@/shared/config/env';
import { usePrefersReducedMotion } from '@/shared/lib/usePrefersReducedMotion';

const VIDEO_SRC = env.heroVideoUrl;

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 모션 최소화: 재생/페이드 없이 첫 프레임을 정적으로 노출
    if (reducedMotion) {
      video.style.opacity = '1';
      video.pause();
      return;
    }

    const DURATION = 250;

    const animateFade = (startOpacity: number, targetOpacity: number, startTime: number) => {
      const updateFade = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;

        if (videoRef.current) {
          videoRef.current.style.opacity = String(currentOpacity);
        }

        if (progress < 1) {
          fadeFrameRef.current = requestAnimationFrame(updateFade);
        }
      };

      if (fadeFrameRef.current) {
        cancelAnimationFrame(fadeFrameRef.current);
      }
      fadeFrameRef.current = requestAnimationFrame(updateFade);
    };

    const revealVideo = () => {
      video.style.opacity = '0';
      animateFade(0, 1, performance.now());
    };

    const startPlayback = async () => {
      try {
        await video.play();
        revealVideo();
      } catch (error) {
        console.warn('Hero video autoplay was blocked.', error);
        video.style.opacity = '1';
      }
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      void startPlayback();
    } else {
      video.addEventListener('canplay', startPlayback, { once: true });
    }

    const resumeOnVisibility = () => {
      if (document.visibilityState === 'visible' && video.paused) void startPlayback();
    };
    document.addEventListener('visibilitychange', resumeOnVisibility);

    return () => {
      if (fadeFrameRef.current) cancelAnimationFrame(fadeFrameRef.current);
      video.removeEventListener('canplay', startPlayback);
      document.removeEventListener('visibilitychange', resumeOnVisibility);
    };
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0">
      {VIDEO_SRC && (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={env.heroPosterUrl || undefined}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[115%] h-[115%] object-cover"
          style={{ objectPosition: 'center top', opacity: reducedMotion ? 1 : 0 }}
          muted
          autoPlay
          loop
          playsInline
          preload={reducedMotion ? 'metadata' : 'auto'}
        />
      )}
      {/* Gradient Overlay for text readability */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.42), rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.5))',
        }}
      />
    </div>
  );
};
