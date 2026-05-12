import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminOfferPatchSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ clientId: string; offerId: string }> }
) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId, offerId } = await params;

  const existing = await prisma.clientOffer.findFirst({
    where: { id: offerId, clientId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  const parsed = await parseJsonBody(req, adminOfferPatchSchema);
  if (!parsed.ok) return parsed.response;

  const data: Record<string, unknown> = {};
  if (parsed.data.address !== undefined) data.address = parsed.data.address;
  if (parsed.data.price !== undefined) data.price = parsed.data.price;
  if (parsed.data.status !== undefined) data.status = parsed.data.status;
  if (parsed.data.conditions !== undefined) data.conditions = parsed.data.conditions;
  if (parsed.data.notes !== undefined) data.notes = parsed.data.notes;
  if (parsed.data.closingDate !== undefined) {
    data.closingDate = parsed.data.closingDate ? new Date(parsed.data.closingDate) : null;
  }

  const offer = await prisma.clientOffer.update({
    where: { id: offerId },
    data,
  });

  return NextResponse.json({
    offer: {
      ...offer,
      closingDate: offer.closingDate?.toISOString() ?? null,
      createdAt: offer.createdAt.toISOString(),
    },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ clientId: string; offerId: string }> }
) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId, offerId } = await params;

  const existing = await prisma.clientOffer.findFirst({
    where: { id: offerId, clientId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  await prisma.clientOffer.delete({ where: { id: offerId } });

  return NextResponse.json({ ok: true });
}
