import Link from 'next/link';
import type { Prisma, WarningStatus } from '@prisma/client';
import { Search } from 'lucide-react';
import { prisma } from '@/shared/db/prisma';
import { WARNING_STATUSES } from '@/shared/admin/validation';

const PAGE_SIZE = 30;
const STATUS_LABELS: Record<WarningStatus, string> = {
  DRAFT: '초안',
  REVIEWING: '검수 중',
  VERIFIED: '검수 완료',
  STALE: '재검토 필요',
  ARCHIVED: '보관됨',
};

export default async function AdminReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const status = WARNING_STATUSES.includes(params.status as WarningStatus)
    ? (params.status as WarningStatus)
    : 'REVIEWING';
  const page = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);

  const where: Prisma.WarningWhereInput = {
    status,
    ...(query
      ? {
          OR: [
            { key: { contains: query, mode: 'insensitive' } },
            { title: { contains: query, mode: 'insensitive' } },
            { country: { name: { contains: query, mode: 'insensitive' } } },
            { region: { name: { contains: query, mode: 'insensitive' } } },
            { city: { name: { contains: query, mode: 'insensitive' } } },
          ],
        }
      : {}),
  };

  const [warnings, total, statusCounts] = await Promise.all([
    prisma.warning.findMany({
      where,
      include: {
        country: true,
        region: true,
        city: true,
        sources: { select: { id: true, url: true, kind: true, checkedAt: true, linkStatus: true } },
      },
      orderBy: [{ updatedAt: 'desc' }, { title: 'asc' }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.warning.count({ where }),
    prisma.warning.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const counts = new Map(statusCounts.map((item) => [item.status, item._count._all]));

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-bold tracking-[0.16em] text-gray-400">CONTENT REVIEW</p>
        <h1 className="mt-2 text-3xl font-bold">Warning 검수 큐</h1>
        <p className="mt-2 text-sm text-gray-600">출처, 맥락, 위험도와 적용 범위를 확인하고 공개 상태를 변경합니다.</p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <form className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              name="q"
              defaultValue={query}
              placeholder="제목, key, 국가, 지역, 도시 검색"
              className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none ring-black/10 focus:ring-2"
            />
          </label>
          <select name="status" defaultValue={status} className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm">
            {WARNING_STATUSES.map((item) => (
              <option key={item} value={item}>{STATUS_LABELS[item]} · {counts.get(item) ?? 0}</option>
            ))}
          </select>
          <button className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white">검색</button>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-bold">{STATUS_LABELS[status]} {total.toLocaleString('ko-KR')}개</h2>
          <span className="text-xs text-gray-500">{page} / {pageCount} 페이지</span>
        </div>
        <div className="divide-y divide-gray-100">
          {warnings.length === 0 && <p className="p-10 text-center text-sm text-gray-500">조건에 맞는 항목이 없습니다.</p>}
          {warnings.map((warning) => {
            const officialSources = warning.sources.filter((source) =>
              ['OFFICIAL', 'GOVERNMENT_ADVISORY'].includes(source.kind) && source.url && source.checkedAt,
            );
            const badLinks = warning.sources.filter((source) => source.linkStatus === 'NOT_FOUND' || source.linkStatus === 'ERROR');
            return (
              <Link key={warning.id} href={`/admin/review/${warning.id}`} className="block px-5 py-4 hover:bg-gray-50">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-400">{warning.key}</p>
                    <h3 className="mt-1 truncate font-bold">{warning.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {[warning.country.name, warning.region?.name, warning.city?.name].filter(Boolean).join(' · ')} · {warning.category} · {warning.risk}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-gray-100 px-3 py-1.5">출처 {warning.sources.length}</span>
                    <span className={officialSources.length ? 'rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700' : 'rounded-full bg-amber-50 px-3 py-1.5 text-amber-700'}>
                      공식 {officialSources.length}
                    </span>
                    {badLinks.length > 0 && <span className="rounded-full bg-red-50 px-3 py-1.5 text-red-700">링크 오류 {badLinks.length}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <nav className="flex items-center justify-between">
        {page > 1 ? (
          <Link href={`/admin/review?q=${encodeURIComponent(query)}&status=${status}&page=${page - 1}`} className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm">이전</Link>
        ) : <span />}
        {page < pageCount && (
          <Link href={`/admin/review?q=${encodeURIComponent(query)}&status=${status}&page=${page + 1}`} className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm">다음</Link>
        )}
      </nav>
    </div>
  );
}
