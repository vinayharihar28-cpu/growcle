import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.warn("REDIS_URL not set — Redis client will not be initialized.");
}

let client: Redis | null = null;
if (redisUrl) {
  client = new Redis(redisUrl);
  client.on('error', (e: Error) => console.error('Redis error', e));
}

export const redis = client;
