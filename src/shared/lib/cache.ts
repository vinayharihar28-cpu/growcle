import { redis } from "./redis";

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  const v = await redis.get(key);
  return v ? (JSON.parse(v) as T) : null;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 60) {
  if (!redis) return;
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function cacheDel(key: string) {
  if (!redis) return;
  await redis.del(key);
}
