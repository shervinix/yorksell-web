import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminChecklistPatchSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ clientId: string; itemId: string }> }
) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId, itemId } = await params;

  const existing = await prisma.clientChecklistItem.findFirst({
    where: { id: itemId, clientId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const parsed = await parseJsonBody(req, adminChecklistPatchSchema);
  if (!parsed.ok) return parsed.response;

  const data: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) data.title = parsed.data.title;
  if (parsed.data.assignedTo !== undefined) data.assignedTo = parsed.data.assignedTo;
  if (parsed.data.order !== undefined) data.order = parsed.data.order;
  if (parsed.data.done !== undefined) {
    data.done = parsed.data.done;
    data.doneAt = parsed.data.done ? new Date() : null;
  }

  const item = await prisma.clientChecklistItem.update({
    where: { id: itemId },
    data,
  });

  return NextResponse.json({
    item: {
      ...item,
      doneAt: item.doneAt?.toISOString() ?? null,
      createdAt: item.createdAt.toISOString(),
    },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ clientId: string; itemId: string }> }
) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId, itemId } = await params;

  const existing = await prisma.clientChecklistItem.findFirst({
    where: { id: itemId, clientId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  await prisma.clientChecklistItem.delete({ where: { id: itemId } });

  return NextResponse.json({ ok: true });
}
