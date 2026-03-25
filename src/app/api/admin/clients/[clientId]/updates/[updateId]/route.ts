import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ clientId: string; updateId: string }> }
) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId, updateId } = await params;

  const update = await prisma.clientUpdate.findFirst({
    where: { id: updateId, clientId },
  });
  if (!update) {
    return NextResponse.json({ error: "Update not found" }, { status: 404 });
  }

  await prisma.clientUpdate.delete({
    where: { id: updateId },
  });

  return NextResponse.json({ ok: true });
}
