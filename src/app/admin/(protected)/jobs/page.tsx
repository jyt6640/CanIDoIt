import { Database, RefreshCw } from 'lucide-react';
import { prisma } from '@/shared/db/prisma';

const pretty = (value: unknown) => value == null ? '' : JSON.stringify(value, null, 2);

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; jobError?: string }>;
}) {
  const messages = await searchParams;
  const [jobs, logs] = await Promise.all([
    prisma.adminJob.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.adminActionLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
  ]);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-bold tracking-[0.16em] text-gray-400">OPERATION HISTORY</p>
        <h1 className="mt-2 text-3xl font-bold">작업·감사 이력</h1>
        <p className="mt-2 text-sm text-gray-600">크롤링, AI 초안 생성, 링크 확인, DB 감사의 실행 결과와 실패 원인을 확인합니다.</p>
      </section>

      {messages.success && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">작업이 완료됐습니다.</p>}
      {messages.jobError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">작업 실패: {decodeURIComponent(messages.jobError)}</p>}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold">즉시 DB 품질 감사</h2>
            <p className="mt-1 text-xs text-gray-500">현재 Warning·Source·검수 큐·링크 오류 수를 스냅샷으로 기록합니다.</p>
          </div>
          <form action="/api/admin/jobs" method="post">
            <input type="hidden" name="type" value="AUDIT_DATABASE" />
            <input type="hidden" name="targetType" value="Database" />
            <input type="hidden" name="returnTo" value="/admin/jobs" />
            <button className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white">
              <Database size={15} /> 감사 실행
            </button>
          </form>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4"><h2 className="font-bold">AdminJob {jobs.length}개</h2></div>
        <div className="divide-y divide-gray-100">
          {jobs.length === 0 && <p className="p-10 text-center text-sm text-gray-500">실행된 작업이 없습니다.</p>}
          {jobs.map((job) => (
            <article key={job.id} className="p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">{job.type}</span>
                    <span className={job.status === 'SUCCEEDED' ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700' : job.status === 'FAILED' ? 'rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700' : 'rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700'}>
                      {job.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">요청 {job.requestedBy} · {job.createdAt.toLocaleString('ko-KR')}</p>
                  {job.targetType && <p className="mt-1 text-xs text-gray-500">대상 {job.targetType} · {job.targetId ?? '-'}</p>}
                </div>
                {job.status === 'FAILED' && (
                  <form action="/api/admin/jobs" method="post">
                    <input type="hidden" name="type" value={job.type} />
                    <input type="hidden" name="targetType" value={job.targetType ?? ''} />
                    <input type="hidden" name="targetId" value={job.targetId ?? ''} />
                    <input type="hidden" name="returnTo" value="/admin/jobs" />
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold"><RefreshCw size={13} /> 재실행</button>
                  </form>
                )}
              </div>
              {job.error && <pre className="mt-3 overflow-auto rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-800">{job.error}</pre>}
              {job.output && (
                <details className="mt-3 rounded-xl bg-gray-50 p-3">
                  <summary className="cursor-pointer text-xs font-semibold">결과 JSON 보기</summary>
                  <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-gray-600">{pretty(job.output)}</pre>
                </details>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4"><h2 className="font-bold">관리자 활동 {logs.length}개</h2></div>
        <div className="divide-y divide-gray-100">
          {logs.map((log) => (
            <article key={log.id} className="px-5 py-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <p className="text-sm font-semibold">{log.action}</p>
                <p className="text-xs text-gray-500">{log.createdAt.toLocaleString('ko-KR')}</p>
              </div>
              <p className="mt-1 text-xs text-gray-500">{log.actor} · {log.targetType} · {log.targetId ?? '-'}</p>
              {log.metadata && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-blue-700">메타데이터</summary>
                  <pre className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-3 text-xs text-gray-600">{pretty(log.metadata)}</pre>
                </details>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
