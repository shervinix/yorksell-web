import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { profilePatchSchema } from "@/server/validation/schemas";

function normField(v: string | null | "" | undefined): string | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  return v;
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.userSession, session.user.id as string);
  if (rl) return rl;

  const parsed = await parseJsonBody(req, profilePatchSchema);
  if (!parsed.ok) return parsed.response;

  const b = parsed.data;
  const data: {
    name?: string | null;
    phone?: string | null;
    company?: string | null;
    address?: string | null;
    image?: string | null;
  } = {};
  if (b.name !== undefined) data.name = normField(b.name);
  if (b.phone !== undefined) data.phone = normField(b.phone);
  if (b.company !== undefined) data.company = normField(b.company);
  if (b.address !== undefined) data.address = normField(b.address);
  if (b.image !== undefined) data.image = b.image ?? null;

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id as string },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        address: true,
        image: true,
      },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Failed to update profile." }, { status: 400 });
  }
}
