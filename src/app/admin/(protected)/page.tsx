import Link from 'next/link';
import { AlertTriangle, CheckCircle2, Clock3, Database, ExternalLink, FileSearch, Globe2 } from 'lucide-react';
import { prisma } from '@/shared/db/prisma';
import { requireAdmin } from '@/shared/admin/auth';

const STATUS_LABELS = {
  DRAFT: '초안',
  REVIEWING: '검수 중',
  VERIFIED: '검수 완료',
  STALE: '재검토 필요',
  ARCHIVED: '보관됨',
} as const;

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    countries,
    regions,
    cities,
    warnings,
    warningStatuses,
    linkStatuses,
    drafts,
    videos,
    jobs,
    logs,
  ] = await Promise.all([
    prisma.country.count(),
    prisma.region.count(),
    prisma.city.count(),
    prisma.warning.count({ where: { archived: false } }),
    prisma.warning.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.source.groupBy({ by: ['linkStatus'], _count: { _all: true } }),
    prisma.contentDraft.count({ where: { status: 'REVIEWING' } }),
    prisma.videoSourceCandidate.count({ where: { status: 'REVIEWING' } }),
    prisma.adminJob.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.adminActionLog.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
  ]);

  const reviewCount = warningStatuses.find((item) => item.status === 'REVIEWING')?._count._all ?? 0;
  const staleCount = warningStatuses.find((item) => item.status === 'STALE')?._count._all ?? 0;
  const verifiedCount = warningStatuses.find((item) => item.status === 'VERIFIED')?._count._all ?? 0;
  const brokenLinks = linkStatuses
    .filter((item) => item.linkStatus === 'NOT_FOUND' || item.linkStatus === 'ERROR')
    .reduce((sum, item) => sum + item._count._all, 0);

  const metrics = [
    { label: '국가 / 지역 / 도시', value: `${countries} / ${regions} / ${cities}`, icon: Globe2 },
    { label: '공개 Warning', value: warnings.toLocaleString('ko-KR'), icon: Database },
    { label: '검수 완료', value: verifiedCount.toLocaleString('ko-KR'), icon: CheckCircle2 },
    { label: '검수 대기', value: (reviewCount + drafts + videos).toLocaleString('ko-KR'), icon: Clock3 },
    { label: '재검토 필요', value: staleCount.toLocaleString('ko-KR'), icon: AlertTriangle },
    { label: '링크 오류 후보', value: brokenLinks.toLocaleString('ko-KR'), icon: ExternalLink },
  ];

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-bold tracking-[0.16em] text-gray-400">OPERATIONS</p>
        <h1 className="mt-2 text-3xl font-bold">데이터 운영 대시보드</h1>
        <p className="mt-2 text-sm text-gray-600">검수 상태, 출처 품질, 크롤링과 AI 초안 작업을 한곳에서 관리합니다.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">{label}</p>
              <Icon size={18} className="text-gray-400" />
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Warning 상태</h2>
            <Link href="/admin/review" className="text-sm font-semibold text-blue-700 hover:underline">검수 큐 열기</Link>
          </div>
          <div className="mt-4 space-y-3">
            {warningStatuses.map((item) => (
              <div key={item.status} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
                <span>{STATUS_LABELS[item.status]}</span>
                <strong>{item._count._all.toLocaleString('ko-KR')}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">출처 링크 상태</h2>
            <Link href="/admin/sources" className="text-sm font-semibold text-blue-700 hover:underline">출처 관리</Link>
          </div>
          <div className="mt-4 space-y-3">
            {linkStatuses.map((item) => (
              <div key={item.linkStatus} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm">
                <span>{item.linkStatus}</span>
                <strong>{item._count._all.toLocaleString('ko-KR')}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">최근 작업</h2>
            <Link href="/admin/jobs" className="text-sm font-semibold text-blue-700 hover:underline">전체 보기</Link>
          </div>
          <div className="mt-4 space-y-3">
            {jobs.length === 0 && <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">아직 실행된 작업이 없습니다.</p>}
            {jobs.map((job) => (
              <div key={job.id} className="rounded-xl border border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{job.type}</span>
                  <span className="text-xs text-gray-500">{job.status}</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">{job.createdAt.toLocaleString('ko-KR')}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">최근 관리자 활동</h2>
          <div className="mt-4 space-y-3">
            {logs.length === 0 && <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">아직 기록된 관리자 활동이 없습니다.</p>}
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 rounded-xl border border-gray-100 px-4 py-3">
                <FileSearch size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{log.action}</p>
                  <p className="mt-1 text-xs text-gray-500">{log.actor} · {log.targetType} · {log.createdAt.toLocaleString('ko-KR')}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
