import { createHash, timingSafeEqual } from "crypto";

/**
 * Constant-time comparison for secrets of arbitrary length (OWASP: avoid leaking
 * length via early-exit string comparison). Uses SHA-256 so both sides are fixed size.
 */
export function timingSafeStringEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}
