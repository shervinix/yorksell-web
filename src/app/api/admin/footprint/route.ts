import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";
import {
  FOOTPRINT_SETTING_KEY,
  getFootprintFromValue,
  type FootprintData,
} from "@/lib/footprint";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminFootprintPutSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.siteSetting.findUnique({
    where: { key: FOOTPRINT_SETTING_KEY },
  });
  const data = getFootprintFromValue(row?.value ?? null);
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = await parseJsonBody(req, adminFootprintPutSchema);
  if (!parsed.ok) return parsed.response;

  const value: FootprintData = {
    points: parsed.data.points,
    performanceOverrides: parsed.data.performanceOverrides ?? undefined,
  };

  const asJson = value as unknown as Prisma.InputJsonValue;

  await prisma.siteSetting.upsert({
    where: { key: FOOTPRINT_SETTING_KEY },
    create: { key: FOOTPRINT_SETTING_KEY, value: asJson },
    update: { value: asJson },
  });

  return NextResponse.json(value);
}
