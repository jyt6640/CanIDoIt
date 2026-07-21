import { NextResponse } from 'next/server';
import {
  assertSameOrigin,
  clearAdminSessionCookie,
  setAdminSessionCookie,
  verifyAdminCredentials,
} from '@/shared/admin/auth';
import { writeAdminLog } from '@/shared/admin/audit';

export async function POST(request: Request) {
  try {
    await assertSameOrigin();
    const contentType = request.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json')
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
    const username = typeof data.username === 'string' ? data.username.trim() : '';
    const password = typeof data.password === 'string' ? data.password : '';

    if (!verifyAdminCredentials(username, password)) {
      await writeAdminLog({
        actor: username || 'unknown',
        action: 'ADMIN_LOGIN_FAILED',
        targetType: 'AdminSession',
      }).catch(() => undefined);
      return NextResponse.redirect(new URL('/admin/login?error=1', request.url), 303);
    }

    await setAdminSessionCookie(username);
    await writeAdminLog({
      actor: username,
      action: 'ADMIN_LOGIN_SUCCEEDED',
      targetType: 'AdminSession',
    }).catch(() => undefined);
    return NextResponse.redirect(new URL('/admin', request.url), 303);
  } catch {
    return NextResponse.redirect(new URL('/admin/login?error=1', request.url), 303);
  }
}

export async function DELETE() {
  try {
    await assertSameOrigin();
  } catch {
    return NextResponse.json({ error: 'invalid origin' }, { status: 403 });
  }
  await clearAdminSessionCookie();
  return NextResponse.json({ ok: true });
}
