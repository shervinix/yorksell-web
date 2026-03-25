import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { defaultFeaturedMlsNumbers } from "@/lib/featured-defaults";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminFeaturedPutSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

const FEATURED_SETTING_KEY = "featured_mls_numbers";

function parseMlsList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter(Boolean);
  }
  return [];
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.siteSetting.findUnique({
    where: { key: FEATURED_SETTING_KEY },
  });

  const mlsNumbers =
    row?.value != null ? parseMlsList(row.value) : [...defaultFeaturedMlsNumbers()];

  return NextResponse.json({ mlsNumbers });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = await parseJsonBody(req, adminFeaturedPutSchema);
  if (!parsed.ok) return parsed.response;

  const mlsNumbers = parsed.data.mlsNumbers;

  await prisma.siteSetting.upsert({
    where: { key: FEATURED_SETTING_KEY },
    create: { key: FEATURED_SETTING_KEY, value: mlsNumbers },
    update: { value: mlsNumbers },
  });

  return NextResponse.json({ mlsNumbers });
}
