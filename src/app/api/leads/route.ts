import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { leadPostSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ? (session.user.id as string) : null;

  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.publicWrite, userId);
  if (rl) return rl;

  const parsed = await parseJsonBody(req, leadPostSchema);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;
  const email = body.email.toLowerCase();
  const name = body.name?.trim() ? body.name.trim() : null;
  const phone = body.phone?.trim() ? body.phone.trim() : null;
  const message = body.message?.trim() ? body.message.trim() : null;
  const source = body.source ?? "contact_page";
  const listingIdRaw = body.listingId ?? body.listing_id;
  const mlsNumberRaw = body.mlsNumber ?? body.mls_number;
  const metadata = body.metadata ?? null;

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

    const lead = await prisma.lead.create({
      data: {
        email,
        name,
        phone,
        message,
        source,
        listingId,
        userId: userId ?? undefined,
        metadata: metadata ?? undefined,
      },
      select: { id: true, email: true, createdAt: true },
    });

    return NextResponse.json(
      { id: lead.id, message: "Thank you. We'll be in touch soon." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to submit. Please try again." },
      { status: 500 }
    );
  }
}
