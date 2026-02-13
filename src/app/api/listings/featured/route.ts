import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = "nodejs";

const FEATURED_COUNT = 3;
const POOL_SIZE = 50; // fetch up to 50, then pick 3 random (keeps load small)

// Prisma singleton for dev hot-reload safety
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export async function GET() {
  try {
    const pool = await prisma.listing.findMany({
      orderBy: { updatedAt: "desc" },
      take: POOL_SIZE,
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

    const listings = shuffle(pool).slice(0, FEATURED_COUNT);

    return NextResponse.json({ listings }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to load featured listings", error: message },
      { status: 500 }
    );
  }
}