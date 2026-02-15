import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { isAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim()?.toLowerCase() || "";

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
