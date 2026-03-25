/** Comma-separated MLS numbers in FEATURED_MLS_DEFAULTS (server-only env). */
export function defaultFeaturedMlsNumbers(): string[] {
  const raw = process.env.FEATURED_MLS_DEFAULTS?.trim();
  if (!raw) return ["C12677558", "N12855168", "C12733910"];
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length > 0 ? parts : ["C12677558", "N12855168", "C12733910"];
}
