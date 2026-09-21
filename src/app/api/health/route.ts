import { NextResponse } from 'next/server';
import { db } from '@/shared/lib/db';
import { redis } from '@/shared/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const checks: Record<string, any> = { ok: true };

  // DB check
  try {
    // lightweight check
    await db.$queryRaw`SELECT 1`;
    checks.db = { ok: true };
  } catch (err) {
    checks.ok = false;
    checks.db = { ok: false, error: String(err) };
  }

  // Redis check
  if (redis) {
    try {
      await redis.ping();
      checks.redis = { ok: true };
    } catch (err) {
      checks.ok = false;
      checks.redis = { ok: false, error: String(err) };
    }
  } else {
    checks.redis = { ok: false, error: 'REDIS_NOT_CONFIGURED' };
  }

  return NextResponse.json(checks, { status: checks.ok ? 200 : 503 });
}
