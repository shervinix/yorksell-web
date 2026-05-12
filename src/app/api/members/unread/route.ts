import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ unread: 0 });
  }

  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.userSession, session.user.id as string);
  if (rl) return NextResponse.json({ unread: 0 });

  try {
    const client = await prisma.client.findUnique({
      where: { userId: session.user.id as string },
      select: { id: true },
    });

    if (!client) return NextResponse.json({ unread: 0 });

    const unread = await prisma.clientMessage.count({
      where: { clientId: client.id, fromAgent: true, readAt: null },
    });

    return NextResponse.json({ unread });
  } catch {
    return NextResponse.json({ unread: 0 });
  }
}
