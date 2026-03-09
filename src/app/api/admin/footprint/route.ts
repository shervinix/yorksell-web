import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";
import {
  FOOTPRINT_SETTING_KEY,
  getFootprintFromValue,
  type FootprintData,
  type FootprintPerformanceOverrides,
} from "@/lib/footprint";
import type { FootprintPoint } from "@/app/footprint/data";

export const runtime = "nodejs";

function parsePoints(raw: unknown): FootprintPoint[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (item == null || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const type = o.type as string;
      if (type !== "sold" && type !== "purchased" && type !== "active") return null;
      const lat = Number(o.lat);
      const lng = Number(o.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return {
        id: typeof o.id === "string" ? o.id : String(o.id ?? ""),
        type: type as "sold" | "purchased" | "active",
        lat,
        lng,
        address: typeof o.address === "string" ? o.address : String(o.address ?? ""),
        city: typeof o.city === "string" ? o.city : String(o.city ?? ""),
        price: typeof o.price === "number" && Number.isFinite(o.price) ? o.price : undefined,
        beds: typeof o.beds === "number" && Number.isFinite(o.beds) ? o.beds : undefined,
        baths: typeof o.baths === "number" && Number.isFinite(o.baths) ? o.baths : undefined,
        soldDate: typeof o.soldDate === "string" ? o.soldDate : undefined,
        mlsNumber: typeof o.mlsNumber === "string" ? o.mlsNumber : undefined,
      };
    })
    .filter((p): p is FootprintPoint => p !== null);
}

function parseOverrides(raw: unknown): FootprintPerformanceOverrides | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const num = (k: string) => {
    const v = o[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = parseInt(v, 10);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  };
  return {
    soldCount: num("soldCount"),
    purchasedCount: num("purchasedCount"),
    activeCount: num("activeCount"),
    soldVolume: num("soldVolume"),
    purchasedVolume: num("purchasedVolume"),
    totalVolume: num("totalVolume"),
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.siteSetting.findUnique({
    where: { key: FOOTPRINT_SETTING_KEY },
  });
  const data = getFootprintFromValue(row?.value ?? null);
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const points = parsePoints(
    typeof body === "object" && body !== null && "points" in body
      ? (body as Record<string, unknown>).points
      : []
  );
  const performanceOverrides = parseOverrides(
    typeof body === "object" && body !== null && "performanceOverrides" in body
      ? (body as Record<string, unknown>).performanceOverrides
      : null
  );

  const value: FootprintData = {
    points,
    performanceOverrides: performanceOverrides ?? undefined,
  };

  await prisma.siteSetting.upsert({
    where: { key: FOOTPRINT_SETTING_KEY },
    create: { key: FOOTPRINT_SETTING_KEY, value },
    update: { value },
  });

  return NextResponse.json(value);
}
