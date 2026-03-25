import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseListingsQuery } from "@/server/validation/listings-query";

export const runtime = "nodejs";

export type ListingListItem = {
  id: string;
  mlsNumber: string | null;
  addressLine: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  price: number | null;
  beds: number | null;
  baths: number | null;
  propertyType: string | null;
  status: string | null;
  photoUrl: string | null;
  lat: number | null;
  lng: number | null;
  url: string;
};

export async function GET(req: Request) {
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.publicRead);
  if (rl) return rl;

  const parsed = parseListingsQuery(req);
  if (!parsed.ok) return parsed.response;

  const {
    q: qRaw,
    minPrice,
    maxPrice,
    beds: bedsParam,
    baths: bathsParam,
    dens: densParam,
    propertyType: propertyTypeRaw,
    city: cityRaw,
    status: statusRaw,
    swLat,
    swLng,
    neLat,
    neLng,
    page,
    limit,
    sort,
  } = parsed.query;

  const propertyType = propertyTypeRaw.trim() || null;
  const city = cityRaw.trim() || null;
  const status = statusRaw.trim() || null;

  const where: Prisma.ListingWhereInput = {};

  // Text search: address, city, neighbourhood, postal code, MLS#
  if (qRaw) {
    const looksLikeMls = /\d/.test(qRaw) && qRaw.replace(/\s+/g, "").length <= 12;
    where.AND = [
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
          { addressLine: { contains: qRaw, mode: "insensitive" as const } },
          { city: { contains: qRaw, mode: "insensitive" as const } },
          { postalCode: { contains: qRaw.replace(/\s+/g, ""), mode: "insensitive" as const } },
        ],
      },
    ];
  }

  // Price range
  const minPriceN = minPrice != null && minPrice !== "" ? Number(minPrice) : null;
  const maxPriceN = maxPrice != null && maxPrice !== "" ? Number(maxPrice) : null;
  if (minPriceN != null && Number.isFinite(minPriceN) && maxPriceN != null && Number.isFinite(maxPriceN)) {
    where.price = { gte: minPriceN, lte: maxPriceN };
  } else if (minPriceN != null && Number.isFinite(minPriceN)) {
    where.price = { gte: minPriceN };
  } else if (maxPriceN != null && Number.isFinite(maxPriceN)) {
    where.price = { lte: maxPriceN };
  }

  // Beds: exact match, multi-select (e.g. 2 and 3 bedroom)
  const bedsValues = bedsParam
    .map((b) => (b !== "" ? Number(b) : NaN))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 20);
  if (bedsValues.length > 0) {
    const unique = [...new Set(bedsValues)];
    where.beds = { in: unique };
  }

  // Baths: exact match, multi-select; 1.5/2.5 map to integer (1.5 -> 1, 2.5 -> 2) for DB
  const bathsValues = bathsParam
    .map((b) => {
      if (b === "" || b == null) return NaN;
      const n = Number(b);
      if (Number.isFinite(n)) return Math.floor(n);
      return NaN;
    })
    .filter((n) => !Number.isNaN(n) && n >= 1 && n <= 20);
  if (bathsValues.length > 0) {
    const unique = [...new Set(bathsValues)];
    where.baths = { in: unique };
  }

  // Dens: exact match, multi-select (1+ den, 2+ den)
  const densValues = densParam
    .map((d) => (d !== "" ? Number(d) : NaN))
    .filter((n) => Number.isFinite(n) && n >= 1 && n <= 10);
  if (densValues.length > 0) {
    const unique = [...new Set(densValues)];
    where.den = { in: unique };
  }

  if (propertyType) {
    where.propertyType = { contains: propertyType, mode: "insensitive" };
  }
  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }
  if (status) {
    where.status = { equals: status, mode: "insensitive" };
  }

  // Map bounds: restrict to listings inside bounding box
  const swLatN = swLat != null && swLat !== "" ? Number(swLat) : null;
  const swLngN = swLng != null && swLng !== "" ? Number(swLng) : null;
  const neLatN = neLat != null && neLat !== "" ? Number(neLat) : null;
  const neLngN = neLng != null && neLng !== "" ? Number(neLng) : null;
  if (
    swLatN != null && Number.isFinite(swLatN) &&
    swLngN != null && Number.isFinite(swLngN) &&
    neLatN != null && Number.isFinite(neLatN) &&
    neLngN != null && Number.isFinite(neLngN)
  ) {
    const [minLat, maxLat] = swLatN <= neLatN ? [swLatN, neLatN] : [neLatN, swLatN];
    const [minLng, maxLng] = swLngN <= neLngN ? [swLngN, neLngN] : [neLngN, swLngN];
    where.lat = { gte: minLat, lte: maxLat };
    where.lng = { gte: minLng, lte: maxLng };
  }

  // Default: highest to lowest price; listings with no price (or contact-for-price) go last
  const orderBy: Prisma.ListingOrderByWithRelationInput[] =
    sort === "price_asc"
      ? [{ price: { sort: "asc", nulls: "last" } }, { updatedAt: "desc" }]
      : sort === "price_desc"
        ? [{ price: { sort: "desc", nulls: "last" } }, { updatedAt: "desc" }]
        : [{ updatedAt: "desc" }];

  // Only include listings with at least some real data (exclude empty rows from sync without fetchDetails)
  const hasRealData: Prisma.ListingWhereInput = {
    OR: [
      { mlsNumber: { not: null } },
      { addressLine: { not: null } },
      { city: { not: null } },
      { price: { not: null } },
    ],
  };
  const finalWhere: Prisma.ListingWhereInput = { AND: [hasRealData, where] };

  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    prisma.listing.findMany({
      where: finalWhere,
      orderBy,
      skip,
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
        propertyType: true,
        status: true,
        photoUrl: true,
        lat: true,
        lng: true,
      },
    }),
    prisma.listing.count({ where: finalWhere }),
  ]);

  const listings: ListingListItem[] = rows.map((r) => {
    const slug = (r.mlsNumber && r.mlsNumber.trim()) || r.id;
    return {
      id: r.id,
      mlsNumber: r.mlsNumber,
      addressLine: r.addressLine,
      city: r.city,
      province: r.province,
      postalCode: r.postalCode,
      price: r.price,
      beds: r.beds,
      baths: r.baths,
      propertyType: r.propertyType,
      status: r.status,
      photoUrl: r.photoUrl,
      lat: r.lat,
      lng: r.lng,
      url: `/listings/${encodeURIComponent(slug)}`,
    };
  });

  return NextResponse.json({ listings, total }, { status: 200 });
}
