import type { PrismaClient } from "@prisma/client";
import type { FootprintPoint } from "@/app/footprint/data";
import { FOOTPRINT_POINTS, getFootprintStats } from "@/app/footprint/data";

export const FOOTPRINT_SETTING_KEY = "footprint_data";

export type FootprintPointType = "sold" | "purchased" | "active";

export interface FootprintPerformanceOverrides {
  soldCount?: number | null;
  purchasedCount?: number | null;
  activeCount?: number | null;
  soldVolume?: number | null;
  purchasedVolume?: number | null;
  totalVolume?: number | null;
}

export interface FootprintData {
  points: FootprintPoint[];
  performanceOverrides?: FootprintPerformanceOverrides | null;
}

function parsePoint(raw: unknown): FootprintPoint | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = typeof o.id === "string" ? o.id : String(o.id ?? "");
  const type = o.type as FootprintPointType;
  if (type !== "sold" && type !== "purchased" && type !== "active") return null;
  const lat = typeof o.lat === "number" ? o.lat : Number(o.lat);
  const lng = typeof o.lng === "number" ? o.lng : Number(o.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const address = typeof o.address === "string" ? o.address : String(o.address ?? "").trim();
  const city = typeof o.city === "string" ? o.city : String(o.city ?? "").trim();
  const point: FootprintPoint = {
    id: id || crypto.randomUUID(),
    type,
    lat,
    lng,
    address: address || "Address",
    city: city || "City",
  };
  if (typeof o.price === "number" && Number.isFinite(o.price)) point.price = o.price;
  if (typeof o.beds === "number" && Number.isFinite(o.beds)) point.beds = o.beds;
  if (typeof o.baths === "number" && Number.isFinite(o.baths)) point.baths = o.baths;
  if (typeof o.soldDate === "string" && o.soldDate.trim()) point.soldDate = o.soldDate.trim();
  if (typeof o.mlsNumber === "string" && o.mlsNumber.trim()) point.mlsNumber = o.mlsNumber.trim();
  return point;
}

function parsePerformanceOverrides(raw: unknown): FootprintPerformanceOverrides | null {
  if (raw == null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const num = (k: string) => {
    const v = o[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string") {
      const n = parseInt(v, 10);
      return Number.isFinite(n) ? n : undefined;
    }
    return undefined;
  };
  const soldCount = num("soldCount");
  const purchasedCount = num("purchasedCount");
  const activeCount = num("activeCount");
  const soldVolume = num("soldVolume");
  const purchasedVolume = num("purchasedVolume");
  const totalVolume = num("totalVolume");
  if (
    soldCount === undefined &&
    purchasedCount === undefined &&
    activeCount === undefined &&
    soldVolume === undefined &&
    purchasedVolume === undefined &&
    totalVolume === undefined
  ) {
    return null;
  }
  return {
    soldCount: soldCount ?? null,
    purchasedCount: purchasedCount ?? null,
    activeCount: activeCount ?? null,
    soldVolume: soldVolume ?? null,
    purchasedVolume: purchasedVolume ?? null,
    totalVolume: totalVolume ?? null,
  };
}

export function getFootprintFromValue(value: unknown): FootprintData {
  if (value == null || typeof value !== "object") {
    return { points: [...FOOTPRINT_POINTS], performanceOverrides: null };
  }
  const o = value as Record<string, unknown>;
  const pointsRaw = Array.isArray(o.points) ? o.points : [];
  const points = pointsRaw.map(parsePoint).filter((p): p is FootprintPoint => p !== null);
  const performanceOverrides = parsePerformanceOverrides(o.performanceOverrides);
  return {
    points: points.length > 0 ? points : [...FOOTPRINT_POINTS],
    performanceOverrides: performanceOverrides ?? undefined,
  };
}

export type FootprintStats = ReturnType<typeof getFootprintStats>;

export function getResolvedFootprintStats(
  data: FootprintData
): FootprintStats {
  const overrides = data.performanceOverrides;
  const computed = getFootprintStats(data.points);
  if (!overrides) return computed;
  return {
    soldCount: overrides.soldCount ?? computed.soldCount,
    purchasedCount: overrides.purchasedCount ?? computed.purchasedCount,
    activeCount: overrides.activeCount ?? computed.activeCount,
    soldVolume: overrides.soldVolume ?? computed.soldVolume,
    purchasedVolume: overrides.purchasedVolume ?? computed.purchasedVolume,
    totalVolume: overrides.totalVolume ?? computed.totalVolume,
  };
}

export async function getFootprintData(prisma: PrismaClient): Promise<FootprintData> {
  const row = await prisma.siteSetting.findUnique({
    where: { key: FOOTPRINT_SETTING_KEY },
  });
  return getFootprintFromValue(row?.value ?? null);
}
