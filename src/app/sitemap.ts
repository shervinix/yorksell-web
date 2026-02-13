import { MetadataRoute } from "next";
import { prisma } from "@/server/db/prisma";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yorksell.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/listings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  const listings = await prisma.listing.findMany({
    select: { id: true, mlsNumber: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 1000,
  });

  const listingEntries: MetadataRoute.Sitemap = listings.map((l) => {
    const slug = (l.mlsNumber && l.mlsNumber.trim()) || l.id;
    return {
      url: `${BASE}/listings/${encodeURIComponent(slug)}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

  return [...staticPages, ...listingEntries];
}
