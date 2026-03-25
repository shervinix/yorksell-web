import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
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
