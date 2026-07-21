import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/db/prisma';
import { assertAdminApi, assertSameOrigin } from '@/shared/admin/auth';
import { writeAdminLog } from '@/shared/admin/audit';
import {
  readEnum,
  readInteger,
  readOptionalString,
  readRequiredString,
  RISK_LEVELS,
  safeReturnPath,
  WARNING_STATUSES,
} from '@/shared/admin/validation';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await assertSameOrigin();
    const session = await assertAdminApi();
    const { id } = await params;
    const formData = await request.formData();
    const returnTo = safeReturnPath(formData.get('returnTo'), `/admin/review/${id}`);

    const status = readEnum(formData, 'status', WARNING_STATUSES);
    const risk = readEnum(formData, 'risk', RISK_LEVELS);
    const existing = await prisma.warning.findUnique({
      where: { id },
      include: { sources: true, country: true, region: true, city: true },
    });
    if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });

    const officialSources = existing.sources.filter((source) =>
      ['OFFICIAL', 'GOVERNMENT_ADVISORY'].includes(source.kind) && source.url && source.checkedAt,
    );
    if (status === 'VERIFIED' && officialSources.length === 0) {
      return NextResponse.redirect(new URL(`${returnTo}?error=official-source-required`, request.url), 303);
    }
    if (status === 'VERIFIED' && existing.evidenceLevel === 'COMMUNITY_SIGNAL') {
      return NextResponse.redirect(new URL(`${returnTo}?error=community-signal-cannot-verify`, request.url), 303);
    }

    const confidence = readInteger(formData, 'confidence', 0, 100);
    const expiresInDays = readInteger(formData, 'expiresInDays', 1, 730) ?? 180;
    const now = new Date();

    await prisma.warning.update({
      where: { id },
      data: {
        title: readRequiredString(formData, 'title'),
        category: readRequiredString(formData, 'category'),
        type: readRequiredString(formData, 'type'),
        range: readRequiredString(formData, 'range'),
        reason: readRequiredString(formData, 'reason'),
        alternative: readRequiredString(formData, 'alternative'),
        diffFromKorea: readOptionalString(formData, 'diffFromKorea'),
        checkNeeded: readOptionalString(formData, 'checkNeeded'),
        contextNotes: readOptionalString(formData, 'contextNotes'),
        sideEffects: readOptionalString(formData, 'sideEffects'),
        counterpoint: readOptionalString(formData, 'counterpoint'),
        risk,
        status,
        confidence,
        archived: status === 'ARCHIVED',
        reviewedBy: status === 'VERIFIED' ? session.sub : existing.reviewedBy,
        verifiedAt: status === 'VERIFIED' ? now : status === 'REVIEWING' || status === 'DRAFT' ? null : existing.verifiedAt,
        expiresAt: status === 'VERIFIED'
          ? new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000)
          : status === 'REVIEWING' || status === 'DRAFT'
            ? null
            : existing.expiresAt,
      },
    });

    await writeAdminLog({
      actor: session.sub,
      action: 'WARNING_UPDATED',
      targetType: 'Warning',
      targetId: id,
      metadata: {
        key: existing.key,
        previousStatus: existing.status,
        nextStatus: status,
        destination: [existing.country.name, existing.region?.name, existing.city?.name].filter(Boolean).join(' · '),
      },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/review');
    revalidatePath(returnTo);
    revalidatePath(`/${existing.country.slug}`);
    if (existing.city) revalidatePath(`/${existing.country.slug}/${existing.city.slug}`);
    if (existing.region) revalidatePath(`/${existing.country.slug}/regions/${existing.region.slug}`);
    return NextResponse.redirect(new URL(`${returnTo}?saved=1`, request.url), 303);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'INVALID_ORIGIN') {
      return NextResponse.json({ error: 'invalid origin' }, { status: 403 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'invalid request' }, { status: 400 });
  }
}
