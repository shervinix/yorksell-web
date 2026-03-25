import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.userSession, session.user.id as string);
  if (rl) return rl;

  const userId = session.user.id as string;

  const client = await prisma.client.findUnique({
    where: { userId },
    include: {
      files: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      updates: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!client) {
    return NextResponse.json({
      client: null,
      hasServices: false,
    });
  }

  const hasServices =
    client.buyerClient || client.sellerClient || client.propertyManagementClient;

  return NextResponse.json({
    client: {
      id: client.id,
      buyerClient: client.buyerClient,
      sellerClient: client.sellerClient,
      propertyManagementClient: client.propertyManagementClient,
      showFiles: client.showFiles,
      showStats: client.showStats,
      showNotes: client.showNotes,
      showUpdates: client.showUpdates,
      statsJson: client.statsJson,
      files: client.files,
      notes: client.notes,
      updates: client.updates,
    },
    hasServices,
  });
}
