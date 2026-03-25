/**
 * Extract listing photo URLs from CREA DDF raw JSON (listing.raw).
 * Only high-resolution images are returned: structured LargePhotoURL/LargePhotoUrl,
 * plus other URLs that pass strict HD heuristics (no thumbnails / small variants).
 */

function nodeStr(obj: unknown): string | null {
  if (obj == null) return null;
  if (typeof obj === "string") return obj.trim() || null;
  if (typeof obj === "number" && Number.isFinite(obj)) return String(obj);
  if (typeof obj === "object" && obj !== null && "#text" in obj)
    return String((obj as { "#text"?: unknown })["#text"] ?? "").trim() || null;
  return null;
}

function getByKey(obj: Record<string, unknown>, ...suffixes: string[]): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  const keys = Object.keys(obj);
  for (const suffix of suffixes) {
    const exact = obj[suffix];
    if (exact !== undefined && exact !== null) return exact;
    const lower = suffix.toLowerCase();
    const found = keys.find((k) => k.toLowerCase() === lower || k.endsWith(":" + suffix) || k.endsWith(suffix));
    if (found) return obj[found];
  }
  return undefined;
}

/** CREA “large” image fields only — never PhotoURL / Thumbnail (those are often lower res). */
function pickLargePhotoFieldUrl(rec: Record<string, unknown>): string | null {
  const s =
    nodeStr(rec.LargePhotoURL ?? rec.LargePhotoUrl) ??
    nodeStr(getByKey(rec, "LargePhotoURL", "LargePhotoUrl"));
  if (typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"))) {
    if (!looksLikeLowResUrl(s)) return s;
  }
  return null;
}

function arrayify<T>(val: T | T[] | undefined | null): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

/** True if the URL string clearly points at a thumbnail or small asset. */
function looksLikeLowResUrl(url: string): boolean {
  const u = url.toLowerCase();
  return (
    /\b(thumbnail|thumbnails|thumb|thumbs)\b/.test(u) ||
    /thumbnailphoto|_thumbnail|_thumb_|-thumb-|\/thumb\/|\/thumbs?\//.test(u) ||
    /\b(small|sm\b|mini|tiny|icon|avatar|lowres|low-res)\b/.test(u) ||
    /\b(medium|med\b|preview)\b/.test(u) ||
    /[?&]size=\s*(small|thumb|thumbnail|medium|s)\b/i.test(u)
  );
}

function parsePositiveInt(v: string | null): number {
  if (!v) return 0;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Strict HD check for URLs not sourced from LargePhotoURL fields.
 * Used for deep-scan / root fallbacks so we never mix in obvious low-res assets.
 */
export function isHdPhotoUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  // Our proxy always requests _LargePhoto_ first server-side.
  if (trimmed.startsWith("/api/listings/photo")) return true;

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return false;
  if (looksLikeLowResUrl(trimmed)) return false;

  const u = trimmed.toLowerCase();
  if (
    u.includes("largephoto") ||
    u.includes("_largephoto_") ||
    /\b(large|full|original|highres|high-res|maxres|max\b|xlarge|xxl|2x|@2x)\b/.test(u)
  ) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    const w = Math.max(
      parsePositiveInt(parsed.searchParams.get("w")),
      parsePositiveInt(parsed.searchParams.get("width"))
    );
    const h = Math.max(
      parsePositiveInt(parsed.searchParams.get("h")),
      parsePositiveInt(parsed.searchParams.get("height"))
    );
    const longest = Math.max(w, h);
    if (longest > 0 && longest < 900) return false;
    if (longest >= 1200) return true;
  } catch {
    /* ignore */
  }

  return false;
}

function canonicalizePhotoKey(input: string): string {
  try {
    const u = new URL(input);
    const path = u.pathname
      .toLowerCase()
      .replace(/_largephoto_|thumbnailphoto|photo/gi, "photo")
      .replace(/[-_](large|thumb|thumbnail|small|medium|full|original)\b/gi, "");
    return `${u.hostname.toLowerCase()}${path}`;
  } catch {
    return input
      .toLowerCase()
      .replace(/_largephoto_|thumbnailphoto|photo/gi, "photo")
      .replace(/[?&](w|h|width|height|q|quality|fit|crop|auto|fm|format)=[^&]*/gi, "");
  }
}

/** Prefer higher “rank” when two URLs map to the same canonical asset. */
function urlRank(url: string, fromLargeField: boolean): number {
  if (fromLargeField) return 100;
  if (isHdPhotoUrl(url)) {
    const low = url.toLowerCase();
    if (low.includes("largephoto") || low.includes("_largephoto_") || /\blarge\b/.test(low)) return 80;
    if (low.includes("original") || low.includes("full")) return 75;
    return 60;
  }
  return -1;
}

function addBestVariant(
  map: Map<string, { url: string; rank: number; order: number }>,
  url: string,
  order: number,
  fromLargeField: boolean
) {
  const rank = urlRank(url, fromLargeField);
  if (rank < 0) return;
  const key = canonicalizePhotoKey(url);
  const existing = map.get(key);
  if (!existing || rank > existing.rank) {
    map.set(key, { url, rank, order: existing ? existing.order : order });
  }
}

function deepCollectHdPhotoUrls(
  obj: unknown,
  depth: number,
  out: Map<string, { url: string; rank: number; order: number }>,
  counter: { value: number }
): void {
  if (depth > 6 || obj == null) return;
  if (typeof obj === "string") {
    if (obj.startsWith("http://") || obj.startsWith("https://")) {
      addBestVariant(out, obj, counter.value++, false);
    }
    return;
  }
  if (typeof obj !== "object") return;
  const r = obj as Record<string, unknown>;
  const keys = Object.keys(r).filter((k) => /photo|media|url|image/i.test(k));
  for (const k of keys) {
    const v = r[k];
    const s =
      typeof v === "string"
        ? v
        : v && typeof v === "object" && "#text" in v
          ? String((v as { "#text": unknown })["#text"])
          : null;
    if (typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"))) {
      addBestVariant(out, s, counter.value++, false);
    }
    if (v && typeof v === "object" && !Array.isArray(v)) deepCollectHdPhotoUrls(v, depth + 1, out, counter);
    if (Array.isArray(v)) for (const item of v) deepCollectHdPhotoUrls(item, depth + 1, out, counter);
  }
  for (const v of Object.values(r)) {
    if (v && typeof v === "object" && !Array.isArray(v)) deepCollectHdPhotoUrls(v, depth + 1, out, counter);
    if (Array.isArray(v)) for (const item of v) deepCollectHdPhotoUrls(item, depth + 1, out, counter);
  }
}

export function getListingPhotoUrls(raw: Record<string, unknown> | null | undefined): string[] {
  if (!raw || typeof raw !== "object") return [];

  const r = raw as Record<string, unknown>;
  const photoCollection = (r.Photo && typeof r.Photo === "object" ? r.Photo : r.Photos ?? getByKey(r, "Photo", "Photos")) as Record<string, unknown> | null | undefined;
  let photoLookup: Record<string, unknown> | null | undefined = photoCollection;

  if (photoCollection && typeof photoCollection === "object" && !Array.isArray(photoCollection)) {
    const keys = Object.keys(photoCollection).filter((k) => !k.startsWith("@_"));
    if (keys.length === 1) {
      const child = photoCollection[keys[0]];
      if (child != null && typeof child === "object" && !Array.isArray(child)) {
        photoLookup = child as Record<string, unknown>;
      }
    }
  }

  const propertyPhotoList =
    photoLookup && typeof photoLookup === "object" && !Array.isArray(photoLookup)
      ? arrayify(photoLookup.PropertyPhoto ?? photoLookup.Photo)
      : [];

  const variants = new Map<string, { url: string; rank: number; order: number }>();
  const counter = { value: 0 };

  for (const item of propertyPhotoList) {
    if (item && typeof item === "object") {
      const url = pickLargePhotoFieldUrl(item as Record<string, unknown>);
      if (url) addBestVariant(variants, url, counter.value++, true);
    }
  }

  let urls = [...variants.values()]
    .sort((a, b) => a.order - b.order)
    .map((x) => x.url);

  if (urls.length > 0) return urls;

  const rootLarge = pickLargePhotoFieldUrl(r);
  if (rootLarge) return [rootLarge];

  const collected = new Map<string, { url: string; rank: number; order: number }>();
  deepCollectHdPhotoUrls(r, 0, collected, { value: 0 });
  if (collected.size > 0) {
    urls = [...collected.values()]
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return b.rank - a.rank;
      })
      .map((x) => x.url);
  }

  return urls;
}
