import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/db/prisma';
import { assertAdminApi, assertSameOrigin } from '@/shared/admin/auth';
import { writeAdminLog } from '@/shared/admin/audit';
import { readInteger, readOptionalString, readRequiredString, safeReturnPath } from '@/shared/admin/validation';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await assertSameOrigin();
    const session = await assertAdminApi();
    const { id } = await params;
    const formData = await request.formData();
    const returnTo = safeReturnPath(formData.get('returnTo'), '/admin/videos');
    const action = formData.get('_action');
    const existing = await prisma.videoSourceCandidate.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });

    if (action === 'archive') {
      await prisma.videoSourceCandidate.update({
        where: { id },
        data: { status: 'ARCHIVED', reviewedAt: new Date() },
      });
      await writeAdminLog({
        actor: session.sub,
        action: 'VIDEO_CANDIDATE_ARCHIVED',
        targetType: 'VideoSourceCandidate',
        targetId: id,
        metadata: { url: existing.url },
      });
      revalidatePath('/admin/videos');
      return NextResponse.redirect(new URL(`${returnTo}?archived=1`, request.url), 303);
    }

    await prisma.videoSourceCandidate.update({
      where: { id },
      data: {
        countrySlug: readOptionalString(formData, 'countrySlug'),
        regionSlug: readOptionalString(formData, 'regionSlug'),
        citySlug: readOptionalString(formData, 'citySlug'),
        channelName: readRequiredString(formData, 'channelName'),
        title: readRequiredString(formData, 'title'),
        claimSummary: readRequiredString(formData, 'claimSummary'),
        timestampSeconds: readInteger(formData, 'timestampSeconds', 0, 24 * 60 * 60),
        status: 'REVIEWING',
      },
    });
    await writeAdminLog({
      actor: session.sub,
      action: 'VIDEO_CANDIDATE_UPDATED',
      targetType: 'VideoSourceCandidate',
      targetId: id,
      metadata: { url: existing.url },
    });
    revalidatePath('/admin/videos');
    return NextResponse.redirect(new URL(`${returnTo}?saved=1`, request.url), 303);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error instanceof Error && error.message === 'INVALID_ORIGIN') return NextResponse.json({ error: 'invalid origin' }, { status: 403 });
    return NextResponse.json({ error: error instanceof Error ? error.message : 'invalid request' }, { status: 400 });
  }
}
