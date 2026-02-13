import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

export const runtime = "nodejs";
export const maxDuration = 300;

function isAdmin(email: string | null | undefined): boolean {
  const list = process.env.ADMIN_EMAILS;
  if (!list || !email) return false;
  const emails = list.split(",").map((e) => e.trim().toLowerCase());
  return emails.includes(email.toLowerCase());
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.MLS_SYNC_KEY;
  if (!key && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "MLS_SYNC_KEY not configured. Set it in production." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const limit = Math.min(Math.max(Number(body?.limit) || 200, 1), 5000);
  const pages = Math.min(Math.max(Number(body?.pages) || 10, 1), 50);
  const dryRun = body?.dryRun === true || body?.dryRun === "true";

  const base = process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
  const url = `${base.startsWith("http") ? base : `https://${base}`}/api/mls/sync?limit=${limit}&pages=${pages}${dryRun ? "&dryRun=1" : ""}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (key) headers["x-mls-sync-key"] = key;

  const res = await fetch(url, { method: "POST", headers });
  const data = await res.json().catch(() => ({}));

  return NextResponse.json(data, { status: res.status });
}
