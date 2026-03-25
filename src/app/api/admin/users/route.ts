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

  const { searchParams } = new URL(req.url);
  for (const k of new Set(searchParams.keys())) {
    if (k !== "q") {
      return NextResponse.json(
        { error: `Unknown query parameter: ${k}` },
        { status: 400 }
      );
    }
  }

  const qRaw = searchParams.get("q")?.trim().toLowerCase() || "";
  if (qRaw.length > 200) {
    return NextResponse.json({ error: "Invalid search query." }, { status: 400 });
  }
  const q = qRaw;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      client: { select: { id: true } },
    },
    orderBy: { email: "asc" },
    take: 50,
  });

  let filtered = users;
  if (q) {
    filtered = users.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    users: filtered.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      hasClient: !!u.client,
    })),
  });
}
