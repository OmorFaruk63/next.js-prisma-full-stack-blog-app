const rateLimitMap = new Map<string, { count: number; last: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, { count: 1, last: now });
    return true;
  }

  if (now - record.last > windowMs) {
    rateLimitMap.set(key, { count: 1, last: now });
    return true;
  }

  if (record.count >= limit) return false;

  record.count++;
  return true;
}
