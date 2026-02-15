import { NextResponse } from "next/server";

const GET_OBJECT_URL = process.env.DDF_GET_OBJECT_URL || "https://data.crea.ca/Object.svc/GetObject";
const HTTP_TIMEOUT_MS = 15_000;

/**
 * GET /api/listings/photo?ddfId=xxx&mlsNumber=xxx
 * Proxies CREA DDF GetObject (Property photo) with digest auth.
 * RealtyPress: ID=ListingID (MLS number), not ddfId. Try mlsNumber first, then ddfId.
 * Try Type=_LargePhoto_ first, then Type=Photo.
 */
async function fetchGetObject(
  objectId: string,
  type: string,
  username: string,
  password: string
): Promise<{ ok: boolean; buffer?: ArrayBuffer; contentType?: string; status?: number }> {
  const url = `${GET_OBJECT_URL}?Resource=Property&Type=${encodeURIComponent(type)}&ID=${encodeURIComponent(objectId)}`;
  const { default: DigestClient } = await import("digest-fetch");
  const client = new DigestClient(username, password, { algorithm: "MD5" });
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
  try {
    const res = await client.fetch(url, {
      method: "GET",
      headers: { accept: "image/*", "user-agent": "yorksell-web/1.0" },
      cache: "no-store",
      signal: controller.signal,
    } as RequestInit);
    clearTimeout(timeoutId);
    if (!res.ok) return { ok: false, status: res.status };
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return { ok: true, buffer, contentType };
  } catch {
    clearTimeout(timeoutId);
    return { ok: false };
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ddfId = url.searchParams.get("ddfId")?.trim();
  const mlsNumber = url.searchParams.get("mlsNumber")?.trim();

  const id = mlsNumber || ddfId;
  if (!id) {
    return NextResponse.json({ error: "Missing ddfId or mlsNumber" }, { status: 400 });
  }

  const username = process.env.DDF_USERNAME;
  const password = process.env.DDF_PASSWORD;
  if (!username || !password) {
    return NextResponse.json({ error: "DDF credentials not configured" }, { status: 503 });
  }

  // RealtyPress: ID=ListingID:1 for first photo. Try mlsNumber first (ListingID), then ddfId.
  const objectId = `${id}:1`;
  const types = ["_LargePhoto_", "Photo"];
  const attempts: { type: string; ok: boolean; status?: number }[] = [];
  for (const type of types) {
    const result = await fetchGetObject(objectId, type, username, password);
    attempts.push({ type, ok: result.ok, status: result.status });
    if (result.ok && result.buffer) {
      // #region agent log
      const payload = { location: "api/listings/photo/route.ts", message: "GetObject success", data: { id, objectId, type, attempts }, timestamp: Date.now(), hypothesisId: "H2" };
      try { require("fs").appendFileSync(require("path").join(process.cwd(), ".cursor", "debug.log"), JSON.stringify(payload) + "\n"); } catch {}
      fetch("http://127.0.0.1:7242/ingest/989fcf82-5e2c-43b6-af60-a19ff17876f2", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
      // #endregion
      return new NextResponse(result.buffer, {
        headers: {
          "content-type": result.contentType || "image/jpeg",
          "cache-control": "public, max-age=3600",
        },
      });
    }
  }

  // #region agent log
  const payload = { location: "api/listings/photo/route.ts", message: "GetObject failed", data: { id, mlsNumber: mlsNumber || null, ddfId: ddfId || null, objectId, attempts }, timestamp: Date.now(), hypothesisId: "H2,H3,H4" };
  try { require("fs").appendFileSync(require("path").join(process.cwd(), ".cursor", "debug.log"), JSON.stringify(payload) + "\n"); } catch {}
  fetch("http://127.0.0.1:7242/ingest/989fcf82-5e2c-43b6-af60-a19ff17876f2", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
  // #endregion

  return NextResponse.json(
    { error: "GetObject failed", hint: "Tried _LargePhoto_ and Photo with ID " + objectId },
    { status: 502 }
  );
}
