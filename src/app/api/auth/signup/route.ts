import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { signupSchema } from "@/server/validation/schemas";

export async function POST(req: Request) {
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.authSignup);
  if (rl) return rl;

  const parsed = await parseJsonBody(req, signupSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const { email: emailRaw, password, name: nameField } = parsed.data;
    const email = emailRaw.toLowerCase().trim();
    const name =
      nameField === "" || nameField == null
        ? null
        : String(nameField).trim() || null;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
