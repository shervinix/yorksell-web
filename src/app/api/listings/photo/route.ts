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
  for (const type of types) {
    const result = await fetchGetObject(objectId, type, username, password);
    if (result.ok && result.buffer) {
      return new NextResponse(result.buffer, {
        headers: {
          "content-type": result.contentType || "image/jpeg",
          "cache-control": "public, max-age=3600",
        },
      });
    }
  }

  return NextResponse.json(
    { error: "GetObject failed", hint: "Tried _LargePhoto_ and Photo with ID " + objectId },
    { status: 502 }
  );
}
