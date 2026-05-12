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
      checklist: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
      messages: { orderBy: { createdAt: "asc" } },
      appointments: { orderBy: { date: "asc" } },
      offers: { orderBy: { createdAt: "desc" } },
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
      checklist: client.checklist.map((c) => ({
        ...c,
        doneAt: c.doneAt?.toISOString() ?? null,
        createdAt: c.createdAt.toISOString(),
      })),
      messages: client.messages.map((m) => ({
        ...m,
        readAt: m.readAt?.toISOString() ?? null,
        createdAt: m.createdAt.toISOString(),
      })),
      appointments: client.appointments.map((a) => ({
        ...a,
        date: a.date.toISOString(),
        createdAt: a.createdAt.toISOString(),
      })),
      offers: client.offers.map((o) => ({
        ...o,
        closingDate: o.closingDate?.toISOString() ?? null,
        createdAt: o.createdAt.toISOString(),
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
  if (body.showChecklist !== undefined) data.showChecklist = body.showChecklist;
  if (body.showMessages !== undefined) data.showMessages = body.showMessages;
  if (body.showAppointments !== undefined) data.showAppointments = body.showAppointments;
  if (body.showOffers !== undefined) data.showOffers = body.showOffers;
  if (body.stage !== undefined) data.stage = body.stage;
  if (body.agentName !== undefined) data.agentName = body.agentName;
  if (body.agentTitle !== undefined) data.agentTitle = body.agentTitle;
  if (body.agentPhone !== undefined) data.agentPhone = body.agentPhone;
  if (body.agentEmail !== undefined) data.agentEmail = body.agentEmail;
  if (body.pinnedListingIds !== undefined) data.pinnedListingIds = body.pinnedListingIds;
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
