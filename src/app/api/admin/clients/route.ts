import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
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
  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const userId = typeof body.userId === "string" ? body.userId.trim() : null;
  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.client.findUnique({
    where: { userId },
  });

  const data = {
    buyerClient: !!body.buyerClient,
    sellerClient: !!body.sellerClient,
    propertyManagementClient: !!body.propertyManagementClient,
    showFiles: body.showFiles !== false,
    showStats: body.showStats !== false,
    showNotes: body.showNotes !== false,
    showUpdates: body.showUpdates !== false,
    statsJson: body.statsJson ?? null,
  };

  const client = existing
    ? await prisma.client.update({
        where: { id: existing.id },
        data,
      })
    : await prisma.client.create({
        data: { userId, ...data },
      });

  return NextResponse.json({ client });
}
