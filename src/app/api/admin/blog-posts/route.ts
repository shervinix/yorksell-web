import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";

export const runtime = "nodejs";

async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

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

type CreateBody = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl?: string | null;
  publishedAt?: string | null;
};

function parseCreateBody(body: unknown): CreateBody | null {
  if (typeof body !== "object" || body === null) return null;
  const o = body as Record<string, unknown>;
  if (
    typeof o.slug !== "string" ||
    typeof o.title !== "string" ||
    typeof o.excerpt !== "string" ||
    typeof o.body !== "string"
  )
    return null;
  return {
    slug: o.slug.trim(),
    title: (o.title as string).trim(),
    excerpt: (o.excerpt as string).trim(),
    body: (o.body as string).trim(),
    coverImageUrl:
      o.coverImageUrl === null || o.coverImageUrl === undefined
        ? undefined
        : typeof o.coverImageUrl === "string"
          ? o.coverImageUrl.trim() || null
          : null,
    publishedAt:
      o.publishedAt === null || o.publishedAt === undefined
        ? null
        : typeof o.publishedAt === "string" && o.publishedAt.trim()
          ? o.publishedAt.trim()
          : null,
  };
}

export async function POST(req: Request) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseCreateBody(body);
  if (!parsed) {
    return NextResponse.json(
      { error: "Missing or invalid fields: slug, title, excerpt, body" },
      { status: 400 }
    );
  }

  if (!parsed.slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const existing = await prisma.blogPost.findUnique({
    where: { slug: parsed.slug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A post with this slug already exists" },
      { status: 409 }
    );
  }

  const publishedAt =
    parsed.publishedAt ? new Date(parsed.publishedAt) : null;

  const post = await prisma.blogPost.create({
    data: {
      slug: parsed.slug,
      title: parsed.title,
      excerpt: parsed.excerpt,
      body: parsed.body,
      coverImageUrl: parsed.coverImageUrl ?? undefined,
      publishedAt,
    },
  });

  return NextResponse.json(post);
}
