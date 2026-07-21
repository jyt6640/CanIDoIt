import Link from 'next/link';
import { ExternalLink, Play, Plus, RefreshCw } from 'lucide-react';
import { prisma } from '@/shared/db/prisma';

export default async function AdminSourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; success?: string; jobError?: string }>;
}) {
  const messages = await searchParams;
  const sources = await prisma.officialSource.findMany({
    include: {
      snapshots: { orderBy: { fetchedAt: 'desc' }, take: 1 },
      _count: { select: { snapshots: true, drafts: true } },
    },
    orderBy: [{ enabled: 'desc' }, { countryCode: 'asc' }, { agencyName: 'asc' }],
  });

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-bold tracking-[0.16em] text-gray-400">OFFICIAL SOURCES</p>
        <h1 className="mt-2 text-3xl font-bold">공식 출처·크롤링 관리</h1>
        <p className="mt-2 text-sm text-gray-600">HTTPS 공식 URL을 등록하고, 원문 스냅샷 수집과 NVIDIA 초안 생성을 실행합니다.</p>
      </section>

      {(messages.saved || messages.success) && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">작업이 완료됐습니다.</p>}
      {messages.jobError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">작업 실패: {decodeURIComponent(messages.jobError)}</p>}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 font-bold"><Plus size={17} /> 공식 출처 등록</div>
        <form action="/api/admin/official-sources" method="post" className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input type="hidden" name="returnTo" value="/admin/sources" />
          <input name="countryCode" required maxLength={3} placeholder="국가코드 JP" className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm uppercase" />
          <input name="agencyName" required placeholder="기관명" className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm xl:col-span-2" />
          <input name="sourceType" required placeholder="customs / tourism" className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
          <input name="language" defaultValue="en" placeholder="언어" className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
          <input type="url" name="url" required placeholder="https://official.example/..." className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm md:col-span-2 xl:col-span-4" />
          <button className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white">등록</button>
        </form>
      </section>

      <section className="space-y-4">
        {sources.length === 0 && <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">등록된 OfficialSource가 없습니다.</p>}
        {sources.map((source) => {
          const latest = source.snapshots[0];
          return (
            <article key={source.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={source.enabled ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700' : 'rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500'}>
                      {source.enabled ? '활성' : '비활성'}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">{source.countryCode}</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">{source.sourceType}</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">{source.language}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-bold">{source.agencyName}</h2>
                  <a href={source.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-sm text-blue-700 hover:underline">
                    {source.url} <ExternalLink size={13} />
                  </a>
                  <p className="mt-3 text-xs text-gray-500">
                    스냅샷 {source._count.snapshots} · 초안 {source._count.drafts} · 마지막 수집 {source.lastFetchedAt?.toLocaleString('ko-KR') ?? '없음'}
                  </p>
                  {latest && (
                    <p className="mt-1 text-xs text-gray-500">
                      최신 해시 {latest.contentHash.slice(0, 12)}… · {latest.provider} · {latest.changed ? '변경됨' : '동일'} · {latest.fetchedAt.toLocaleString('ko-KR')}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <form action="/api/admin/jobs" method="post">
                    <input type="hidden" name="type" value="COLLECT_SOURCE" />
                    <input type="hidden" name="targetType" value="OfficialSource" />
                    <input type="hidden" name="targetId" value={source.id} />
                    <input type="hidden" name="returnTo" value="/admin/sources" />
                    <button disabled={!source.enabled} className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
                      <RefreshCw size={15} /> 수집 실행
                    </button>
                  </form>
                  <form action="/api/admin/jobs" method="post">
                    <input type="hidden" name="type" value="AUDIT_SOURCE" />
                    <input type="hidden" name="targetType" value="OfficialSource" />
                    <input type="hidden" name="targetId" value={source.id} />
                    <input type="hidden" name="returnTo" value="/admin/sources" />
                    <button className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold">
                      <ExternalLink size={15} /> 링크 확인
                    </button>
                  </form>
                  {latest && (
                    <form action="/api/admin/jobs" method="post">
                      <input type="hidden" name="type" value="DRAFT_CONTENT" />
                      <input type="hidden" name="targetType" value="SourceSnapshot" />
                      <input type="hidden" name="targetId" value={latest.id} />
                      <input type="hidden" name="returnTo" value="/admin/sources" />
                      <button className="inline-flex items-center gap-2 rounded-xl border border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-800">
                        <Play size={15} /> AI 초안 생성
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <details className="mt-5 border-t border-gray-100 pt-4">
                <summary className="cursor-pointer text-sm font-semibold text-gray-600">출처 설정 편집</summary>
                <form action={`/api/admin/official-sources/${source.id}`} method="post" className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <input type="hidden" name="returnTo" value="/admin/sources" />
                  <input name="countryCode" defaultValue={source.countryCode} required className="rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase" />
                  <input name="agencyName" defaultValue={source.agencyName} required className="rounded-lg border border-gray-300 px-3 py-2 text-sm xl:col-span-2" />
                  <input name="sourceType" defaultValue={source.sourceType} required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  <input name="language" defaultValue={source.language} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  <input type="url" name="url" defaultValue={source.url} required className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2 xl:col-span-4" />
                  <button className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white">저장</button>
                  <button type="submit" name="_action" value="toggle" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold md:col-start-2 xl:col-start-5">
                    {source.enabled ? '비활성화' : '활성화'}
                  </button>
                </form>
              </details>
            </article>
          );
        })}
      </section>

      <p className="text-xs leading-5 text-gray-500">
        수집과 AI 초안 생성은 대상 하나씩 실행됩니다. 여러 사이트를 한 번에 크롤링하지 않으며 작업 결과는 <Link href="/admin/jobs" className="font-semibold text-blue-700">작업 이력</Link>에 저장됩니다.
      </p>
    </div>
  );
}
