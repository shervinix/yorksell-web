import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { listingIdQuerySchema, savedListingPostSchema } from "@/server/validation/schemas";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.userSession, session.user.id as string);
  if (rl) return rl;

  const saved = await prisma.savedListing.findMany({
    where: { userId: session.user.id as string },
    include: {
      listing: {
        select: {
          id: true,
          ddfId: true,
          mlsNumber: true,
          addressLine: true,
          city: true,
          province: true,
          price: true,
          beds: true,
          baths: true,
          propertyType: true,
          photoUrl: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const listings = saved.map((s) => s.listing).filter(Boolean);
  return NextResponse.json({ listings });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.userSession, session.user.id as string);
  if (rl) return rl;

  const parsed = await parseJsonBody(req, savedListingPostSchema);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;
  const listingIdRaw = body.listingId ?? body.listing_id;
  const mlsNumberRaw = body.mlsNumber ?? body.mls_number;

  try {
    let listingId: string | null = null;
    if (typeof listingIdRaw === "string" && listingIdRaw.trim()) {
      const found = await prisma.listing.findUnique({
        where: { id: listingIdRaw.trim() },
        select: { id: true },
      });
      if (found) listingId = found.id;
    }
    if (!listingId && typeof mlsNumberRaw === "string" && mlsNumberRaw.trim()) {
      const found = await prisma.listing.findFirst({
        where: { mlsNumber: { equals: mlsNumberRaw.trim(), mode: "insensitive" } },
        select: { id: true },
      });
      if (found) listingId = found.id;
    }

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing not found. Provide listingId or mlsNumber." },
        { status: 400 }
      );
    }

    await prisma.savedListing.upsert({
      where: {
        userId_listingId: {
          userId: session.user.id as string,
          listingId,
        },
      },
      create: {
        userId: session.user.id as string,
        listingId,
      },
      update: {},
    });

    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: "Failed to save listing." }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.userSession, session.user.id as string);
  if (rl) return rl;

  const { searchParams } = new URL(req.url);
  for (const k of new Set(searchParams.keys())) {
    if (k !== "listingId") {
      return NextResponse.json({ error: "Unknown query parameter" }, { status: 400 });
    }
  }

  const q = listingIdQuerySchema.safeParse({
    listingId: searchParams.get("listingId")?.trim() ?? "",
  });
  if (!q.success) {
    return NextResponse.json({ error: "listingId is required." }, { status: 400 });
  }

  const listingId = q.data.listingId.trim();

  try {
    await prisma.savedListing.deleteMany({
      where: {
        userId: session.user.id as string,
        listingId,
      },
    });
    return NextResponse.json({ removed: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove saved listing." }, { status: 400 });
  }
}
