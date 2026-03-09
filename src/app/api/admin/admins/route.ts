import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";
import { ADMIN_EMAILS_KEY } from "@/lib/admin";

export const runtime = "nodejs";

function parseEmailList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((e) => (typeof e === "string" ? e.trim().toLowerCase() : ""))
    .filter(Boolean);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const envList = process.env.ADMIN_EMAILS;
  const envAdmins = envList
    ? envList.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
    : [];

  const row = await prisma.siteSetting.findUnique({
    where: { key: ADMIN_EMAILS_KEY },
  });
  const additionalAdmins = parseEmailList(row?.value ?? []);

  return NextResponse.json({ envAdmins, additionalAdmins });
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

  const additionalAdmins = Array.isArray(body?.additionalAdmins)
    ? (body as { additionalAdmins: unknown[] }).additionalAdmins
        .map((e) => (typeof e === "string" ? e.trim().toLowerCase() : ""))
        .filter(Boolean)
    : [];

  await prisma.siteSetting.upsert({
    where: { key: ADMIN_EMAILS_KEY },
    create: { key: ADMIN_EMAILS_KEY, value: additionalAdmins },
    update: { value: additionalAdmins },
  });

  return NextResponse.json({ additionalAdmins });
}
