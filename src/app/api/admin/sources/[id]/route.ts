import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/db/prisma';
import { assertAdminApi, assertSameOrigin } from '@/shared/admin/auth';
import { writeAdminLog } from '@/shared/admin/audit';
import { readEnum, readOptionalString, readRequiredString, safeReturnPath, SOURCE_KINDS } from '@/shared/admin/validation';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await assertSameOrigin();
    const session = await assertAdminApi();
    const { id } = await params;
    const formData = await request.formData();
    const returnTo = safeReturnPath(formData.get('returnTo'), '/admin/review');
    const action = formData.get('_action');
    const existing = await prisma.source.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });

    if (action === 'delete') {
      await prisma.source.delete({ where: { id } });
      await writeAdminLog({
        actor: session.sub,
        action: 'SOURCE_DELETED',
        targetType: 'Source',
        targetId: id,
        metadata: { warningId: existing.warningId, url: existing.url },
      });
      revalidatePath(returnTo);
      return NextResponse.redirect(new URL(`${returnTo}?sourceDeleted=1`, request.url), 303);
    }

    const url = readOptionalString(formData, 'url');
    if (url) {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') throw new Error('SOURCE_URL_MUST_USE_HTTPS');
    }
    const checkedAtValue = readOptionalString(formData, 'checkedAt');
    await prisma.source.update({
      where: { id },
      data: {
        title: readRequiredString(formData, 'title'),
        url,
        checkedAt: checkedAtValue ? new Date(checkedAtValue) : null,
        kind: readEnum(formData, 'kind', SOURCE_KINDS),
        platform: readOptionalString(formData, 'platform'),
        linkStatus: 'UNKNOWN',
        lastLinkCheckedAt: null,
        lastHttpStatus: null,
        finalUrl: null,
      },
    });
    await writeAdminLog({
      actor: session.sub,
      action: 'SOURCE_UPDATED',
      targetType: 'Source',
      targetId: id,
      metadata: { warningId: existing.warningId, url },
    });
    revalidatePath(returnTo);
    return NextResponse.redirect(new URL(`${returnTo}?sourceSaved=1`, request.url), 303);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error instanceof Error && error.message === 'INVALID_ORIGIN') return NextResponse.json({ error: 'invalid origin' }, { status: 403 });
    return NextResponse.json({ error: error instanceof Error ? error.message : 'invalid request' }, { status: 400 });
  }
}
