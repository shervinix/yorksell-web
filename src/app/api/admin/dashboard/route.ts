import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const now = new Date();

  const [
    totalLeads,
    newLeads,
    recentLeads,
    totalClients,
    totalListings,
    publishedPosts,
    draftPosts,
    syncState,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, source: true, createdAt: true, message: true },
    }),
    prisma.client.count(),
    prisma.listing.count(),
    prisma.blogPost.count({ where: { publishedAt: { not: null, lte: now } } }),
    prisma.blogPost.count({ where: { OR: [{ publishedAt: null }, { publishedAt: { gt: now } }] } }),
    prisma.ddfSyncState.findUnique({ where: { name: "mls_sync" } }),
  ]);

  return NextResponse.json({
    stats: { totalLeads, newLeads, totalClients, totalListings, publishedPosts, draftPosts },
    recentLeads,
    syncState: syncState
      ? {
          lastRunAt: syncState.lastRunAt?.toISOString() ?? null,
          status: syncState.status,
          lastError: syncState.lastError,
          processed: syncState.processed,
          upserted: syncState.upserted,
        }
      : null,
  });
}
