/**
 * Extract listing photo URLs from CREA DDF raw JSON (listing.raw).
 * Prefers LargePhotoURL (full quality), then PhotoURL, then ThumbnailPhotoURL.
 * Returns all photos in order for use in a slideshow.
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

function pickUrl(rec: Record<string, unknown>): string | null {
  const s =
    nodeStr(rec.LargePhotoURL ?? rec.LargePhotoUrl) ??
    nodeStr(getByKey(rec, "LargePhotoURL", "LargePhotoUrl")) ??
    nodeStr(rec.PhotoURL ?? rec.PhotoUrl) ??
    nodeStr(getByKey(rec, "PhotoURL", "PhotoUrl")) ??
    nodeStr(rec.ThumbnailPhotoURL ?? rec.ThumbnailPhotoUrl) ??
    nodeStr(getByKey(rec, "ThumbnailPhotoURL", "MediaURL", "URL"));
  return typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://")) ? s : null;
}

function arrayify<T>(val: T | T[] | undefined | null): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

/** Quality order: 1 = best. Used to sort so we prefer LargePhotoURL over PhotoURL over Thumbnail. */
function urlQuality(url: string): number {
  const u = url.toLowerCase();
  if (u.includes("large") || u.includes("full") || u.includes("original")) return 3;
  if (u.includes("thumbnail") || u.includes("thumb")) return 1;
  return 2; // medium / PhotoURL
}

/** Recursively collect all photo URLs from obj (any structure). Prefer Large > PhotoURL > Thumbnail. */
function deepCollectPhotoUrls(obj: unknown, depth: number, seen: Set<string>, out: { url: string; quality: number }[]): void {
  if (depth > 6 || obj == null) return;
  if (typeof obj === "string") {
    if ((obj.startsWith("http://") || obj.startsWith("https://")) && !seen.has(obj)) {
      seen.add(obj);
      out.push({ url: obj, quality: urlQuality(obj) });
    }
    return;
  }
  if (typeof obj !== "object") return;
  const r = obj as Record<string, unknown>;
  const keys = Object.keys(r).filter((k) => /photo|media|url|image/i.test(k));
  for (const k of keys) {
    const v = r[k];
    const s = typeof v === "string" ? v : v && typeof v === "object" && "#text" in v ? String((v as { "#text": unknown })["#text"]) : null;
    if (typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://")) && !seen.has(s)) {
      seen.add(s);
      out.push({ url: s, quality: urlQuality(k + s) });
    }
    if (v && typeof v === "object" && !Array.isArray(v)) deepCollectPhotoUrls(v, depth + 1, seen, out);
    if (Array.isArray(v)) for (const item of v) deepCollectPhotoUrls(item, depth + 1, seen, out);
  }
  for (const v of Object.values(r)) {
    if (v && typeof v === "object" && !Array.isArray(v)) deepCollectPhotoUrls(v, depth + 1, seen, out);
    if (Array.isArray(v)) for (const item of v) deepCollectPhotoUrls(item, depth + 1, seen, out);
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

  const urls: string[] = [];
  const seen = new Set<string>();

  for (const item of propertyPhotoList) {
    if (item && typeof item === "object") {
      const url = pickUrl(item as Record<string, unknown>);
      if (url && !seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    }
  }

  if (urls.length > 0) return urls;

  const rootUrl =
    pickUrl(r) ??
    nodeStr(r.LargePhotoURL ?? r.PhotoURL ?? r.ThumbnailPhotoURL) ??
    nodeStr(getByKey(r, "LargePhotoURL", "PhotoURL", "ThumbnailPhotoURL"));
  if (rootUrl) return [rootUrl];

  // Fallback: deep-scan raw for any photo-like URLs (handles alternate CREA structures)
  const collected: { url: string; quality: number }[] = [];
  deepCollectPhotoUrls(r, 0, new Set(), collected);
  if (collected.length > 0) {
    collected.sort((a, b) => b.quality - a.quality);
    return collected.map((x) => x.url);
  }

  return [];
}
