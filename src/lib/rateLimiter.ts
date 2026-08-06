// In-memory rate limiter using a Map with IP keys and sliding window
interface RateLimitData {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitData>();

// Cleans up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of store.entries()) {
    if (now > data.resetTime) {
      store.delete(ip);
    }
  }
}, 60000);

export function isRateLimited(ip: string, maxRequests: number = 10, windowMs: number = 3600000): boolean {
  const now = Date.now();
  const current = store.get(ip);

  if (!current) {
    store.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > current.resetTime) {
    // Window expired, reset
    store.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (current.count >= maxRequests) {
    return true; // Rate limited
  }

  current.count += 1;
  return false;
}
