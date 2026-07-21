import { NextResponse } from 'next/server';
import { assertSameOrigin, clearAdminSessionCookie, getAdminSession } from '@/shared/admin/auth';
import { writeAdminLog } from '@/shared/admin/audit';

export async function POST(request: Request) {
  try {
    await assertSameOrigin();
    const session = await getAdminSession();
    await clearAdminSessionCookie();
    if (session) {
      await writeAdminLog({
        actor: session.sub,
        action: 'ADMIN_LOGOUT',
        targetType: 'AdminSession',
      }).catch(() => undefined);
    }
    return NextResponse.redirect(new URL('/admin/login', request.url), 303);
  } catch {
    return NextResponse.json({ error: 'invalid origin' }, { status: 403 });
  }
}
