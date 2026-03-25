import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminClientPostSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { files: true, notes: true, updates: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    clients: clients.map((c) => ({
      id: c.id,
      userId: c.userId,
      user: c.user,
      buyerClient: c.buyerClient,
      sellerClient: c.sellerClient,
      propertyManagementClient: c.propertyManagementClient,
      showFiles: c.showFiles,
      showStats: c.showStats,
      showNotes: c.showNotes,
      showUpdates: c.showUpdates,
      statsJson: c.statsJson,
      fileCount: c._count.files,
      noteCount: c._count.notes,
      updateCount: c._count.updates,
      updatedAt: c.updatedAt.toISOString(),
    })),
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = await parseJsonBody(req, adminClientPostSchema);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;
  const userId = body.userId.trim();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.client.findUnique({
    where: { userId },
  });

  const flags = {
    buyerClient: body.buyerClient === true,
    sellerClient: body.sellerClient === true,
    propertyManagementClient: body.propertyManagementClient === true,
    showFiles: body.showFiles !== false,
    showStats: body.showStats !== false,
    showNotes: body.showNotes !== false,
    showUpdates: body.showUpdates !== false,
  };
  const statsPart =
    body.statsJson === undefined
      ? {}
      : {
          statsJson:
            body.statsJson === null
              ? Prisma.JsonNull
              : (body.statsJson as Prisma.InputJsonValue),
        };

  const client = existing
    ? await prisma.client.update({
        where: { id: existing.id },
        data: { ...flags, ...statsPart },
      })
    : await prisma.client.create({
        data: { userId, ...flags, ...statsPart },
      });

  return NextResponse.json({ client });
}
