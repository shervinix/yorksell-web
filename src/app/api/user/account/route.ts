import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import bcrypt from "bcrypt";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { deleteAccountSchema } from "@/server/validation/schemas";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.userSession, session.user.id as string);
  if (rl) return rl;

  const parsed = await parseJsonBody(req, deleteAccountSchema);
  if (!parsed.ok) return parsed.response;

  const { password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { passwordHash: true },
    });

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Invalid account." }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Password is incorrect." }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: session.user.id as string },
    });

    return NextResponse.json({ message: "Account deleted." });
  } catch {
    return NextResponse.json({ error: "Failed to delete account." }, { status: 400 });
  }
}
