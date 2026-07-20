'use client';

import { useEffect, useRef } from 'react';
import { env } from '@/shared/config/env';

const VIDEO_SRC = env.heroVideoUrl;

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const DURATION = 250; // Fade duration in ms
    const THRESHOLD = 0.55; // Time from end to start fade out

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

    const handleLoadedData = () => {
      video.style.opacity = '0';
      animateFade(0, 1, performance.now());
    };

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime;
      if (timeLeft <= THRESHOLD && !fadingOutRef.current && video.duration > 0) {
        fadingOutRef.current = true;
        const currentOpacity = parseFloat(video.style.opacity || '1');
        animateFade(currentOpacity, 0, performance.now());
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        fadingOutRef.current = false;

        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              animateFade(0, 1, performance.now());
            })
            .catch((err) => console.error('Video play failed:', err));
        }
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    video.play().catch((e) => console.log('Auto-play blocked:', e));

    return () => {
      if (fadeFrameRef.current) cancelAnimationFrame(fadeFrameRef.current);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0">
      {VIDEO_SRC && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[115%] h-[115%] object-cover"
          style={{ objectPosition: 'center top', opacity: 0 }}
          muted
          playsInline
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
