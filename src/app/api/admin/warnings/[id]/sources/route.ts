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
    const returnTo = safeReturnPath(formData.get('returnTo'), `/admin/review/${id}`);
    const url = readOptionalString(formData, 'url');
    if (url) {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') throw new Error('SOURCE_URL_MUST_USE_HTTPS');
    }

    const source = await prisma.source.create({
      data: {
        warningId: id,
        title: readRequiredString(formData, 'title'),
        url,
        checkedAt: readOptionalString(formData, 'checkedAt')
          ? new Date(readRequiredString(formData, 'checkedAt'))
          : null,
        kind: readEnum(formData, 'kind', SOURCE_KINDS),
        platform: readOptionalString(formData, 'platform'),
      },
    });

    await writeAdminLog({
      actor: session.sub,
      action: 'SOURCE_CREATED',
      targetType: 'Source',
      targetId: source.id,
      metadata: { warningId: id, url },
    });
    revalidatePath(returnTo);
    return NextResponse.redirect(new URL(`${returnTo}?sourceAdded=1`, request.url), 303);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error instanceof Error && error.message === 'INVALID_ORIGIN') return NextResponse.json({ error: 'invalid origin' }, { status: 403 });
    return NextResponse.json({ error: error instanceof Error ? error.message : 'invalid request' }, { status: 400 });
  }
}
