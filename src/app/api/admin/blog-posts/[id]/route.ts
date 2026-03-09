import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";

export const runtime = "nodejs";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !(await isAdmin(session.user.email, prisma))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

type UpdateBody = {
  slug?: string;
  title?: string;
  excerpt?: string;
  body?: string;
  coverImageUrl?: string | null;
  publishedAt?: string | null;
};

function parseUpdateBody(body: unknown): UpdateBody | null {
  if (typeof body !== "object" || body === null) return null;
  const o = body as Record<string, unknown>;
  const result: UpdateBody = {};
  if (typeof o.slug === "string") result.slug = o.slug.trim();
  if (typeof o.title === "string") result.title = o.title.trim();
  if (typeof o.excerpt === "string") result.excerpt = o.excerpt.trim();
  if (typeof o.body === "string") result.body = o.body.trim();
  if (o.coverImageUrl !== undefined)
    result.coverImageUrl =
      o.coverImageUrl === null || o.coverImageUrl === ""
        ? null
        : typeof o.coverImageUrl === "string"
          ? o.coverImageUrl.trim() || null
          : undefined;
  if (o.publishedAt !== undefined)
    result.publishedAt =
      o.publishedAt === null || o.publishedAt === ""
        ? null
        : typeof o.publishedAt === "string" && o.publishedAt.trim()
          ? o.publishedAt.trim()
          : null;
  return result;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await (typeof (params as Promise<{ id: string }>).then === "function"
    ? (params as Promise<{ id: string }>)
    : Promise.resolve(params as { id: string }));

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await (typeof (params as Promise<{ id: string }>).then === "function"
    ? (params as Promise<{ id: string }>)
    : Promise.resolve(params as { id: string }));

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseUpdateBody(body);
  if (!parsed || Object.keys(parsed).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (parsed.slug !== undefined && parsed.slug !== existing.slug) {
    const conflict = await prisma.blogPost.findUnique({
      where: { slug: parsed.slug },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }
  }

  const data: {
    slug?: string;
    title?: string;
    excerpt?: string;
    body?: string;
    coverImageUrl?: string | null;
    publishedAt?: Date | null;
  } = {};
  if (parsed.slug !== undefined) data.slug = parsed.slug;
  if (parsed.title !== undefined) data.title = parsed.title;
  if (parsed.excerpt !== undefined) data.excerpt = parsed.excerpt;
  if (parsed.body !== undefined) data.body = parsed.body;
  if (parsed.coverImageUrl !== undefined) data.coverImageUrl = parsed.coverImageUrl;
  if (parsed.publishedAt !== undefined) {
    data.publishedAt = parsed.publishedAt ? new Date(parsed.publishedAt) : null;
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data,
  });

  return NextResponse.json(post);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const unauth = await requireAdmin();
  if (unauth) return unauth;

  const { id } = await (typeof (params as Promise<{ id: string }>).then === "function"
    ? (params as Promise<{ id: string }>)
    : Promise.resolve(params as { id: string }));

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
