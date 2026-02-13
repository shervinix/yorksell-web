import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export const runtime = "nodejs";

const SOURCES = ["listing_contact", "contact_page", "home_cta"] as const;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const emailRaw = typeof body?.email === "string" ? body.email.trim() : "";
    const email = emailRaw.toLowerCase();
    const name = typeof body?.name === "string" ? body.name.trim() || null : null;
    const phone = typeof body?.phone === "string" ? body.phone.trim() || null : null;
    const message = typeof body?.message === "string" ? body.message.trim() || null : null;
    const source = typeof body?.source === "string" && SOURCES.includes(body.source as (typeof SOURCES)[number])
      ? (body.source as (typeof SOURCES)[number])
      : "contact_page";
    const listingIdRaw = body?.listingId ?? body?.listing_id;
    const mlsNumberRaw = body?.mlsNumber ?? body?.mls_number;
    const metadata =
      body?.metadata && typeof body.metadata === "object" ? body.metadata : null;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

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
