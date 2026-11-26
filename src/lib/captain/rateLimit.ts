import "server-only";

// A simple per-visitor limit to slow down form spam. It lives in server memory, so on a host that runs several
// copies of the app each copy counts separately: good enough to stop casual abuse, not a hard guarantee.
const hits = new Map<string, number[]>();

/** True when this key has already used up `max` requests within the last `windowMs`. */
export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return false;
}

export const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
