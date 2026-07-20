'use client';

import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('페이지 렌더링 오류', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-light-bg px-5 font-noto">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-gray-500">잠시 문제가 생겼어요</p>
        <h1 className="mt-2 text-2xl font-bold">여행 정보를 불러오지 못했어요.</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          네트워크나 데이터베이스 연결을 확인한 뒤 다시 시도해 주세요.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
        >
          다시 시도
        </button>
      </section>
    </main>
  );
}