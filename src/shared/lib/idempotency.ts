import { redis } from './redis';

export async function runIdempotent<T>(key: string, ttlSeconds: number, handler: () => Promise<T>): Promise<{ result: T; fromCache: boolean }> {
  if (!redis) {
    const r = await handler();
    return { result: r, fromCache: false };
  }

  const lockKey = `idem:${key}`;
  const existing = await redis.get(lockKey);
  if (existing) {
    // Someone is processing — indicate duplicate
    throw new Error('DuplicateRequest');
  }

  // Use SET NX to claim
  const claimed = await redis.set(lockKey, 'processing', 'EX', ttlSeconds, 'NX');
  if (!claimed) {
    throw new Error('DuplicateRequest');
  }

  try {
    const r = await handler();
    await redis.set(lockKey, JSON.stringify({ done: true, result: r }), 'EX', ttlSeconds);
    return { result: r, fromCache: false };
  } catch (err) {
    await redis.del(lockKey);
    throw err;
  }
}

export async function getIdempotentResult<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  const v = await redis.get(`idem:${key}`);
  if (!v) return null;
  try {
    const parsed = JSON.parse(v);
    if (parsed && parsed.done) return parsed.result as T;
  } catch (err) {
    return null;
  }
  return null;
}
