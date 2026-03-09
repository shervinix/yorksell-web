import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";

export const runtime = "nodejs";
export const maxDuration = 300;

const SCHEDULE_KEY = "mls_sync_schedule";

type ScheduleValue = {
  enabled?: boolean;
  time?: string;
  timezone?: string;
  lastScheduledRunAt?: string | null;
};

function getTodayInTz(timezone: string): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: timezone }); // "YYYY-MM-DD"
}

function getHourMinuteInTz(timezone: string): { hour: number; minute: number } {
  const s = new Date().toLocaleTimeString("en-CA", {
    timeZone: timezone,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  const [hour, minute] = s.split(":").map((n) => parseInt(n, 10));
  return { hour: Number.isFinite(hour) ? hour! : 0, minute: Number.isFinite(minute) ? minute! : 0 };
}

function getDateInTz(isoDate: string, timezone: string): string {
  return new Date(isoDate).toLocaleDateString("en-CA", { timeZone: timezone });
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const row = await prisma.siteSetting.findUnique({
    where: { key: SCHEDULE_KEY },
  });
  const schedule = (row?.value ?? {}) as ScheduleValue;
  if (!schedule.enabled || !schedule.time || !schedule.timezone) {
    return NextResponse.json({ ok: true, ran: false, reason: "schedule_disabled_or_incomplete" });
  }

  const [schedHour, schedMin] = schedule.time.split(":").map((n) => parseInt(n, 10));
  const tz = schedule.timezone;
  const today = getTodayInTz(tz);
  const { hour, minute } = getHourMinuteInTz(tz);

  // Run when current time in TZ is in the same hour as scheduled (e.g. 04:00 → run between 04:00 and 04:59)
  const hourMatch = hour === (Number.isFinite(schedHour) ? schedHour! : 4);
  if (!hourMatch) {
    return NextResponse.json({ ok: true, ran: false, reason: "not_scheduled_hour", hour, schedHour });
  }

  // At most once per day in the schedule timezone
  const lastRun = schedule.lastScheduledRunAt;
  if (lastRun) {
    const lastRunDateInTz = getDateInTz(lastRun, tz);
    if (lastRunDateInTz === today) {
      return NextResponse.json({ ok: true, ran: false, reason: "already_ran_today", today });
    }
  }

  const syncKey = process.env.MLS_SYNC_KEY;
  if (!syncKey && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, error: "MLS_SYNC_KEY not set" },
      { status: 500 }
    );
  }

  const base = process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
  const url = `${base.startsWith("http") ? base : `https://${base}`}/api/mls/sync?limit=500&pages=10&fetchDetails=1`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (syncKey) headers["x-mls-sync-key"] = syncKey;

  const res = await fetch(url, { method: "POST", headers });
  const data = await res.json().catch(() => ({}));

  const nowIso = new Date().toISOString();
  await prisma.siteSetting.upsert({
    where: { key: SCHEDULE_KEY },
    create: {
      key: SCHEDULE_KEY,
      value: {
        ...schedule,
        enabled: schedule.enabled,
        time: schedule.time,
        timezone: schedule.timezone,
        lastScheduledRunAt: nowIso,
      },
    },
    update: {
      value: {
        ...schedule,
        lastScheduledRunAt: nowIso,
      },
    },
  });

  return NextResponse.json({
    ok: res.ok,
    ran: true,
    syncStatus: res.status,
    syncData: data,
  });
}
