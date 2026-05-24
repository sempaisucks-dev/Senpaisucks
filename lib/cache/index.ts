import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required.");
}

export const redis = new Redis({
  url,
  token,
});

const DEFAULT_TTL_SECONDS = 3600;

export async function cacheGet<T>(key: string): Promise<T | null> {
  const cached = await redis.get<T>(key);
  return cached === null ? null : cached;
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds = DEFAULT_TTL_SECONDS): Promise<void> {
  await redis.set(key, value, { ex: ttlSeconds });
}

export async function cacheDel(key: string): Promise<void> {
  await redis.del(key);
}
