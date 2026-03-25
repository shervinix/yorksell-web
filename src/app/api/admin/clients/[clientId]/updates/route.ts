import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminClientUpdatePostSchema } from "@/server/validation/schemas";

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

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const parsed = await parseJsonBody(req, adminClientUpdatePostSchema);
  if (!parsed.ok) return parsed.response;

  const { title, content } = parsed.data;

  const update = await prisma.clientUpdate.create({
    data: { clientId, title: title.trim(), content: content.trim() },
  });

  return NextResponse.json({
    update: {
      ...update,
      createdAt: update.createdAt.toISOString(),
    },
  });
}
