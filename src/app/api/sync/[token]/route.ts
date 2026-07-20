import { NextResponse } from 'next/server';
import { prisma } from '@/shared/db/prisma';

const isValidToken = (token: string) => /^[0-9a-f-]{36}$/i.test(token);

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!isValidToken(token)) return NextResponse.json({ error: 'invalid token' }, { status: 400 });
  const profile = await prisma.syncProfile.findUnique({ where: { token } });
  if (!profile) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const changes = profile.notifyChanges
    ? await prisma.warning.findMany({
        where: { key: { in: profile.warningKeys }, updatedAt: { gt: profile.lastCheckedAt } },
        select: { key: true, title: true, updatedAt: true },
      })
    : [];
  return NextResponse.json({ warningKeys: profile.warningKeys, notifyChanges: profile.notifyChanges, changes });
}

export async function PUT(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!isValidToken(token)) return NextResponse.json({ error: 'invalid token' }, { status: 400 });
  const body = await request.json().catch(() => null) as { warningKeys?: unknown; notifyChanges?: unknown; acknowledge?: unknown } | null;
  if (!body || !Array.isArray(body.warningKeys) || body.warningKeys.length > 200) {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }
  const warningKeys = body.warningKeys.filter((key): key is string => typeof key === 'string').slice(0, 200);
  const profile = await prisma.syncProfile.upsert({
    where: { token },
    update: {
      warningKeys,
      notifyChanges: body.notifyChanges === true,
      ...(body.acknowledge === true ? { lastCheckedAt: new Date() } : {}),
    },
    create: { token, warningKeys, notifyChanges: body.notifyChanges === true },
  });
  return NextResponse.json({ warningKeys: profile.warningKeys, notifyChanges: profile.notifyChanges });
}