import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseMlsSearchQuery } from "@/server/validation/mls-search-query";

export const runtime = "nodejs";

type ListingSearchResult = {
  id: string;
  mlsNumber: string | null;
  address: string;
  city: string;
  province: string;
  postalCode: string | null;
  price: number | null;
  beds: number | null;
  baths: number | null;
  photoUrl: string | null;
  status: string | null;
  propertyType: string | null;
  url: string;
};

export async function GET(req: Request) {
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.publicRead);
  if (rl) return rl;

  const parsed = parseMlsSearchQuery(req);
  if (!parsed.ok) return parsed.response;

  const { q: qRaw, limit } = parsed;

  if (!qRaw) return NextResponse.json([], { status: 200 });

  const looksLikeMls = /\d/.test(qRaw) && qRaw.replace(/\s+/g, "").length <= 12;

  const hasRealData = {
    OR: [
      { mlsNumber: { not: null } },
      { addressLine: { not: null } },
      { city: { not: null } },
      { price: { not: null } },
    ],
  };

  const rows = await prisma.listing.findMany({
    where: {
      AND: [
        hasRealData,
        {
          OR: [
            ...(looksLikeMls
              ? [
                  {
                    mlsNumber: {
                      contains: qRaw.replace(/\s+/g, ""),
                      mode: "insensitive" as const,
                    },
                  },
                ]
              : []),
            {
              addressLine: {
                contains: qRaw,
                mode: "insensitive" as const,
              },
            },
            {
              city: {
                contains: qRaw,
                mode: "insensitive" as const,
              },
            },
            {
              postalCode: {
                contains: qRaw.replace(/\s+/g, ""),
                mode: "insensitive" as const,
              },
            },
          ],
        },
      ],
    },
    orderBy: [{ updatedAt: "desc" }],
    take: limit,
    select: {
      id: true,
      mlsNumber: true,
      addressLine: true,
      city: true,
      province: true,
      postalCode: true,
      price: true,
      beds: true,
      baths: true,
      photoUrl: true,
      status: true,
      propertyType: true,
    },
  });

  const results: ListingSearchResult[] = rows.map((r) => {
    const slug = (r.mlsNumber && r.mlsNumber.trim()) || r.id;
    return {
      id: r.id,
      mlsNumber: r.mlsNumber,
      address: r.addressLine ?? "",
      city: r.city ?? "",
      province: r.province ?? "",
      postalCode: r.postalCode ?? null,
      price: r.price ?? null,
      beds: r.beds ?? null,
      baths: r.baths ?? null,
      photoUrl: r.photoUrl ?? null,
      status: r.status ?? null,
      propertyType: r.propertyType ?? null,
      url: `/listings/${encodeURIComponent(slug)}`,
    };
  });

  return NextResponse.json(results, { status: 200 });
}
