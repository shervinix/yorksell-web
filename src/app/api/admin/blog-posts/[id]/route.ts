import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit, RATE_LIMIT_PRESETS } from "@/server/rate-limit";
import { parseJsonBody } from "@/server/validation/parse-json";
import { adminBlogUpdateSchema } from "@/server/validation/schemas";

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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const denied = await gateAdmin(req);
  if (denied) return denied;

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
  const denied = await gateAdmin(req);
  if (denied) return denied;

  const { id } = await (typeof (params as Promise<{ id: string }>).then === "function"
    ? (params as Promise<{ id: string }>)
    : Promise.resolve(params as { id: string }));

  const parsed = await parseJsonBody(req, adminBlogUpdateSchema);
  if (!parsed.ok) return parsed.response;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const b = parsed.data;

  if (b.slug !== undefined && b.slug !== existing.slug) {
    const conflict = await prisma.blogPost.findUnique({
      where: { slug: b.slug },
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
  if (b.slug !== undefined) data.slug = b.slug;
  if (b.title !== undefined) data.title = b.title;
  if (b.excerpt !== undefined) data.excerpt = b.excerpt;
  if (b.body !== undefined) data.body = b.body;
  if (b.coverImageUrl !== undefined) data.coverImageUrl = b.coverImageUrl;
  if (b.publishedAt !== undefined) {
    data.publishedAt =
      b.publishedAt && b.publishedAt !== "" ? new Date(b.publishedAt) : null;
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data,
  });

  return NextResponse.json(post);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const denied = await gateAdmin(req);
  if (denied) return denied;

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
