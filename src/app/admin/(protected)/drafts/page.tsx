import { prisma } from '@/shared/db/prisma';

const pretty = (value: unknown) => JSON.stringify(value, null, 2);

export default async function AdminDraftsPage({
  searchParams,
}: {
  searchParams: Promise<{ archived?: string }>;
}) {
  const messages = await searchParams;
  const [drafts, countries] = await Promise.all([
    prisma.contentDraft.findMany({
      where: { status: 'REVIEWING' },
      include: { source: true, snapshot: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.country.findMany({
      include: {
        regions: { orderBy: { name: 'asc' } },
        cities: { orderBy: { name: 'asc' } },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-bold tracking-[0.16em] text-gray-400">AI DRAFT REVIEW</p>
        <h1 className="mt-2 text-3xl font-bold">AI 초안 검수</h1>
        <p className="mt-2 text-sm text-gray-600">원문 evidence가 실제 스냅샷에 존재하는 후보만 표시됩니다. Warning으로 전환해도 REVIEWING 상태로 시작합니다.</p>
      </section>

      {messages.archived && <p className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">초안을 보관 처리했습니다.</p>}

      <section className="space-y-5">
        {drafts.length === 0 && <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">검수할 AI 초안이 없습니다.</p>}
        {drafts.map((draft) => {
          const payload = draft.payload as Record<string, unknown>;
          const title = typeof payload.title === 'string' ? payload.title : '제목 없음';
          return (
            <article key={draft.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 font-semibold text-violet-700">{draft.model}</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1">{draft.source.countryCode}</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1">{draft.source.agencyName}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold">{title}</h2>
                  <p className="mt-2 text-sm text-gray-500">생성 {draft.createdAt.toLocaleString('ko-KR')} · 스냅샷 {draft.snapshot.fetchedAt.toLocaleString('ko-KR')}</p>
                </div>
                <form action={`/api/admin/drafts/${draft.id}`} method="post">
                  <input type="hidden" name="returnTo" value="/admin/drafts" />
                  <button type="submit" name="_action" value="archive" className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600">보관</button>
                </form>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <h3 className="text-sm font-bold text-emerald-900">원문 근거</h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-900/80">{draft.evidence}</p>
                </div>
                <details className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <summary className="cursor-pointer text-sm font-bold">구조화된 JSON 보기</summary>
                  <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-gray-600">{pretty(payload)}</pre>
                </details>
              </div>

              <form action={`/api/admin/drafts/${draft.id}`} method="post" className="mt-5 rounded-xl border border-gray-200 p-4">
                <input type="hidden" name="returnTo" value="/admin/drafts" />
                <h3 className="text-sm font-bold">Warning 검수 큐로 전환</h3>
                <p className="mt-1 text-xs text-gray-500">고정 key와 적용 국가·지역·도시를 운영자가 직접 확인해야 합니다.</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <input name="key" required placeholder="stable-warning-key" className="rounded-lg border border-gray-300 px-3 py-2 text-sm xl:col-span-2" />
                  <select name="countrySlug" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
                    <option value="">국가 선택</option>
                    {countries.map((country) => <option key={country.slug} value={country.slug}>{country.name} · {country.slug}</option>)}
                  </select>
                  <input name="regionSlug" placeholder="지역 slug (선택)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  <input name="citySlug" placeholder="도시 slug (선택)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                  <button className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white md:col-start-2 xl:col-start-4">검수 큐로 전환</button>
                </div>
              </form>
            </article>
          );
        })}
      </section>
    </div>
  );
}
