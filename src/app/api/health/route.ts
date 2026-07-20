import { NextResponse } from 'next/server';
import { prisma } from '@/shared/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: 'ok',
      database: 'reachable',
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(JSON.stringify({ event: 'health_check_failed', error: error instanceof Error ? error.message : 'unknown' }));
    return NextResponse.json(
      { status: 'error', database: 'unreachable', timestamp: new Date().toISOString() },
      { status: 503 },
    );
  }
}