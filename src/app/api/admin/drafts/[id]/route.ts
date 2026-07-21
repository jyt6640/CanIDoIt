import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import type { Prisma, RiskLevel } from '@prisma/client';
import { prisma } from '@/shared/db/prisma';
import { assertAdminApi, assertSameOrigin } from '@/shared/admin/auth';
import { writeAdminLog } from '@/shared/admin/audit';
import { RISK_LEVELS, readOptionalString, readRequiredString, safeReturnPath } from '@/shared/admin/validation';

interface DraftPayload {
  title?: unknown;
  category?: unknown;
  risk?: unknown;
  type?: unknown;
  range?: unknown;
  reason?: unknown;
  alternative?: unknown;
  keywords?: unknown;
  aliases?: unknown;
}

const asText = (value: unknown, fallback = '') => typeof value === 'string' && value.trim() ? value.trim() : fallback;
const asStringArray = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await assertSameOrigin();
    const session = await assertAdminApi();
    const { id } = await params;
    const formData = await request.formData();
    const returnTo = safeReturnPath(formData.get('returnTo'), '/admin/drafts');
    const action = formData.get('_action');
    const draft = await prisma.contentDraft.findUnique({
      where: { id },
      include: { source: true, snapshot: true },
    });
    if (!draft) return NextResponse.json({ error: 'not found' }, { status: 404 });

    if (action === 'archive') {
      await prisma.contentDraft.update({ where: { id }, data: { status: 'ARCHIVED', reviewedAt: new Date() } });
      await writeAdminLog({ actor: session.sub, action: 'CONTENT_DRAFT_ARCHIVED', targetType: 'ContentDraft', targetId: id });
      revalidatePath('/admin/drafts');
      return NextResponse.redirect(new URL(`${returnTo}?archived=1`, request.url), 303);
    }

    const payload = draft.payload as DraftPayload;
    const countrySlug = readRequiredString(formData, 'countrySlug');
    const regionSlug = readOptionalString(formData, 'regionSlug');
    const citySlug = readOptionalString(formData, 'citySlug');
    const key = readRequiredString(formData, 'key');
    const country = await prisma.country.findUnique({ where: { slug: countrySlug } });
    if (!country) throw new Error('COUNTRY_NOT_FOUND');
    const [region, city] = await Promise.all([
      regionSlug
        ? prisma.region.findUnique({ where: { countryId_slug: { countryId: country.id, slug: regionSlug } } })
        : Promise.resolve(null),
      citySlug
        ? prisma.city.findUnique({ where: { countryId_slug: { countryId: country.id, slug: citySlug } } })
        : Promise.resolve(null),
    ]);
    if (regionSlug && !region) throw new Error('REGION_NOT_FOUND');
    if (citySlug && !city) throw new Error('CITY_NOT_FOUND');
    if (city && region && city.regionId && city.regionId !== region.id) throw new Error('CITY_REGION_MISMATCH');

    const rawRisk = asText(payload.risk, 'MEDIUM');
    const risk = RISK_LEVELS.includes(rawRisk as RiskLevel) ? rawRisk as RiskLevel : 'MEDIUM';
    const title = asText(payload.title);
    const reason = asText(payload.reason);
    const alternative = asText(payload.alternative);
    if (!title || !reason || !alternative) throw new Error('DRAFT_REQUIRED_FIELDS_MISSING');

    const warning = await prisma.$transaction(async (tx) => {
      const created = await tx.warning.upsert({
        where: { key },
        update: {
          title,
          category: asText(payload.category, '검수 필요'),
          risk,
          type: asText(payload.type, '공식 문서 초안'),
          range: asText(payload.range, country.name),
          reason,
          alternative,
          keywords: asStringArray(payload.keywords),
          aliases: asStringArray(payload.aliases),
          countryId: country.id,
          regionId: region?.id ?? null,
          cityId: city?.id ?? null,
          status: 'REVIEWING',
          evidenceLevel: 'OFFICIAL',
          confidence: 70,
          reviewedBy: null,
          verifiedAt: null,
          expiresAt: null,
          archived: false,
        },
        create: {
          key,
          title,
          category: asText(payload.category, '검수 필요'),
          risk,
          type: asText(payload.type, '공식 문서 초안'),
          range: asText(payload.range, country.name),
          reason,
          alternative,
          keywords: asStringArray(payload.keywords),
          aliases: asStringArray(payload.aliases),
          countryId: country.id,
          regionId: region?.id ?? null,
          cityId: city?.id ?? null,
          status: 'REVIEWING',
          evidenceLevel: 'OFFICIAL',
          confidence: 70,
          sources: {
            create: {
              title: draft.source.agencyName,
              url: draft.source.url,
              checkedAt: draft.snapshot.fetchedAt,
              kind: 'OFFICIAL',
              platform: draft.source.agencyName,
              claimSummary: draft.evidence,
            },
          },
        },
      });
      await tx.contentDraft.update({ where: { id }, data: { status: 'VERIFIED', reviewedAt: new Date() } });
      return created;
    });

    await writeAdminLog({
      actor: session.sub,
      action: 'CONTENT_DRAFT_CONVERTED',
      targetType: 'ContentDraft',
      targetId: id,
      metadata: { warningId: warning.id, warningKey: warning.key, countrySlug, regionSlug, citySlug } as Prisma.InputJsonObject,
    });
    revalidatePath('/admin/drafts');
    revalidatePath('/admin/review');
    return NextResponse.redirect(new URL(`/admin/review/${warning.id}?saved=1`, request.url), 303);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error instanceof Error && error.message === 'INVALID_ORIGIN') return NextResponse.json({ error: 'invalid origin' }, { status: 403 });
    return NextResponse.json({ error: error instanceof Error ? error.message : 'invalid request' }, { status: 400 });
  }
}
