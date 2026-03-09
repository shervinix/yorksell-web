import { prisma } from "@/server/db/prisma";

if (typeof (prisma as { blogPost?: unknown }).blogPost === "undefined") {
  throw new Error(
    "Prisma client missing BlogPost model. Run: npx prisma generate && restart the dev server."
  );
}

const publishedPostSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImageUrl: true,
  publishedAt: true,
  updatedAt: true,
} as const;

export async function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    select: publishedPostSelect,
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, publishedAt: { not: null } },
  });
}

export async function getAllPostSlugs() {
  return prisma.blogPost.findMany({
    where: { publishedAt: { not: null } },
    select: { slug: true },
  });
}
