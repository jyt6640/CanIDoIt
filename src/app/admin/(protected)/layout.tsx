import Link from 'next/link';
import type { Metadata } from 'next';
import { Database, FileCheck2, Gauge, Globe2, History, LogOut, Video } from 'lucide-react';
import { requireAdmin } from '@/shared/admin/auth';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: '관리자 콘솔 | 해도돼?',
  robots: { index: false, follow: false },
};

const NAVIGATION = [
  { href: '/admin', label: '대시보드', icon: Gauge },
  { href: '/admin/review', label: '검수 큐', icon: FileCheck2 },
  { href: '/admin/sources', label: '공식 출처', icon: Globe2 },
  { href: '/admin/drafts', label: 'AI 초안', icon: Database },
  { href: '/admin/videos', label: '영상 후보', icon: Video },
  { href: '/admin/jobs', label: '작업 이력', icon: History },
];

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f4f5f7] font-noto text-gray-950">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-lg font-bold">해도돼? Admin</Link>
            <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 md:inline">
              {session.sub}
            </span>
          </div>
          <form action="/api/admin/logout" method="post">
            <button type="submit" className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">
              <LogOut size={15} /> 로그아웃
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-5 py-6 md:grid-cols-[220px_minmax(0,1fr)] md:px-8">
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
          <nav className="grid grid-cols-2 gap-1 md:grid-cols-1">
            {NAVIGATION.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black">
                <Icon size={16} /> {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
