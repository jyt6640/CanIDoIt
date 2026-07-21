import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, Plus, Save, Trash2 } from 'lucide-react';
import { prisma } from '@/shared/db/prisma';
import { RISK_LEVELS, SOURCE_KINDS, WARNING_STATUSES } from '@/shared/admin/validation';

const toDateInput = (value: Date | null) => value ? value.toISOString().slice(0, 10) : '';

export default async function AdminWarningDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string; sourceAdded?: string; sourceSaved?: string; sourceDeleted?: string }>;
}) {
  const { id } = await params;
  const messages = await searchParams;
  const warning = await prisma.warning.findUnique({
    where: { id },
    include: { country: true, region: true, city: true, sources: { orderBy: { id: 'asc' } } },
  });
  if (!warning) notFound();
  const returnTo = `/admin/review/${warning.id}`;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link href="/admin/review" className="text-sm font-semibold text-blue-700 hover:underline">← 검수 큐</Link>
          <p className="mt-4 text-xs font-semibold text-gray-400">{warning.key}</p>
          <h1 className="mt-1 text-3xl font-bold">{warning.title}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {[warning.country.name, warning.region?.name, warning.city?.name].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-gray-200 px-3 py-1.5">{warning.status}</span>
          <span className="rounded-full bg-gray-200 px-3 py-1.5">{warning.evidenceLevel}</span>
          <span className="rounded-full bg-gray-200 px-3 py-1.5">신뢰도 {warning.confidence ?? '미정'}</span>
        </div>
      </section>

      {(messages.saved || messages.sourceAdded || messages.sourceSaved || messages.sourceDeleted) && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">변경사항을 저장했습니다.</p>
      )}
      {messages.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {messages.error === 'official-source-required'
            ? '검수 완료에는 URL과 확인일이 있는 공식 출처가 최소 1개 필요합니다.'
            : messages.error === 'community-signal-cannot-verify'
              ? '커뮤니티 신호는 공식 근거와 교차 확인하기 전에는 검수 완료로 전환할 수 없습니다.'
              : '저장하지 못했습니다.'}
        </p>
      )}

      <form action={`/api/admin/warnings/${warning.id}`} method="post" className="space-y-6">
        <input type="hidden" name="returnTo" value={returnTo} />
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="block xl:col-span-2">
              <span className="mb-2 block text-sm font-semibold">제목</span>
              <input name="title" defaultValue={warning.title} required className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">상태</span>
              <select name="status" defaultValue={warning.status} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm">
                {WARNING_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">위험도</span>
              <select name="risk" defaultValue={warning.risk} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm">
                {RISK_LEVELS.map((risk) => <option key={risk} value={risk}>{risk}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">카테고리</span>
              <input name="category" defaultValue={warning.category} required className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">유형</span>
              <input name="type" defaultValue={warning.type} required className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">적용 범위</span>
              <input name="range" defaultValue={warning.range} required className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">신뢰도 0–100</span>
              <input type="number" name="confidence" min="0" max="100" defaultValue={warning.confidence ?? ''} className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">재검토 주기(일)</span>
              <input type="number" name="expiresInDays" min="1" max="730" defaultValue="180" className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm" />
            </label>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          {[
            ['reason', '왜 조심해야 하나요?', warning.reason],
            ['alternative', '대안 행동', warning.alternative],
            ['diffFromKorea', '한국과 다른 점', warning.diffFromKorea],
            ['checkNeeded', '추가 확인사항', warning.checkNeeded],
            ['contextNotes', '민감한 맥락', warning.contextNotes],
            ['sideEffects', '실제 부작용', warning.sideEffects],
            ['counterpoint', '반례·과장 방지', warning.counterpoint],
          ].map(([name, label, value]) => (
            <label key={name} className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <span className="mb-2 block text-sm font-bold">{label}</span>
              <textarea name={name ?? undefined} defaultValue={value ?? ''} required={name === 'reason' || name === 'alternative'} rows={5} className="w-full resize-y rounded-xl border border-gray-300 px-3 py-2.5 text-sm leading-6" />
            </label>
          ))}
        </section>

        <div className="sticky bottom-4 flex justify-end">
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-white shadow-lg">
            <Save size={16} /> Warning 저장
          </button>
        </div>
      </form>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">출처 {warning.sources.length}개</h2>
          <span className="text-xs text-gray-500">공식 출처 URL과 확인일이 있어야 VERIFIED 가능</span>
        </div>
        <div className="mt-5 space-y-4">
          {warning.sources.map((source) => (
            <form key={source.id} action={`/api/admin/sources/${source.id}`} method="post" className="rounded-xl border border-gray-200 p-4">
              <input type="hidden" name="returnTo" value={returnTo} />
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <label className="block xl:col-span-2">
                  <span className="mb-1 block text-xs font-semibold text-gray-500">출처명</span>
                  <input name="title" defaultValue={source.title} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-gray-500">종류</span>
                  <select name="kind" defaultValue={source.kind} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                    {SOURCE_KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-gray-500">플랫폼·기관</span>
                  <input name="platform" defaultValue={source.platform ?? ''} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </label>
                <label className="block xl:col-span-3">
                  <span className="mb-1 block text-xs font-semibold text-gray-500">URL</span>
                  <input type="url" name="url" defaultValue={source.url ?? ''} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-gray-500">확인일</span>
                  <input type="date" name="checkedAt" defaultValue={toDateInput(source.checkedAt)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </label>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-gray-500">링크 상태: {source.linkStatus} {source.lastHttpStatus ? `· HTTP ${source.lastHttpStatus}` : ''}</p>
                <div className="flex gap-2">
                  {source.url && <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-xs"><ExternalLink size={13} /> 열기</a>}
                  <button type="submit" className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white">저장</button>
                  <button type="submit" name="_action" value="delete" className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700"><Trash2 size={13} /> 삭제</button>
                </div>
              </div>
            </form>
          ))}
        </div>

        <form action={`/api/admin/warnings/${warning.id}/sources`} method="post" className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
          <input type="hidden" name="returnTo" value={returnTo} />
          <div className="mb-3 flex items-center gap-2 font-bold"><Plus size={16} /> 출처 추가</div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input name="title" required placeholder="출처명" className="rounded-lg border border-gray-300 px-3 py-2 text-sm xl:col-span-2" />
            <select name="kind" defaultValue="OFFICIAL" className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {SOURCE_KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
            </select>
            <input name="platform" placeholder="기관·플랫폼" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input type="url" name="url" placeholder="https://..." className="rounded-lg border border-gray-300 px-3 py-2 text-sm xl:col-span-3" />
            <input type="date" name="checkedAt" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="mt-3 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white">출처 추가</button>
        </form>
      </section>
    </div>
  );
}
