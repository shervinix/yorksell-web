import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { mlsSyncSchedulePutSchema } from "@/server/validation/schemas";

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

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

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
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = await parseJsonBody(req, mlsSyncSchedulePutSchema);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;

  const row = await prisma.siteSetting.findUnique({
    where: { key: SCHEDULE_KEY },
  });
  const current = parseSchedule(row?.value ?? null);

  const enabled = body.enabled !== undefined ? body.enabled : current.enabled;
  const time = body.time !== undefined ? body.time : current.time;
  const timezone =
    body.timezone !== undefined ? body.timezone.trim() || current.timezone : current.timezone;

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
