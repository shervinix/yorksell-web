import { NextResponse } from "next/server";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { photoQuerySchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

const HTTP_TIMEOUT_MS = 15_000;

/**
 * CREA DDF GetObject base URL (public documented endpoint). Override with DDF_GET_OBJECT_URL
 * in environment — never expose digest credentials to the client.
 */
function getGetObjectUrl(): string {
  const fromEnv = process.env.DDF_GET_OBJECT_URL?.trim();
  if (fromEnv) return fromEnv;
  return "https://data.crea.ca/Object.svc/GetObject";
}

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
  const GET_OBJECT_URL = getGetObjectUrl();
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
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.publicRead);
  if (rl) return rl;

  const url = new URL(req.url);
  for (const k of new Set(url.searchParams.keys())) {
    if (k !== "ddfId" && k !== "mlsNumber") {
      return NextResponse.json({ error: "Unknown query parameter" }, { status: 400 });
    }
  }

  const q = {
    ddfId: url.searchParams.get("ddfId")?.trim() || undefined,
    mlsNumber: url.searchParams.get("mlsNumber")?.trim() || undefined,
  };
  const validated = photoQuerySchema.safeParse(q);
  if (!validated.success) {
    return NextResponse.json(
      { error: "Invalid or missing ddfId / mlsNumber" },
      { status: 400 }
    );
  }

  const { ddfId, mlsNumber } = validated.data;
  const id = mlsNumber || ddfId;
  if (!id) {
    return NextResponse.json({ error: "Missing ddfId or mlsNumber" }, { status: 400 });
  }

  const username = process.env.DDF_USERNAME;
  const password = process.env.DDF_PASSWORD;
  if (!username || !password) {
    return NextResponse.json({ error: "DDF credentials not configured" }, { status: 503 });
  }

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
