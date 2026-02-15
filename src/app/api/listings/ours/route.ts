import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import type { ListingListItem } from "../route";

export const runtime = "nodejs";

/** Status values we consider "active" (for sale). */
const ACTIVE_STATUSES = ["active", "for sale", "available", "new", "on market"];
/** Status values we consider "sold". */
const SOLD_STATUSES = ["sold", "closed", "expired", "withdrawn"];

function isSold(status: string | null): boolean {
  if (!status || !status.trim()) return false;
  const s = status.trim().toLowerCase();
  return SOLD_STATUSES.some((b) => s.includes(b));
}

function toListItem(r: {
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
}): ListingListItem {
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
}

export async function GET() {
  const raw = process.env.YORKELL_MLS_NUMBERS ?? "";
  const mlsNumbers = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (mlsNumbers.length === 0) {
    return NextResponse.json(
      { active: [], sold: [] },
      { status: 200 }
    );
  }

  const listings = await prisma.listing.findMany({
    where: {
      OR: mlsNumbers.map((m) => ({
        mlsNumber: { equals: m, mode: "insensitive" as const },
      })),
    },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
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
  });

  const active: ListingListItem[] = [];
  const sold: ListingListItem[] = [];

  for (const r of listings) {
    const item = toListItem(r);
    if (isSold(r.status)) {
      sold.push(item);
    } else {
      active.push(item);
    }
  }

  return NextResponse.json({ active, sold }, { status: 200 });
}
