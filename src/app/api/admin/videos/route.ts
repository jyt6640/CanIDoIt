import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/db/prisma';
import { assertAdminApi, assertSameOrigin } from '@/shared/admin/auth';
import { writeAdminLog } from '@/shared/admin/audit';
import { readOptionalString, readRequiredString, safeReturnPath } from '@/shared/admin/validation';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    await assertSameOrigin();
    const session = await assertAdminApi();
    const formData = await request.formData();
    const returnTo = safeReturnPath(formData.get('returnTo'), '/admin/videos');
    const url = readRequiredString(formData, 'url');
    const parsed = new URL(url);
    if (!['www.youtube.com', 'youtube.com', 'youtu.be'].includes(parsed.hostname)) {
      throw new Error('YOUTUBE_URL_REQUIRED');
    }

    const oembed = new URL('https://www.youtube.com/oembed');
    oembed.searchParams.set('url', url);
    oembed.searchParams.set('format', 'json');
    const response = await fetch(oembed, { signal: AbortSignal.timeout(15_000) });
    if (!response.ok) throw new Error(`YOUTUBE_OEMBED_${response.status}`);
    const metadata = await response.json() as { title?: string; author_name?: string };
    if (!metadata.title || !metadata.author_name) throw new Error('YOUTUBE_METADATA_MISSING');

    const candidate = await prisma.videoSourceCandidate.upsert({
      where: { url },
      update: {
        channelName: metadata.author_name,
        title: metadata.title,
        countrySlug: readOptionalString(formData, 'countrySlug'),
        regionSlug: readOptionalString(formData, 'regionSlug'),
        citySlug: readOptionalString(formData, 'citySlug'),
        claimSummary: readRequiredString(formData, 'claimSummary'),
        status: 'REVIEWING',
      },
      create: {
        channelName: metadata.author_name,
        title: metadata.title,
        url,
        countrySlug: readOptionalString(formData, 'countrySlug'),
        regionSlug: readOptionalString(formData, 'regionSlug'),
        citySlug: readOptionalString(formData, 'citySlug'),
        claimSummary: readRequiredString(formData, 'claimSummary'),
        status: 'REVIEWING',
      },
    });
    await writeAdminLog({
      actor: session.sub,
      action: 'VIDEO_CANDIDATE_UPSERTED',
      targetType: 'VideoSourceCandidate',
      targetId: candidate.id,
      metadata: { url, channelName: metadata.author_name },
    });
    revalidatePath('/admin/videos');
    return NextResponse.redirect(new URL(`${returnTo}?saved=1`, request.url), 303);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error instanceof Error && error.message === 'INVALID_ORIGIN') return NextResponse.json({ error: 'invalid origin' }, { status: 403 });
    return NextResponse.json({ error: error instanceof Error ? error.message : 'invalid request' }, { status: 400 });
  }
}
