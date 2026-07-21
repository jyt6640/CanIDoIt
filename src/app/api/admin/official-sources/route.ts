import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/db/prisma';
import { assertAdminApi, assertSameOrigin } from '@/shared/admin/auth';
import { writeAdminLog } from '@/shared/admin/audit';
import { readOptionalString, readRequiredString, safeReturnPath } from '@/shared/admin/validation';

export async function POST(request: Request) {
  try {
    await assertSameOrigin();
    const session = await assertAdminApi();
    const formData = await request.formData();
    const returnTo = safeReturnPath(formData.get('returnTo'), '/admin/sources');
    const url = readRequiredString(formData, 'url');
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') throw new Error('SOURCE_URL_MUST_USE_HTTPS');

    const source = await prisma.officialSource.upsert({
      where: { url: parsed.toString() },
      update: {
        countryCode: readRequiredString(formData, 'countryCode').toUpperCase(),
        agencyName: readRequiredString(formData, 'agencyName'),
        sourceType: readRequiredString(formData, 'sourceType'),
        language: readOptionalString(formData, 'language') ?? 'en',
        enabled: true,
      },
      create: {
        countryCode: readRequiredString(formData, 'countryCode').toUpperCase(),
        agencyName: readRequiredString(formData, 'agencyName'),
        sourceType: readRequiredString(formData, 'sourceType'),
        language: readOptionalString(formData, 'language') ?? 'en',
        url: parsed.toString(),
      },
    });
    await writeAdminLog({
      actor: session.sub,
      action: 'OFFICIAL_SOURCE_UPSERTED',
      targetType: 'OfficialSource',
      targetId: source.id,
      metadata: { url: source.url, agencyName: source.agencyName },
    });
    revalidatePath('/admin/sources');
    return NextResponse.redirect(new URL(`${returnTo}?saved=1`, request.url), 303);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error instanceof Error && error.message === 'INVALID_ORIGIN') return NextResponse.json({ error: 'invalid origin' }, { status: 403 });
    return NextResponse.json({ error: error instanceof Error ? error.message : 'invalid request' }, { status: 400 });
  }
}
