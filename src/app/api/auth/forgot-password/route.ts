import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";

export async function POST(req: Request) {
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.authSignup);
  if (rl) return rl;

  let email: string;
  try {
    const body = await req.json();
    email = (body?.email ?? "").toLowerCase().trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  // Always respond with success to avoid revealing whether an account exists.
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ ok: true });
  }

  // Delete any existing token for this user, then create a fresh one.
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, email, expiresAt },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;

  // ── Email sending ─────────────────────────────────────────────────────────
  // Wire up your email provider here (Resend, Nodemailer, etc.).
  // Example with Resend:
  //   await resend.emails.send({
  //     from: "Yorksell <noreply@yorksell.ca>",
  //     to: email,
  //     subject: "Reset your password",
  //     html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
  //   });
  //
  // Until then, the reset URL is logged to the server console for development use.
  console.log(`[Password Reset] URL for ${email}: ${resetUrl}`);

  return NextResponse.json({ ok: true });
}
