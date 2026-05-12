import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminOfferPostSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await params;

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const parsed = await parseJsonBody(req, adminOfferPostSchema);
  if (!parsed.ok) return parsed.response;

  const closingDate = parsed.data.closingDate
    ? new Date(parsed.data.closingDate)
    : null;

  const offer = await prisma.clientOffer.create({
    data: {
      clientId,
      address: parsed.data.address ?? null,
      price: parsed.data.price ?? null,
      status: parsed.data.status ?? "Pending",
      conditions: parsed.data.conditions ?? null,
      closingDate,
      notes: parsed.data.notes ?? null,
    },
  });

  return NextResponse.json({
    offer: {
      ...offer,
      closingDate: offer.closingDate?.toISOString() ?? null,
      createdAt: offer.createdAt.toISOString(),
    },
  });
}
