import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";

export const runtime = "nodejs";

function isAdmin(email: string | null | undefined): boolean {
  const list = process.env.ADMIN_EMAILS;
  if (!list || !email) return false;
  const emails = list.split(",").map((e) => e.trim().toLowerCase());
  return emails.includes(email.toLowerCase());
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const state = await prisma.ddfSyncState.findUnique({
    where: { name: "mls_sync" },
  });

  return NextResponse.json({
    state: state
      ? {
          lastRunAt: state.lastRunAt?.toISOString() ?? null,
          status: state.status,
          lastError: state.lastError,
          processed: state.processed,
          upserted: state.upserted,
          errorCount: state.errorCount,
        }
      : null,
  });
}
