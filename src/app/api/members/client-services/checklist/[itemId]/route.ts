import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { memberChecklistToggleSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.userSession, session.user.id as string);
  if (rl) return rl;

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id as string },
    select: { id: true, showChecklist: true },
  });

  if (!client) {
    return NextResponse.json({ error: "No client profile found" }, { status: 404 });
  }

  if (!client.showChecklist) {
    return NextResponse.json({ error: "Checklist is not enabled" }, { status: 403 });
  }

  const { itemId } = await params;

  // Ensure item belongs to this client
  const item = await prisma.clientChecklistItem.findFirst({
    where: { id: itemId, clientId: client.id },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const parsed = await parseJsonBody(req, memberChecklistToggleSchema);
  if (!parsed.ok) return parsed.response;

  const updated = await prisma.clientChecklistItem.update({
    where: { id: itemId },
    data: {
      done: parsed.data.done,
      doneAt: parsed.data.done ? new Date() : null,
    },
  });

  return NextResponse.json({
    item: {
      ...updated,
      doneAt: updated.doneAt?.toISOString() ?? null,
      createdAt: updated.createdAt.toISOString(),
    },
  });
}
