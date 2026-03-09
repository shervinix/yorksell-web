import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";

export const runtime = "nodejs";

const SCHEDULE_KEY = "mls_sync_schedule";

export type MlsSyncSchedule = {
  enabled: boolean;
  time: string; // "HH:mm"
  timezone: string;
  lastScheduledRunAt?: string | null;
};

const DEFAULT: MlsSyncSchedule = {
  enabled: false,
  time: "04:00",
  timezone: "America/Toronto",
};

function parseSchedule(value: unknown): MlsSyncSchedule {
  if (value == null || typeof value !== "object") return { ...DEFAULT };
  const o = value as Record<string, unknown>;
  return {
    enabled: Boolean(o.enabled),
    time: typeof o.time === "string" && /^\d{1,2}:\d{2}$/.test(o.time) ? o.time : DEFAULT.time,
    timezone: typeof o.timezone === "string" && o.timezone.trim() ? o.timezone.trim() : DEFAULT.timezone,
    lastScheduledRunAt: typeof o.lastScheduledRunAt === "string" ? o.lastScheduledRunAt : undefined,
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.siteSetting.findUnique({
    where: { key: SCHEDULE_KEY },
  });

  const schedule = parseSchedule(row?.value ?? null);
  return NextResponse.json(schedule);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const row = await prisma.siteSetting.findUnique({
    where: { key: SCHEDULE_KEY },
  });
  const current = parseSchedule(row?.value ?? null);

  const enabled = typeof body === "object" && body !== null && "enabled" in body
    ? Boolean((body as Record<string, unknown>).enabled)
    : current.enabled;
  const time = typeof body === "object" && body !== null && "time" in body
    ? String((body as Record<string, unknown>).time)
    : current.time;
  const timezone = typeof body === "object" && body !== null && "timezone" in body
    ? String((body as Record<string, unknown>).timezone).trim() || current.timezone
    : current.timezone;

  const timeMatch = time.match(/^(\d{1,2}):(\d{2})$/);
  const hour = timeMatch ? Math.min(23, Math.max(0, parseInt(timeMatch[1]!, 10))) : 4;
  const minute = timeMatch ? Math.min(59, Math.max(0, parseInt(timeMatch[2]!, 10))) : 0;
  const normalizedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  const value: MlsSyncSchedule = {
    enabled,
    time: normalizedTime,
    timezone: timezone || DEFAULT.timezone,
    lastScheduledRunAt: current.lastScheduledRunAt,
  };

  await prisma.siteSetting.upsert({
    where: { key: SCHEDULE_KEY },
    create: { key: SCHEDULE_KEY, value },
    update: { value },
  });

  return NextResponse.json(value);
}
