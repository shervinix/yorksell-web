import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import bcrypt from "bcrypt";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { changePasswordSchema } from "@/server/validation/schemas";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.userSession, session.user.id as string);
  if (rl) return rl;

  const parsed = await parseJsonBody(req, changePasswordSchema);
  if (!parsed.ok) return parsed.response;

  const { currentPassword, newPassword } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { passwordHash: true },
    });

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Invalid account." }, { status: 400 });
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id as string },
      data: { passwordHash },
    });

    return NextResponse.json({ message: "Password updated." });
  } catch {
    return NextResponse.json({ error: "Failed to update password." }, { status: 400 });
  }
}
