import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Keep a single PrismaClient in dev to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

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
  const { searchParams } = new URL(req.url);
  const qRaw = (searchParams.get("q") ?? "").trim();
  const q = qRaw.toLowerCase();

  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 12), 1), 50);

  if (!qRaw) return NextResponse.json([], { status: 200 });

  // Heuristic: treat as MLS number if it contains a digit and is relatively short
  const looksLikeMls = /\d/.test(qRaw) && qRaw.replace(/\s+/g, "").length <= 12;

  const rows = await prisma.listing.findMany({
    where: {
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