import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "./redis";

let rateLimiter: RateLimiterRedis | null = null;

if (redis) {
  rateLimiter = new RateLimiterRedis({
    storeClient: redis as any,
    points: 100, // default points
    duration: 60, // per 60 seconds
    keyPrefix: "rlf",
  });
}

export { rateLimiter };
