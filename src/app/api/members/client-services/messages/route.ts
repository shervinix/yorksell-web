import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { memberMessagePostSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.userSession, session.user.id as string);
  if (rl) return rl;

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id as string },
    select: { id: true, showMessages: true },
  });

  if (!client) {
    return NextResponse.json({ error: "No client profile found" }, { status: 404 });
  }

  if (!client.showMessages) {
    return NextResponse.json({ error: "Messaging is not enabled" }, { status: 403 });
  }

  const parsed = await parseJsonBody(req, memberMessagePostSchema);
  if (!parsed.ok) return parsed.response;

  const message = await prisma.clientMessage.create({
    data: {
      clientId: client.id,
      content: parsed.data.content,
      fromAgent: false,
    },
  });

  return NextResponse.json({
    message: {
      ...message,
      readAt: message.readAt?.toISOString() ?? null,
      createdAt: message.createdAt.toISOString(),
    },
  });
}
