import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/shared/admin/auth';

export const metadata: Metadata = {
  title: '관리자 로그인 | 해도돼?',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getAdminSession();
  if (session) redirect('/admin');
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f4f6] px-5 font-noto">
      <section className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold tracking-[0.18em] text-gray-400">ADMIN CONSOLE</p>
        <h1 className="mt-3 text-3xl font-bold">관리자 로그인</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          검수, 출처 수집, 크롤링 작업은 인증된 운영자만 실행할 수 있습니다.
        </p>

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            아이디 또는 비밀번호를 확인해 주세요.
          </p>
        )}

        <form action="/api/admin/session" method="post" className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700">아이디</span>
            <input
              name="username"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none ring-black/20 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-700">비밀번호</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none ring-black/20 focus:ring-2"
            />
          </label>
          <button type="submit" className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white">
            로그인
          </button>
        </form>
      </section>
    </main>
  );
}
