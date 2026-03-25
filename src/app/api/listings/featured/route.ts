import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { defaultFeaturedMlsNumbers } from "@/lib/featured-defaults";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";

export const runtime = "nodejs";

const FEATURED_SETTING_KEY = "featured_mls_numbers";

function getFeaturedMlsNumbers(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter(Boolean);
  }
  return defaultFeaturedMlsNumbers();
}

export async function GET(req: Request) {
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.publicRead);
  if (rl) return rl;

  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: FEATURED_SETTING_KEY },
    });
    const featuredMlsNumbers = getFeaturedMlsNumbers(
      setting?.value ?? defaultFeaturedMlsNumbers()
    );
    if (featuredMlsNumbers.length === 0) {
      return NextResponse.json({ listings: [] }, { status: 200 });
    }

    const rows = await prisma.listing.findMany({
      where: {
        mlsNumber: { in: featuredMlsNumbers, mode: "insensitive" },
      },
      select: {
        id: true,
        ddfId: true,
        mlsNumber: true,
        status: true,
        addressLine: true,
        city: true,
        province: true,
        postalCode: true,
        price: true,
        beds: true,
        baths: true,
        propertyType: true,
        photoUrl: true,
      },
    });

    // Return in the handpicked order (DB order is undefined with `in`)
    const orderMap = new Map(
      featuredMlsNumbers.map((mls, i) => [mls.toLowerCase(), i])
    );
    const listings = [...rows].sort(
      (a, b) =>
        (orderMap.get((a.mlsNumber ?? "").toLowerCase()) ?? 999) -
        (orderMap.get((b.mlsNumber ?? "").toLowerCase()) ?? 999)
    );

    return NextResponse.json({ listings }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to load featured listings", error: message },
      { status: 500 }
    );
  }
}