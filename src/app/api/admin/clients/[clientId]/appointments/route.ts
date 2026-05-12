import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminAppointmentPostSchema } from "@/server/validation/schemas";

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

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  const parsed = await parseJsonBody(req, adminAppointmentPostSchema);
  if (!parsed.ok) return parsed.response;

  const date = new Date(parsed.data.date);
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const appt = await prisma.clientAppointment.create({
    data: {
      clientId,
      title: parsed.data.title,
      date,
      notes: parsed.data.notes ?? null,
    },
  });

  return NextResponse.json({
    appointment: {
      ...appt,
      date: appt.date.toISOString(),
      createdAt: appt.createdAt.toISOString(),
    },
  });
}
