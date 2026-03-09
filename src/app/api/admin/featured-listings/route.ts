import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";

export const runtime = "nodejs";

const FEATURED_SETTING_KEY = "featured_mls_numbers";

const DEFAULT_MLS_NUMBERS = ["C12677558", "N12855168", "C12733910"];

function parseMlsList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter(Boolean);
  }
  return [];
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = await prisma.siteSetting.findUnique({
    where: { key: FEATURED_SETTING_KEY },
  });

  const mlsNumbers =
    row?.value != null
      ? parseMlsList(row.value)
      : [...DEFAULT_MLS_NUMBERS];

  return NextResponse.json({ mlsNumbers });
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
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const mlsNumbers = parseMlsList(
    typeof body === "object" && body !== null && "mlsNumbers" in body
      ? (body as { mlsNumbers: unknown }).mlsNumbers
      : body
  );

  await prisma.siteSetting.upsert({
    where: { key: FEATURED_SETTING_KEY },
    create: { key: FEATURED_SETTING_KEY, value: mlsNumbers },
    update: { value: mlsNumbers },
  });

  return NextResponse.json({ mlsNumbers });
}
