import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { timingSafeStringEqual } from "@/server/secure-compare";

// NOTE:
// This route is designed for CREA DDF/RETS endpoints which use DIGEST auth.
// Required deps (install in your project):
//   npm i digest-fetch fast-xml-parser
//
// Required env:
//   DDF_USERNAME=...
//   DDF_PASSWORD=...
// Optional env:
//   DDF_LOGIN_URL=https://data.crea.ca/Login.svc/Login
//   DDF_SEARCH_URL=https://data.crea.ca/Search.svc/Search
//   MLS_SYNC_KEY=... (required in production only)

export const runtime = "nodejs";
export const maxDuration = 300;

// Prisma singleton (safe for Next dev/hot reload)
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma = global.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global.__prisma = prisma;

function json(data: unknown, init?: ResponseInit) {
  return new NextResponse(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function toInt(v: any): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function toFloat(v: any): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function pickFirst<T>(...vals: T[]): T | undefined {
  for (const v of vals) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    return v;
  }
  return undefined;
}

/** Get string from parsed XML node (may be plain string, number, or { "#text": "..." }). */
function nodeStr(obj: unknown): string | null {
  if (obj == null) return null;
  if (typeof obj === "string") return obj.trim() || null;
  if (typeof obj === "number" && Number.isFinite(obj)) return String(obj);
  if (typeof obj === "object" && obj !== null && "#text" in obj)
    return String((obj as { "#text"?: unknown })["#text"] ?? "").trim() || null;
  return null;
}

/** Get first non-empty string from nodeStr of many keys (handles CREA naming). */
function pickNodeStr(raw: Record<string, unknown>, ...keys: string[]): string | null {
  for (const k of keys) {
    const v = raw[k];
    const s = nodeStr(v);
    if (s) return s;
  }
  return null;
}

/**
 * Extremely defensive normalizer that can handle Standard-XML shapes (including CREA DDF).
 * We store the full raw payload as `raw` so we can improve mapping later.
 */
function normalizeListing(raw: any) {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  // CREA: PropertyDetails has @_ID (DDF internal id) and child ListingID (MLS number). Use @_ID for ddfId so we match master list and DB key; use ListingID for mlsNumber.
  const ddfIdRaw =
    (r["@_ID"] != null ? String(r["@_ID"]) : null) ??
    pickNodeStr(r, "ListingID", "ListingId", "ID", "Id", "id", "listingid") ??
    getByKey(r, "ListingID", "ListingId", "ID", "Id");
  const ddfIdStr = nodeStr(ddfIdRaw) ?? (typeof ddfIdRaw === "string" ? ddfIdRaw.trim() : null) ?? (typeof ddfIdRaw === "number" ? String(ddfIdRaw) : null);
  if (!ddfIdStr) return null;

  const addr = (r?.Address && typeof r.Address === "object" ? r.Address : null) as Record<string, unknown> | null;
  const building = (r?.Building && typeof r.Building === "object" ? r.Building : null) as Record<string, unknown> | null;
  const photos = r?.Photos as Record<string, unknown> | undefined;
  const media0 = (photos?.Photo && Array.isArray(photos.Photo) ? photos.Photo[0] : photos?.Photo) as Record<string, unknown> | undefined;
  const mediaArr = r?.Media as unknown[] | undefined;
  const mediaFirst = mediaArr?.[0] as Record<string, unknown> | undefined;

  // CREA/RETS: try both exact keys and getByKey (finds namespaced e.g. crea:UnparsedAddress)
  // CREA Appendix G: Address.StreetAddress or AddressLine1
  const addressLine =
    (addr ? pickNodeStr(addr, "StreetAddress", "AddressLine1", "AddressText", "UnparsedAddress") : null) ??
    pickNodeStr(r, "StreetAddress", "AddressLine1", "UnparsedAddress", "AddressText", "Address") ??
    nodeStr(getByKey(r, "StreetAddress", "AddressLine1", "UnparsedAddress")) ??
    pickFirst(addr?.StreetAddress, addr?.AddressLine1, r?.AddressText, r?.UnparsedAddress) ?? null;

  const city =
    pickNodeStr(r, "City") ?? nodeStr(getByKey(r, "City")) ??
    (addr ? pickNodeStr(addr, "City") : null) ??
    pickFirst(addr?.City, r?.City) ?? null;

  const province =
    pickNodeStr(r, "Province", "ProvinceCode") ?? nodeStr(getByKey(r, "Province", "ProvinceCode")) ??
    (addr ? pickNodeStr(addr, "Province", "ProvinceCode") : null) ??
    pickFirst(addr?.Province, r?.Province) ?? null;

  const postalCode =
    pickNodeStr(r, "PostalCode") ?? nodeStr(getByKey(r, "PostalCode")) ??
    (addr ? pickNodeStr(addr, "PostalCode") : null) ??
    pickFirst(addr?.PostalCode, r?.PostalCode) ?? null;

  const price = toInt(
    pickNodeStr(r, "ListPrice", "Price", "AskingPrice") ?? nodeStr(getByKey(r, "ListPrice", "Price")) ??
    pickFirst(r?.Price, r?.AskingPrice, r?.ListPrice)
  );

  // CREA Appendix F: Building.BedroomsTotal, Building.BathroomTotal
  const beds = toInt(
    (building ? pickNodeStr(building, "BedroomsTotal", "BedroomsAboveGround", "Bedrooms", "BedRooms") : null) ??
    pickNodeStr(r, "BedroomsTotal", "Bedrooms", "BedRooms") ??
    nodeStr(getByKey(r, "BedroomsTotal", "Bedrooms")) ??
    pickFirst(building?.BedroomsTotal, building?.Bedrooms, r?.Bedrooms, r?.BedRooms)
  );
  const baths = toInt(
    (building ? pickNodeStr(building, "BathroomTotal", "Bathrooms", "BathRooms") : null) ??
    pickNodeStr(r, "BathroomTotal", "Bathrooms", "BathRooms") ??
    nodeStr(getByKey(r, "BathroomTotal", "Bathrooms")) ??
    pickFirst(building?.BathroomTotal, r?.Bathrooms, r?.BathRooms)
  );

  const propertyType =
    pickNodeStr(r, "PropertyType", "Type") ?? nodeStr(getByKey(r, "PropertyType", "Type")) ??
    pickFirst(r?.PropertyType, r?.Type, building?.Type, (r?.Property as Record<string, unknown>)?.Type) ?? null;

  // CREA Appendix F: Photo (collection) → PropertyPhoto[] with PhotoURL, LargePhotoURL, ThumbnailURL
  // DDF feed may wrap content under a namespace key (e.g. Photo: { "urn:...": { PropertyPhoto: [...] } }); unwrap once.
  const photoCollection = (r?.Photo && typeof r.Photo === "object" ? r.Photo : getByKey(r, "Photo")) as Record<string, unknown> | null | undefined;
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
  const propertyPhotoList = photoLookup && typeof photoLookup === "object" && !Array.isArray(photoLookup)
    ? Array.isArray(photoLookup.PropertyPhoto)
      ? (photoLookup.PropertyPhoto as unknown[])
      : photoLookup.PropertyPhoto
        ? [photoLookup.PropertyPhoto]
        : []
    : [];
  const firstPropertyPhoto =
    propertyPhotoList[0] && typeof propertyPhotoList[0] === "object"
      ? (propertyPhotoList[0] as Record<string, unknown>)
      : null;
  // When Photo exists but has no PropertyPhoto[], treat Photo as single object with URL (CREA DDF fetchDetails response shape).
  const photoCollectionUrl =
    photoLookup && typeof photoLookup === "object" && !Array.isArray(photoLookup) && propertyPhotoList.length === 0
      ? (pickNodeStr(photoLookup, "LargePhotoURL", "PhotoURL", "ThumbnailPhotoURL", "MediaURL", "URL") ??
         nodeStr((photoLookup.LargePhotoURL ?? photoLookup.PhotoURL ?? photoLookup.ThumbnailPhotoURL ?? photoLookup.MediaURL ?? photoLookup.URL) as unknown) ??
         nodeStr(getByKey(photoLookup, "LargePhotoURL", "PhotoURL", "ThumbnailPhotoURL", "MediaURL", "URL")))
      : null;
  // CREA DDF exposes ThumbnailPhotoURL, PhotoURL, LargePhotoURL directly on the payload (post-2020); prefer root-level then first PropertyPhoto.
  const photoUrlStr =
    (firstPropertyPhoto
      ? (pickNodeStr(firstPropertyPhoto, "LargePhotoURL", "PhotoURL", "ThumbnailPhotoURL", "MediaURL", "URL") ??
         nodeStr(firstPropertyPhoto.LargePhotoURL ?? firstPropertyPhoto.PhotoURL ?? firstPropertyPhoto.ThumbnailPhotoURL ?? firstPropertyPhoto.MediaURL ?? firstPropertyPhoto.URL))
      : null) ??
    photoCollectionUrl ??
    pickNodeStr(r, "LargePhotoURL", "PhotoURL", "ThumbnailPhotoURL", "AlternateURL", "PhotoUrl") ??
    nodeStr(getByKey(r, "LargePhotoURL", "PhotoURL", "ThumbnailPhotoURL", "AlternateURL", "PhotoUrl")) ??
    pickNodeStr(r, "AlternateURL", "PhotoURL", "PhotoUrl") ??
    nodeStr(getByKey(r, "AlternateURL", "PhotoURL", "PhotoUrl")) ??
    pickNodeStr(r, "PhotoURL", "PhotoUrl") ??
    nodeStr(media0) ??
    nodeStr(mediaFirst?.MediaURL ?? mediaFirst?.URL) ??
    deepScanPhotoUrl(r) ??
    null;
  const photoUrl = typeof photoUrlStr === "string" && photoUrlStr.startsWith("http") ? photoUrlStr : null;

  // #region agent log
  if (!photoUrl) {
    const g = global as unknown as { __photoLogCount: number };
    g.__photoLogCount = (g.__photoLogCount || 0) + 1;
    if (g.__photoLogCount <= 5) {
      const photoKeys = Object.keys(r).filter((k) => /photo|media|url|image/i.test(k));
      const photoCollectionKeys = photoCollection && typeof photoCollection === "object" ? Object.keys(photoCollection) : [];
      const payload = {
        location: "mls/sync/route.ts:normalizeListing",
        message: "DDF listing photo extraction (photoUrl null)",
        data: {
          ddfId: ddfIdStr,
          hasPhotoCollection: Boolean(photoCollection && typeof photoCollection === "object"),
          photoCollectionKeys,
          hasFirstPropertyPhoto: Boolean(firstPropertyPhoto),
          firstPropertyPhotoKeys: firstPropertyPhoto ? Object.keys(firstPropertyPhoto) : [],
          photoUrlStrLen: typeof photoUrlStr === "string" ? photoUrlStr.length : 0,
          photoUrlStrStartsHttp: typeof photoUrlStr === "string" && photoUrlStr.startsWith("http"),
          rawPhotoRelatedKeys: photoKeys,
        },
        timestamp: Date.now(),
        hypothesisId: "H1",
      };
      try {
        require("fs").appendFileSync(
          require("path").join(process.cwd(), ".cursor", "debug.log"),
          JSON.stringify(payload) + "\n"
        );
      } catch {}
      fetch("http://127.0.0.1:7242/ingest/989fcf82-5e2c-43b6-af60-a19ff17876f2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  }
  // #endregion

  // CREA: interior area – many boards use Building.SizeInterior / SizeTotal / BuildingAreaTotal / TotalFloorArea, etc.
  const sqft = toInt(
    (building
      ? pickNodeStr(
          building,
          "SizeInterior",
          "SizeTotal",
          "BuildingAreaTotal",
          "BuildingArea",
          "TotalFloorArea",
          "InteriorFloorArea",
          "SquareFeet",
          "LivingArea"
        )
      : null) ??
      pickNodeStr(
        r,
        "SizeInterior",
        "SizeTotal",
        "BuildingAreaTotal",
        "BuildingArea",
        "TotalFloorArea",
        "InteriorFloorArea",
        "SquareFeet",
        "LivingArea"
      ) ??
      nodeStr(getByKey(r, "SizeInterior", "SizeTotal", "BuildingAreaTotal", "TotalFloorArea", "SquareFeet")) ??
      pickFirst(
        building?.SizeInterior,
        building?.SizeTotal,
        building?.BuildingAreaTotal,
        building?.TotalFloorArea,
        building?.SquareFeet,
        building?.LivingArea,
        (r as any)?.SizeInterior,
        (r as any)?.SizeTotal,
        (r as any)?.BuildingAreaTotal,
        (r as any)?.TotalFloorArea,
        (r as any)?.SquareFeet,
        (r as any)?.LivingArea
      )
  );

  const yearBuilt = toInt(
    (building ? pickNodeStr(building, "ConstructedDate", "YearBuilt", "ConstructionDate") : null) ??
    pickNodeStr(r, "ConstructedDate", "YearBuilt", "ConstructionDate") ??
    pickFirst(building?.ConstructedDate, building?.YearBuilt, r?.ConstructedDate, r?.YearBuilt)
  );

  const mlsNumberRaw =
    pickNodeStr(r, "MLSNumber", "MlsNumber", "ListingNumber", "ListingID") ??
    nodeStr(getByKey(r, "MLSNumber", "ListingNumber", "ListingID")) ??
    pickFirst(r?.MlsNumber, r?.MLSNumber, r?.ListingNumber, r?.ListingID);
  const mlsNumber =
    typeof mlsNumberRaw === "string" ? mlsNumberRaw : typeof mlsNumberRaw === "number" ? String(mlsNumberRaw) : null;

  const statusRaw = pickNodeStr(r, "Status", "ListingStatus", "TransactionType") ?? pickFirst(r?.Status, r?.ListingStatus, r?.TransactionType);
  const status = statusRaw != null ? String(statusRaw) : null;

  // CREA DDF / RETS: coordinates when provided by board (Latitude/Longitude or Geo*)
  const lat =
    toFloat(pickNodeStr(r, "Latitude", "Lat", "GeoLatitude") ?? getByKey(r, "Latitude", "Lat", "GeoLatitude")) ??
    (addr ? toFloat(pickNodeStr(addr, "Latitude", "Lat") ?? getByKey(addr, "Latitude", "Lat")) : null);
  const lng =
    toFloat(pickNodeStr(r, "Longitude", "Lng", "Lon", "GeoLongitude") ?? getByKey(r, "Longitude", "Lng", "Lon", "GeoLongitude")) ??
    (addr ? toFloat(pickNodeStr(addr, "Longitude", "Lng", "Lon") ?? getByKey(addr, "Longitude", "Lng", "Lon")) : null);

  return {
    ddfId: ddfIdStr,
    mlsNumber,
    status: typeof status === "string" && status.trim() ? status : null,
    addressLine: typeof addressLine === "string" ? addressLine : null,
    city: typeof city === "string" ? city : null,
    province: typeof province === "string" ? province : null,
    postalCode: typeof postalCode === "string" ? postalCode : null,
    lat,
    lng,
    price,
    beds,
    baths,
    sqft,
    yearBuilt,
    propertyType: typeof propertyType === "string" ? propertyType : null,
    photoUrl: typeof photoUrl === "string" ? photoUrl : null,
    raw: JSON.parse(JSON.stringify(r)) as Record<string, unknown>,
  };
}

function isAuthorized(req: Request) {
  // For dev convenience, allow without a key.
  if (process.env.NODE_ENV !== "production") return true;

  const expected = process.env.MLS_SYNC_KEY?.trim();
  if (!expected) return false;

  const got = req.headers.get("x-mls-sync-key") || "";
  return timingSafeStringEqual(got, expected);
}

function arrayify<T>(val: T | T[] | undefined | null): T[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

/** Get value from object by key, or by key ending with suffix (for namespaced keys like "crea:ListingID"). */
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

/** Recursively scan object for any key that looks like a photo URL (CREA namespaced or nested). Returns first http(s) string found. */
function deepScanPhotoUrl(obj: unknown, depth = 0): string | null {
  if (depth > 4 || obj == null) return null;
  if (typeof obj === "string" && (obj.startsWith("http://") || obj.startsWith("https://"))) return obj;
  if (typeof obj !== "object") return null;
  const r = obj as Record<string, unknown>;
  const photoKeys = Object.keys(r).filter(
    (k) => /(largephotourl|photourl|thumbnailphotourl|photo_url|mediaurl)/i.test(k)
  );
  for (const k of photoKeys) {
    const v = r[k];
    const s = typeof v === "string" ? v : v && typeof v === "object" && "#text" in v ? String((v as { "#text": unknown })["#text"]) : null;
    if (typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"))) return s;
  }
  for (const v of Object.values(r)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const found = deepScanPhotoUrl(v, depth + 1);
      if (found) return found;
    }
    if (Array.isArray(v)) {
      for (const item of v) {
        const found = deepScanPhotoUrl(item, depth + 1);
        if (found) return found;
      }
    }
  }
  return null;
}

/**
 * If the parser put default-namespace children under a single key (e.g. namespace URI),
 * merge that object into the record so normalizeListing sees ListingID, Building, etc.
 */
function flattenRecord(rec: Record<string, unknown>): Record<string, unknown> {
  if (!rec || typeof rec !== "object") return rec;
  const keys = Object.keys(rec).filter((k) => !k.startsWith("@_"));
  if (keys.length !== 1) return rec;
  const child = rec[keys[0]];
  if (child == null || typeof child !== "object" || Array.isArray(child)) return rec;
  const childObj = child as Record<string, unknown>;
  const out = { ...rec };
  delete out[keys[0]];
  Object.assign(out, childObj);
  return out;
}

function extractProperties(parsed: any): any[] {
  // CREA DDF Standard-XML: RETS → RETS-RESPONSE → PropertyDetails[] (Appendix E/F)
  const root = parsed?.RETS ?? parsed;
  let resp = root?.["RETS-RESPONSE"] ?? root?.RETSRESPONSE ?? root?.Response ?? root;
  if (!resp || typeof resp !== "object") return [];

  // If parser nested default-namespace content under one key (e.g. "urn:CREA.Search.Property"), unwrap
  let respObj = resp as Record<string, unknown>;
  if (!respObj.PropertyDetails && !getByKey(respObj, "PropertyDetails")) {
    const keys = Object.keys(respObj).filter((k) => !k.startsWith("@_"));
    const wrapper = keys.find((k) => {
      const v = respObj[k];
      return v != null && typeof v === "object" && !Array.isArray(v) && ((v as Record<string, unknown>).PropertyDetails != null || (v as Record<string, unknown>).Property != null);
    });
    if (wrapper) respObj = respObj[wrapper] as Record<string, unknown>;
  }
  resp = respObj;

  // CREA: prefer PropertyDetails (full listing). Fall back to Property (master list, ID/LastUpdated only).
  const propertyDetails = resp?.PropertyDetails ?? getByKey(resp as Record<string, unknown>, "PropertyDetails");
  if (propertyDetails) return arrayify(propertyDetails);

  const details = resp?.PropertyDetails;
  if (details?.Property) return arrayify(details.Property);

  const results = resp?.Results;
  if (results?.PropertyDetails) return arrayify(results.PropertyDetails);
  if (results?.Property) return arrayify(results.Property);

  for (const [k, v] of Object.entries(resp)) {
    if (k.endsWith("PropertyDetails") && v && typeof v === "object")
      return arrayify(Array.isArray(v) ? v : [v]);
  }

  // Fallback: Property (master list) so we at least get ddfId; address/price/photos will be null until we get PropertyDetails
  const property = resp?.Property ?? getByKey(resp as Record<string, unknown>, "Property");
  if (property) return arrayify(property);

  return [];
}

const HTTP_TIMEOUT_MS = 90_000;

async function digestGet(
  url: string,
  username: string,
  password: string,
  accept: string,
  cookie?: string,
  signal?: AbortSignal
) {
  const { default: DigestClient } = await import("digest-fetch");

  const client = new DigestClient(username, password, {
    algorithm: "MD5",
  });

  const res = await client.fetch(url, {
    method: "GET",
    headers: {
      accept,
      "user-agent": "yorksell-web/1.0",
      ...(cookie ? { cookie } : {}),
    },
    cache: "no-store",
    signal,
  } as RequestInit);

  const text = await res.text();
  return {
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    text,
    contentType: res.headers.get("content-type") || "",
    setCookie: res.headers.get("set-cookie") || "",
  };
}

/** Strip default namespace so parser exposes child elements (ListingID, Address, etc.) as direct keys. */
function stripDefaultNamespace(xml: string): string {
  return xml.replace(/\s*xmlns="[^"]*"/g, "");
}

async function parseXml(xml: string, options?: { stripNamespace?: boolean }) {
  const raw = options?.stripNamespace ? stripDefaultNamespace(xml) : xml;
  const { XMLParser } = await import("fast-xml-parser");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    removeNSPrefix: true,
    isArray: (name) =>
      name === "PropertyDetails" ||
      name === "Property" ||
      name === "PropertyPhoto" ||
      name === "Photo" ||
      name === "Media" ||
      name === "Office" ||
      name === "Agent",
  });
  return parser.parse(raw);
}

function extractSessionCookie(setCookieHeader: string): string | null {
  // Expect something like: X-SESSIONID=...; Path=/; Secure; HttpOnly
  const m = /(^|,\s*)X-SESSIONID=([^;\s]+)/i.exec(setCookieHeader);
  if (!m) return null;
  return `X-SESSIONID=${m[2]}`;
}

function extractRetsUrlsFromLogin(parsed: any) {
  const root = parsed?.RETS ?? parsed;
  const resp = root?.["RETS-RESPONSE"] ?? root?.RETSRESPONSE ?? root?.Response ?? root;

  // The XML parser may turn the RETS-RESPONSE block into a string with newline-separated key=value pairs.
  const body: string =
    typeof resp === "string"
      ? resp
      : typeof resp?.["RETS-RESPONSE"] === "string"
        ? resp["RETS-RESPONSE"]
        : "";

  const lines = body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const map: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim();
    if (k && v) map[k] = v;
  }

  return { map, loginUrl: map.Login, searchUrl: map.Search, getObjectUrl: map.GetObject };
}

type StepLog = { step: string; start?: boolean; done?: boolean; ms?: number; message?: string };

export async function POST(req: Request) {
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.mlsSync);
  if (rl) return rl;

  const steps: StepLog[] = [];
  const step = (name: string, fn: () => Promise<void> | void) => {
    const startMs = Date.now();
    steps.push({ step: name, start: true });
    console.log(`[mls/sync] step=${name} start`);
    return Promise.resolve(fn()).then(
      () => {
        const ms = Date.now() - startMs;
        steps.push({ step: name, done: true, ms });
        console.log(`[mls/sync] step=${name} done in ${(ms / 1000).toFixed(1)}s`);
      },
      (e) => {
        const ms = Date.now() - startMs;
        steps.push({ step: name, done: false, ms, message: e?.message });
        console.log(`[mls/sync] step=${name} failed after ${(ms / 1000).toFixed(1)}s:`, e?.message);
        throw e;
      }
    );
  };

  const SYNC_STATE_NAME = "mls_sync";
  const setSyncState = async (update: {
    status?: string;
    lastError?: string | null;
    lastRunAt?: Date;
    processed?: number;
    upserted?: number;
    errorCount?: number;
  }) => {
    const now = new Date();
    await prisma.ddfSyncState.upsert({
      where: { name: SYNC_STATE_NAME },
      create: { name: SYNC_STATE_NAME, lastRunAt: now, ...update },
      update: { ...update, lastRunAt: update.lastRunAt ?? now, updatedAt: now },
    });
  };

  try {
    if (!isAuthorized(req)) {
      return json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    await setSyncState({ status: "running", lastError: null });

    const url = new URL(req.url);
    // Cap sync so we never pull thousands: env MLS_SYNC_MAX_LISTINGS (e.g. 500) or 500 max
    const absoluteMax = Math.min(
      5000,
      Math.max(50, Number(process.env.MLS_SYNC_MAX_LISTINGS) || 500)
    );
    const limitParam = url.searchParams.get("limit");
    const defaultLimit = 50;
    const limit = Math.max(1, Math.min(absoluteMax, Number(limitParam || defaultLimit)));
    const maxPages = Math.max(1, Math.min(50, Number(url.searchParams.get("pages") || 5)));
    const dryRun =
      url.searchParams.get("dryRun") === "1" || url.searchParams.get("dryRun") === "true";
    const debug = url.searchParams.get("debug") === "1";

    const username = env("DDF_USERNAME");
    const password = env("DDF_PASSWORD");

    const LOGIN_URL = process.env.DDF_LOGIN_URL || "https://data.crea.ca/Login.svc/Login";
    const FALLBACK_SEARCH_URL = process.env.DDF_SEARCH_URL || "https://data.crea.ca/Search.svc/Search";

    let loginRes: Awaited<ReturnType<typeof digestGet>> | undefined;

    await step("login", async () => {
      const ac = new AbortController();
      const timeoutId = setTimeout(() => ac.abort(), HTTP_TIMEOUT_MS);
      try {
        const p = digestGet(LOGIN_URL, username, password, "application/xml", undefined, ac.signal);
        loginRes = await p;
      } finally {
        clearTimeout(timeoutId);
      }
      if (!loginRes) throw new Error("Login request failed");
    });

    if (!loginRes?.ok) {
      const errMsg = `Login failed (${loginRes?.status}): ${loginRes?.statusText}`;
      await setSyncState({ status: "failed", lastError: errMsg });
      return json(
        { ok: false, error: errMsg, hint: loginRes?.text.slice(0, 300), steps },
        { status: 502 }
      );
    }

    let sessionCookie: string | null = null;
    let SEARCH_URL = FALLBACK_SEARCH_URL;
    const FALLBACK_GET_OBJECT_URL = "https://data.crea.ca/Object.svc/GetObject";
    let GET_OBJECT_URL = FALLBACK_GET_OBJECT_URL;
    let loginResponseKeys: Record<string, string> = {};
    await step("extract_session", async () => {
      const loginParsed = await parseXml(loginRes!.text);
      sessionCookie = extractSessionCookie(loginRes!.setCookie);
      const urls = extractRetsUrlsFromLogin(loginParsed);
      loginResponseKeys = urls.map;
      SEARCH_URL = urls.searchUrl || FALLBACK_SEARCH_URL;
      GET_OBJECT_URL = urls.getObjectUrl || FALLBACK_GET_OBJECT_URL;
    });

    if (!sessionCookie) {
      const errMsg = "Login succeeded but no X-SESSIONID cookie was returned. Cannot proceed.";
      await setSyncState({ status: "failed", lastError: errMsg });
      return json(
        {
          ok: false,
          error: errMsg,
          note: "Per CREA DDF docs, Search requests must include the X-SESSIONID cookie set by Login.",
          setCookieHeader: loginRes?.setCookie.slice(0, 200),
          steps,
        },
        { status: 502 }
      );
    }

    let processed = 0;
    let upserted = 0;
    let skipped = 0;
    let errors = 0;
    let pagesFetched = 0;
    let searchResFirst200: string | null = null;
    let metadataResult: { resource?: unknown; propertyClass?: unknown } | null = null;

    const wantMetadata = url.searchParams.get("metadata") === "1";
    if (wantMetadata && loginResponseKeys.GetMetadata) {
      const metaUrl = loginResponseKeys.GetMetadata;
      await step("get_metadata", async () => {
        const metaParams = new URLSearchParams({
          Type: "METADATA-RESOURCE",
          Format: "STANDARD-XML",
          ID: "0",
        });
        const resourceRes = await digestGet(
          `${metaUrl}?${metaParams.toString()}`,
          username,
          password,
          "application/xml",
          sessionCookie!,
          undefined
        );
        let resourceParsed: unknown = null;
        if (resourceRes?.ok && resourceRes.text) {
          resourceParsed = await parseXml(resourceRes.text);
        }
        const classParams = new URLSearchParams({
          Type: "METADATA-CLASS",
          Format: "STANDARD-XML",
          ID: "Property",
        });
        const classRes = await digestGet(
          `${metaUrl}?${classParams.toString()}`,
          username,
          password,
          "application/xml",
          sessionCookie!,
          undefined
        );
        let classParsed: unknown = null;
        if (classRes?.ok && classRes.text) {
          classParsed = await parseXml(classRes.text);
        }
        metadataResult = { resource: resourceParsed, propertyClass: classParsed };
      });
    }

    const perPage = Math.max(1, Math.min(100, Number(url.searchParams.get("perPage") || 100)));
    const searchClass = url.searchParams.get("class") || "Property";
    const fetchDetails =
      url.searchParams.get("fetchDetails") === "1" || url.searchParams.get("fetchDetails") === "true";
    const debugDetails = url.searchParams.get("debugDetails") === "1";
    // Optional province filter (e.g. ON). Empty = no filter. Some feeds return 20206 with Province=ON.
    // CREA DDF: (ID=0+) is numeric; (ID=*) is string/wildcard. Override with ?query= to try alternatives.
    const provinceFilter = url.searchParams.get("province") ?? process.env.MLS_PROVINCE ?? "";
    const customQuery = url.searchParams.get("query");
    const dmqlQuery =
      customQuery != null && customQuery.trim() !== ""
        ? customQuery.trim()
        : provinceFilter
          ? `(ID=0+),(Province=${provinceFilter})`
          : "(ID=0+)";

    const sample: any[] = [];
    let firstPropertyXml: string | null = null;
    let firstRawRecord: Record<string, unknown> | null = null;
    let firstUpsertError: string | null = null;
    let detailsDebug: { rawXmlFirst500?: string; parsedKeys?: string[]; parsedSample?: string } | null = null;

    for (let page = 0; page < maxPages && processed < limit; page++) {
      const offset = 1 + page * perPage;
      const pageNum = page + 1;
      const searchStepName = `search_page_${pageNum}`;
      const parseStepName = `parse_page_${pageNum}`;
      const upsertStepName = `upsert_page_${pageNum}`;

      const searchParams = new URLSearchParams({
        Format: "STANDARD-XML",
        SearchType: "Property",
        Class: searchClass,
        QueryType: "DMQL2",
        Query: dmqlQuery,
        Count: "1",
        Limit: String(perPage),
        Offset: String(offset),
        Culture: "en-CA",
      });

      const searchUrl = `${SEARCH_URL}?${searchParams.toString()}`;
      let searchRes: Awaited<ReturnType<typeof digestGet>>;

      await step(searchStepName, async () => {
        const ac = new AbortController();
        const timeoutId = setTimeout(() => ac.abort(), HTTP_TIMEOUT_MS);
        try {
          const p = digestGet(searchUrl, username, password, "application/xml", sessionCookie!, ac.signal);
          searchRes = await p;
        } finally {
          clearTimeout(timeoutId);
        }
        if (!searchRes) throw new Error(`Search page ${pageNum} request failed`);
      });

      if (!searchRes!.ok) {
        const errMsg = `Search failed (${searchRes!.status}): ${searchRes!.statusText}`;
        await setSyncState({ status: "failed", lastError: errMsg });
        return json(
          {
            ok: false,
            error: errMsg,
            first200: searchRes!.text.slice(0, 200),
            usedUrl: SEARCH_URL,
            note:
              "If you see an authorization message, confirm your DDF username/password and that your account is approved for DDF access.",
            steps,
          },
          { status: 502 }
        );
      }

      if (!searchResFirst200) searchResFirst200 = searchRes!.text.slice(0, 200);

      if (!firstPropertyXml) {
        const m = searchRes!.text.match(/<(?:\w+:)?Property\b[\s\S]*?<\/(?:\w+:)?Property>/i);
        if (m && m[0]) firstPropertyXml = m[0];
      }

      pagesFetched += 1;
      let parsed: any;
      let props: any[] = [];

      await step(parseStepName, async () => {
        parsed = await parseXml(searchRes!.text);
        props = extractProperties(parsed);
      });

      if (!props.length) break;

      if (!firstRawRecord && props[0] && typeof props[0] === "object")
        firstRawRecord = flattenRecord(props[0] as Record<string, unknown>);

      const pageProcessed = { processed: 0, upserted: 0, skipped: 0, errors: 0 };
      await step(upsertStepName, async () => {
        (global as unknown as { __photoLogCount?: number }).__photoLogCount = 0;
        for (const raw of props) {
          if (processed >= limit) break;
          processed += 1;
          pageProcessed.processed += 1;

          const flat = flattenRecord((raw as Record<string, unknown>) ?? {});
          let normalized = normalizeListing(flat);

          if (!normalized) {
            skipped += 1;
            pageProcessed.skipped += 1;
            if (sample.length < 3)
              sample.push({ ddfId: null, mlsNumber: null, city: null, note: "normalizeListing returned null for this record" });
            continue;
          }

          // Per RealtyPress: Search with Query=(ID=<ddfId>) returns full listing. Use Class=Property (PropertyDetails returns 20206).
          if (fetchDetails && normalized.ddfId) {
            const tryDetails = async (detailsClass: string) => {
              const detailsParams = new URLSearchParams({
                Format: "STANDARD-XML",
                SearchType: "Property",
                Class: detailsClass,
                QueryType: "DMQL2",
                Query: `(ID=${normalized!.ddfId})`,
                Count: "1",
                Limit: "1",
                Offset: "1",
                Culture: "en-CA",
              });
              const detailsUrl = `${SEARCH_URL}?${detailsParams.toString()}`;
              const detailsRes = await digestGet(
                detailsUrl,
                username,
                password,
                "application/xml",
                sessionCookie!,
                undefined
              );
              if (!detailsRes?.ok || !detailsRes.text) return null;
              const isSuccess = /ReplyCode="0"/.test(detailsRes.text);
              if (debugDetails && !detailsDebug) {
                detailsDebug = {
                  rawXmlFirst500: detailsRes.text.slice(0, 800),
                  parsedKeys: undefined,
                  parsedSample: undefined,
                };
              }
              if (!isSuccess) {
                if (debugDetails && detailsDebug)
                  detailsDebug.parsedSample = `API error in response (ReplyCode≠0). rawXmlFirst500 shows the error.`;
                return null;
              }
              const detailsParsed = await parseXml(detailsRes.text, { stripNamespace: true });
              const detailsProps = extractProperties(detailsParsed);
              const first = detailsProps[0];
              if (first && typeof first === "object") {
                const detailsFlat = flattenRecord(first as Record<string, unknown>);
                if (debugDetails && detailsDebug) {
                  detailsDebug.parsedKeys = Object.keys(detailsFlat);
                  detailsDebug.parsedSample = JSON.stringify(detailsFlat).slice(0, 1500);
                }
                return normalizeListing(detailsFlat);
              }
              if (debugDetails && detailsDebug) {
                detailsDebug.parsedKeys = [];
                detailsDebug.parsedSample = `extractProperties returned ${detailsProps.length} records for Class=${detailsClass}`;
              }
              return null;
            };
            try {
              // RealtyPress uses Class=Property for Get Listing; PropertyDetails returns 20206 Invalid Query Syntax
              let detailsNorm = await tryDetails("Property");
              if (!detailsNorm && !detailsDebug) detailsNorm = await tryDetails("PropertyDetails");
              if (detailsNorm?.ddfId === normalized.ddfId) normalized = detailsNorm;
            } catch {
              // keep master-list normalized if details fetch fails
            }
          }

          if (sample.length < 3) {
            sample.push(
              { ddfId: normalized.ddfId, mlsNumber: normalized.mlsNumber, city: normalized.city }
            );
          }

          if (dryRun) continue;

          try {
            const createPayload = {
              ddfId: normalized.ddfId,
              mlsNumber: normalized.mlsNumber ?? null,
              status: normalized.status ?? null,
              addressLine: normalized.addressLine ?? null,
              city: normalized.city ?? null,
              province: normalized.province ?? null,
              postalCode: normalized.postalCode ?? null,
              lat: normalized.lat ?? null,
              lng: normalized.lng ?? null,
              price: normalized.price ?? null,
              beds: normalized.beds ?? null,
              baths: normalized.baths ?? null,
              sqft: normalized.sqft ?? null,
              yearBuilt: normalized.yearBuilt ?? null,
              propertyType: normalized.propertyType ?? null,
              photoUrl: normalized.photoUrl ?? null,
              raw: normalized.raw as Prisma.InputJsonValue,
            };
            await prisma.listing.upsert({
              where: { ddfId: normalized.ddfId },
              create: createPayload,
              update: {
                mlsNumber: normalized.mlsNumber ?? null,
                status: normalized.status ?? null,
                addressLine: normalized.addressLine ?? null,
                city: normalized.city ?? null,
                province: normalized.province ?? null,
                postalCode: normalized.postalCode ?? null,
                lat: normalized.lat ?? null,
                lng: normalized.lng ?? null,
                price: normalized.price ?? null,
                beds: normalized.beds ?? null,
                baths: normalized.baths ?? null,
                sqft: normalized.sqft ?? null,
                yearBuilt: normalized.yearBuilt ?? null,
                propertyType: normalized.propertyType ?? null,
                photoUrl: normalized.photoUrl ?? null,
                raw: normalized.raw as Prisma.InputJsonValue,
              },
            });
            upserted += 1;
            pageProcessed.upserted += 1;
          } catch (e: unknown) {
            errors += 1;
            pageProcessed.errors += 1;
            if (errors === 1) {
              const msg = e instanceof Error ? e.message : String(e);
              firstUpsertError = msg;
              console.error("[mls/sync] first upsert error:", msg);
            }
          }
        }
      });
      steps[steps.length - 1] = { ...steps[steps.length - 1]!, message: `processed=${pageProcessed.processed} upserted=${pageProcessed.upserted} skipped=${pageProcessed.skipped} errors=${pageProcessed.errors}` };

      if (props.length < perPage) break;
    }

    await setSyncState({
      status: "success",
      lastRunAt: new Date(),
      processed,
      upserted,
      errorCount: errors,
      lastError: null,
    });

    return json({
      ok: true,
      handlerFile: "src/app/api/mls/sync/route.ts",
      handlerVersion: "v2-marker",
      version: "mls-sync-debug-rawsample-v1",
      steps,
      loginUrlUsed: LOGIN_URL,
      usedSearchUrl: SEARCH_URL,
      sentCookie: true,
      dryRun,
      pagesFetched,
      processed,
      upserted,
      skipped,
      errors,
      firstUpsertError: firstUpsertError ?? undefined,
      login: loginRes
        ? { contentType: loginRes.contentType, first200: loginRes.text.slice(0, 200) }
        : undefined,
      loginResponseKeys: Object.keys(loginResponseKeys).length ? loginResponseKeys : undefined,
      noRecordsHint:
        processed === 0 && pagesFetched > 0
          ? "DDF returned 0 records (20201). Your feed may use a different SearchType/Class or Query. Check loginResponseKeys for URLs. Ask CREA which SearchType, Class, and DMQL Query your destination supports."
          : undefined,
      search: {
        contentType: "application/xml",
        note: "If rawSample is null, include debug=1 and we will also return first200 of the Search response.",
      },
      searchFirst200: searchResFirst200,
      searchClass,
      provinceFilter: provinceFilter || undefined,
      dmqlQuery,
      fetchDetails,
      getObjectUrl: GET_OBJECT_URL,
      sample,
      rawSample: firstPropertyXml
        ? {
            bytes: firstPropertyXml.length,
            xml: debug ? firstPropertyXml : firstPropertyXml.slice(0, 4000),
          }
        : null,
      firstRecordKeys: firstRawRecord ? Object.keys(firstRawRecord) : undefined,
      firstRecordSample:
        firstRawRecord && (debug || url.searchParams.get("debugKeys") === "1")
          ? JSON.stringify(firstRawRecord).slice(0, 4000)
          : undefined,
      detailsDebug: detailsDebug ?? undefined,
      metadata: metadataResult ?? undefined,
      note:
        skipped === processed && processed > 0
          ? "All records skipped: CREA XML field names may differ. firstRecordKeys shows the actual keys from the first record so we can update the parser."
          : "Add ?fetchDetails=1 to fetch full listing per ID (per realtypress.ca). Add ?debugKeys=1 to see firstRecordSample. Photos may require GetObject (Object.svc/GetObject).",
    });
  } catch (e: any) {
    const errMsg = e?.message || "Sync failed";
    try {
      await setSyncState({ status: "failed", lastError: errMsg });
    } catch {
      // ignore state update failure
    }
    return json(
      {
        ok: false,
        error: errMsg,
        steps: typeof steps !== "undefined" ? steps : [],
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.mlsSync);
  if (rl) return rl;

  if (process.env.NODE_ENV === "production" && !isAuthorized(req)) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const exampleCurl =
    process.env.NODE_ENV !== "production"
      ? "curl -X POST 'http://localhost:3000/api/mls/sync?limit=50&pages=2&dryRun=1'"
      : "curl -X POST 'https://YOUR_DOMAIN/api/mls/sync?limit=50&pages=2' -H 'x-mls-sync-key: ...'";

  const hasUsername = Boolean(process.env.DDF_USERNAME?.trim());
  const hasPassword = Boolean(process.env.DDF_PASSWORD?.trim());
  const envOk = hasUsername && hasPassword;

  return json({
    message: "POST to this endpoint to sync listings from CREA DDF (Digest Auth) into Prisma.",
    handlerFile: "src/app/api/mls/sync/route.ts",
    connectionCheck: {
      ready: envOk,
      hint: envOk
        ? "DDF_USERNAME and DDF_PASSWORD are set. POST to run sync (use dryRun=1 first)."
        : "Set DDF_USERNAME and DDF_PASSWORD in .env to connect to CREA DDF.",
      DDF_USERNAME: hasUsername ? "set" : "missing",
      DDF_PASSWORD: hasPassword ? "set" : "missing",
    },
    requiredEnv: ["DDF_USERNAME", "DDF_PASSWORD"],
    optionalEnv: [
      "DDF_LOGIN_URL (default https://data.crea.ca/Login.svc/Login)",
      "DDF_SEARCH_URL (default https://data.crea.ca/Search.svc/Search)",
      "MLS_SYNC_KEY (prod only)",
      "MLS_SYNC_MAX_LISTINGS (cap per run, default 500; prevents pulling thousands)",
      "MLS_PROVINCE (default ON = Ontario only; empty = no province filter)",
    ],
    usage: {
      example: exampleCurl,
      queryParams: {
        limit: "max items to process this run (default 50, max from MLS_SYNC_MAX_LISTINGS or 500)",
        pages: "max pages to fetch (default 5, max 50)",
        perPage: "page size (default 100, max 100)",
        province: "filter by province (default ON = Ontario only; empty = all provinces)",
        class: "Property (default, master list) or PropertyDetails (full listing: address, price, photos)",
        fetchDetails: "1 to fetch full listing per ID via Search(ID=<ddfId>) (per realtypress.ca DDF testing)",
        dryRun: "true/1 to skip DB writes (recommended first run)",
        debug: "1 to include full raw XML sample (otherwise truncated)",
        metadata: "1 to fetch GetMetadata (resources + Property classes) and include in response",
        query: "override DMQL query (e.g. (ID=*) or (LastUpdated=2020-01-01+))",
      },
    },
  });
}