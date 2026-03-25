import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminClientPatchSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

export async function GET(
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
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = await params;

  const existing = await prisma.client.findUnique({
    where: { id: clientId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const parsed = await parseJsonBody(req, adminClientPatchSchema);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;
  const data: Prisma.ClientUncheckedUpdateInput = {};
  if (body.buyerClient !== undefined) data.buyerClient = body.buyerClient;
  if (body.sellerClient !== undefined) data.sellerClient = body.sellerClient;
  if (body.propertyManagementClient !== undefined)
    data.propertyManagementClient = body.propertyManagementClient;
  if (body.showFiles !== undefined) data.showFiles = body.showFiles;
  if (body.showStats !== undefined) data.showStats = body.showStats;
  if (body.showNotes !== undefined) data.showNotes = body.showNotes;
  if (body.showUpdates !== undefined) data.showUpdates = body.showUpdates;
  if (body.statsJson !== undefined) {
    data.statsJson =
      body.statsJson === null
        ? Prisma.JsonNull
        : (body.statsJson as Prisma.InputJsonValue);
  }

  const client = await prisma.client.update({
    where: { id: clientId },
    data,
  });

  return NextResponse.json({ client });
}
