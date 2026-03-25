import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";

const handler = NextAuth(authOptions);

export async function GET(req: NextRequest, ctx: { params: Promise<{ nextauth: string[] }> }) {
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.nextAuth);
  if (rl) return rl;
  return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ nextauth: string[] }> }) {
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.nextAuth);
  if (rl) return rl;
  return handler(req, ctx);
}
