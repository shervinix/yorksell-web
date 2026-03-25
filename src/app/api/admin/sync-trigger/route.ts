import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminSyncTriggerSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.MLS_SYNC_KEY;
  if (!key && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "MLS_SYNC_KEY not configured. Set it in production." },
      { status: 500 }
    );
  }

  const parsed = await parseJsonBody(req, adminSyncTriggerSchema);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;
  const limit = Math.min(Math.max(body.limit ?? 200, 1), 5000);
  const pages = Math.min(Math.max(body.pages ?? 10, 1), 50);
  const dryRun = body.dryRun === true;
  const fetchDetails = body.fetchDetails === true;

  const base = process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
  const url = `${base.startsWith("http") ? base : `https://${base}`}/api/mls/sync?limit=${limit}&pages=${pages}${dryRun ? "&dryRun=1" : ""}${fetchDetails ? "&fetchDetails=1" : ""}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (key) headers["x-mls-sync-key"] = key;

  const res = await fetch(url, { method: "POST", headers });
  const data = await res.json().catch(() => ({}));

  return NextResponse.json(data, { status: res.status });
}
