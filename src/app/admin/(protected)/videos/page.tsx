import { ExternalLink, Video } from 'lucide-react';
import { prisma } from '@/shared/db/prisma';

export default async function AdminVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; archived?: string }>;
}) {
  const messages = await searchParams;
  const videos = await prisma.videoSourceCandidate.findMany({
    where: { status: 'REVIEWING' },
    orderBy: { discoveredAt: 'desc' },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-bold tracking-[0.16em] text-gray-400">VIDEO REVIEW</p>
        <h1 className="mt-2 text-3xl font-bold">여행 크리에이터 영상 후보</h1>
        <p className="mt-2 text-sm text-gray-600">영상은 직접 VERIFIED 근거가 되지 않습니다. 타임스탬프와 주장 요약을 확인한 뒤 독립 출처와 교차 검증하세요.</p>
      </section>

      {(messages.saved || messages.archived) && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">변경사항을 저장했습니다.</p>}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold">YouTube 후보 등록</h2>
        <p className="mt-1 text-xs text-gray-500">영상 URL의 실제 제목과 채널명은 YouTube oEmbed로 확인하며 REVIEWING 상태로만 저장됩니다.</p>
        <form action="/api/admin/videos" method="post" className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input type="hidden" name="returnTo" value="/admin/videos" />
          <input type="url" name="url" required placeholder="https://www.youtube.com/watch?v=..." className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2 xl:col-span-4" />
          <input name="countrySlug" placeholder="국가 slug" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input name="regionSlug" placeholder="지역 slug" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <input name="citySlug" placeholder="도시 slug" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <span />
          <textarea name="claimSummary" required rows={3} placeholder="검수할 주장 요약" className="rounded-lg border border-gray-300 px-3 py-2 text-sm leading-6 md:col-span-2 xl:col-span-4" />
          <button className="rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white md:col-start-2 xl:col-start-4">후보 등록</button>
        </form>
      </section>

      <section className="space-y-5">
        {videos.length === 0 && <p className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">검수할 영상 후보가 없습니다.</p>}
        {videos.map((video) => (
          <article key={video.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700"><Video size={12} /> YouTube</span>
                  {video.countrySlug && <span className="rounded-full bg-gray-100 px-2.5 py-1">{video.countrySlug}</span>}
                  {video.regionSlug && <span className="rounded-full bg-gray-100 px-2.5 py-1">{video.regionSlug}</span>}
                  {video.citySlug && <span className="rounded-full bg-gray-100 px-2.5 py-1">{video.citySlug}</span>}
                </div>
                <h2 className="mt-3 text-lg font-bold">{video.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{video.channelName}</p>
                <a href={video.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
                  영상 열기 <ExternalLink size={13} />
                </a>
              </div>
              <form action={`/api/admin/videos/${video.id}`} method="post">
                <input type="hidden" name="returnTo" value="/admin/videos" />
                <button type="submit" name="_action" value="archive" className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600">보관</button>
              </form>
            </div>

            <form action={`/api/admin/videos/${video.id}`} method="post" className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <input type="hidden" name="returnTo" value="/admin/videos" />
              <label className="block xl:col-span-2">
                <span className="mb-1 block text-xs font-semibold text-gray-500">채널명</span>
                <input name="channelName" defaultValue={video.channelName} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </label>
              <label className="block xl:col-span-2">
                <span className="mb-1 block text-xs font-semibold text-gray-500">영상 제목</span>
                <input name="title" defaultValue={video.title} required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              </label>
              <input name="countrySlug" defaultValue={video.countrySlug ?? ''} placeholder="국가 slug" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input name="regionSlug" defaultValue={video.regionSlug ?? ''} placeholder="지역 slug" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input name="citySlug" defaultValue={video.citySlug ?? ''} placeholder="도시 slug" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <input type="number" name="timestampSeconds" min="0" max={86400} defaultValue={video.timestampSeconds ?? ''} placeholder="타임스탬프(초)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
              <label className="block md:col-span-2 xl:col-span-4">
                <span className="mb-1 block text-xs font-semibold text-gray-500">검수할 주장 요약</span>
                <textarea name="claimSummary" defaultValue={video.claimSummary} required rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm leading-6" />
              </label>
              <button className="rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white md:col-start-2 xl:col-start-4">후보 저장</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
