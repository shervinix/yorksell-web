import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";
import { ADMIN_EMAILS_KEY } from "@/lib/admin";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminAdminsPutSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

function parseEmailList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((e) => (typeof e === "string" ? e.trim().toLowerCase() : ""))
    .filter(Boolean);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

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
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = await parseJsonBody(req, adminAdminsPutSchema);
  if (!parsed.ok) return parsed.response;

  const additionalAdmins = parsed.data.additionalAdmins.map((e) => e.trim().toLowerCase());

  await prisma.siteSetting.upsert({
    where: { key: ADMIN_EMAILS_KEY },
    create: { key: ADMIN_EMAILS_KEY, value: additionalAdmins },
    update: { value: additionalAdmins },
  });

  return NextResponse.json({ additionalAdmins });
}
