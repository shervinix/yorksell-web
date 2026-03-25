import { NextResponse } from "next/server";

/**
 * In-memory sliding-window rate limiting (per Node process).
 *
 * For serverless / multi-instance production, counts are per instance only; consider
 * Redis (e.g. Upstash) for a shared store so limits apply globally.
 */
type Bucket = { windowStart: number; count: number };
const store = new Map<string, Bucket>();

const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  const maxAge = 3_600_000;
  for (const [k, b] of store.entries()) {
    if (now - b.windowStart > maxAge) store.delete(k);
  }
}

/**
 * Prefer the left-most X-Forwarded-For hop only when you trust your proxy to set it
 * (Vercel, nginx, etc.). Spoofed X-Forwarded-For is possible if the app is exposed
 * directly without stripping client-supplied values.
 */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 128);
  return "unknown";
}

export type RateLimitPreset = {
  /** Logical name for metrics / isolation */
  name: string;
  windowMs: number;
  maxPerIp: number;
  /** When omitted or user is anonymous, only IP limit applies */
  maxPerUser?: number;
};

export const RATE_LIMIT_PRESETS = {
  /** Listing search, featured, photo proxy, MLS search */
  publicRead: {
    name: "publicRead",
    windowMs: 60_000,
    maxPerIp: 120,
    maxPerUser: 400,
  },
  /** Contact / lead forms */
  publicWrite: {
    name: "publicWrite",
    windowMs: 3_600_000,
    maxPerIp: 40,
    maxPerUser: 20,
  },
  /** Signup */
  authSignup: {
    name: "authSignup",
    windowMs: 3_600_000,
    maxPerIp: 10,
  },
  /** NextAuth credential flows */
  nextAuth: {
    name: "nextAuth",
    windowMs: 900_000,
    maxPerIp: 25,
  },
  /** Authenticated member APIs */
  userSession: {
    name: "userSession",
    windowMs: 60_000,
    maxPerIp: 120,
    maxPerUser: 200,
  },
  /** Admin JSON APIs */
  admin: {
    name: "admin",
    windowMs: 60_000,
    maxPerIp: 200,
    maxPerUser: 400,
  },
  /** MLS sync trigger (expensive) */
  mlsSync: {
    name: "mlsSync",
    windowMs: 3_600_000,
    maxPerIp: 30,
  },
  /** Vercel / external cron hits */
  cron: {
    name: "cron",
    windowMs: 60_000,
    maxPerIp: 15,
  },
} as const;

function checkKey(
  key: string,
  windowMs: number,
  max: number,
  now: number
): { ok: true; remaining: number; resetSec: number } | { ok: false; resetSec: number } {
  cleanup(now);
  let b = store.get(key);
  if (!b || now - b.windowStart >= windowMs) {
    b = { windowStart: now, count: 0 };
    store.set(key, b);
  }
  if (b.count >= max) {
    const resetSec = Math.max(1, Math.ceil((b.windowStart + windowMs - now) / 1000));
    return { ok: false, resetSec };
  }
  b.count += 1;
  const remaining = max - b.count;
  const resetSec = Math.max(1, Math.ceil((b.windowStart + windowMs - now) / 1000));
  return { ok: true, remaining, resetSec };
}

function rateLimitResponse(limit: number, retryAfterSec: number): NextResponse {
  return NextResponse.json(
    {
      error: "Too many requests. Please try again later.",
      code: "RATE_LIMITED",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}

/**
 * Enforces IP limit always; if `userId` is set and preset defines `maxPerUser`,
 * enforces an additional per-user bucket (stricter of the two wins).
 */
export function enforceRateLimit(
  req: Request,
  preset: RateLimitPreset,
  userId?: string | null
): NextResponse | null {
  const now = Date.now();
  const ip = getClientIp(req);
  const ipKey = `ip:${preset.name}:${ip}`;
  const ipResult = checkKey(ipKey, preset.windowMs, preset.maxPerIp, now);
  if (!ipResult.ok) {
    return rateLimitResponse(preset.maxPerIp, ipResult.resetSec);
  }

  const maxUser = preset.maxPerUser;
  if (maxUser != null && userId) {
    const uKey = `user:${preset.name}:${userId}`;
    const uResult = checkKey(uKey, preset.windowMs, maxUser, now);
    if (!uResult.ok) {
      return rateLimitResponse(maxUser, uResult.resetSec);
    }
  }

  return null;
}
