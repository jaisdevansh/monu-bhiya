import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Graceful fallback if Redis env vars are missing (to prevent crash in dev)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

// Create a new ratelimiter
const ratelimit = redis
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per minute
        analytics: true,
        prefix: "@monuchai/ratelimit",
    })
    : null;

export async function checkRateLimit(identifier: string) {
    if (!ratelimit) {
        // If Redis is not configured, we allow requests (dev mode fallback)
        // In production, ensure UPSTASH_REDIS_REST_URL and TOKEN are set.
        return { success: true };
    }

    const { success } = await ratelimit.limit(identifier);
    return success;
}
