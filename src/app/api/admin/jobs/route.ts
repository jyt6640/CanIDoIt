import { NextResponse } from 'next/server';
import type { AdminJobType } from '@prisma/client';
import { assertAdminApi, assertSameOrigin } from '@/shared/admin/auth';
import { createAndRunAdminJob } from '@/shared/admin/pipeline';
import { safeReturnPath } from '@/shared/admin/validation';

export const maxDuration = 60;

const JOB_TYPES: AdminJobType[] = ['COLLECT_SOURCE', 'DRAFT_CONTENT', 'AUDIT_SOURCE', 'AUDIT_DATABASE'];

export async function POST(request: Request) {
  try {
    await assertSameOrigin();
    const session = await assertAdminApi();
    const formData = await request.formData();
    const type = formData.get('type');
    if (typeof type !== 'string' || !JOB_TYPES.includes(type as AdminJobType)) {
      return NextResponse.json({ error: 'invalid job type' }, { status: 400 });
    }
    const targetType = typeof formData.get('targetType') === 'string' ? String(formData.get('targetType')) : null;
    const targetId = typeof formData.get('targetId') === 'string' ? String(formData.get('targetId')) : null;
    const returnTo = safeReturnPath(formData.get('returnTo'), '/admin/jobs');

    try {
      const jobId = await createAndRunAdminJob({
        type: type as AdminJobType,
        targetType,
        targetId,
        actor: session.sub,
      });
      return NextResponse.redirect(new URL(`${returnTo}?job=${jobId}&success=1`, request.url), 303);
    } catch (error) {
      const message = encodeURIComponent(error instanceof Error ? error.message : 'job failed');
      return NextResponse.redirect(new URL(`${returnTo}?jobError=${message}`, request.url), 303);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (error instanceof Error && error.message === 'INVALID_ORIGIN') return NextResponse.json({ error: 'invalid origin' }, { status: 403 });
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }
}
