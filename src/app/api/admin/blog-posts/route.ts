import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminBlogCreateSchema } from "@/server/validation/schemas";

export const runtime = "nodejs";

async function gateAdmin(req: Request): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  const rl = enforceRateLimit(req, RATE_LIMIT_PRESETS.admin, session?.user?.id as string | undefined);
  if (rl) return rl;

  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: Request) {
  const denied = await gateAdmin(req);
  if (denied) return denied;

  const posts = await prisma.blogPost.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImageUrl: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const denied = await gateAdmin(req);
  if (denied) return denied;

  const parsed = await parseJsonBody(req, adminBlogCreateSchema);
  if (!parsed.ok) return parsed.response;

  const data = parsed.data;

  const existing = await prisma.blogPost.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A post with this slug already exists" },
      { status: 409 }
    );
  }

  const publishedAt =
    data.publishedAt && data.publishedAt !== ""
      ? new Date(data.publishedAt)
      : null;

  const coverImageUrl =
    data.coverImageUrl === "" || data.coverImageUrl == null
      ? undefined
      : data.coverImageUrl;

  const post = await prisma.blogPost.create({
    data: {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      coverImageUrl,
      publishedAt,
    },
  });

  return NextResponse.json(post);
}
