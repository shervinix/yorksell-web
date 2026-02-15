import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await params;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      files: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      updates: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json({
    client: {
      ...client,
      updatedAt: client.updatedAt.toISOString(),
      createdAt: client.createdAt.toISOString(),
      files: client.files.map((f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
      })),
      notes: client.notes.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      })),
      updates: client.updates.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      })),
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await params;

  const existing = await prisma.client.findUnique({
    where: { id: clientId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));

  const data: Record<string, unknown> = {};
  if (typeof body.buyerClient === "boolean") data.buyerClient = body.buyerClient;
  if (typeof body.sellerClient === "boolean")
    data.sellerClient = body.sellerClient;
  if (typeof body.propertyManagementClient === "boolean")
    data.propertyManagementClient = body.propertyManagementClient;
  if (typeof body.showFiles === "boolean") data.showFiles = body.showFiles;
  if (typeof body.showStats === "boolean") data.showStats = body.showStats;
  if (typeof body.showNotes === "boolean") data.showNotes = body.showNotes;
  if (typeof body.showUpdates === "boolean") data.showUpdates = body.showUpdates;
  if (body.statsJson !== undefined) data.statsJson = body.statsJson;

  const client = await prisma.client.update({
    where: { id: clientId },
    data,
  });

  return NextResponse.json({ client });
}
