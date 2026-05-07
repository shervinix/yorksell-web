import { prisma } from "@/server/db/prisma";
import { defaultFeaturedMlsNumbers } from "@/lib/featured-defaults";
import { toListingCard, type ListingCard } from "@/lib/listings";

const FEATURED_SETTING_KEY = "featured_mls_numbers";

export async function getFeaturedListings(): Promise<ListingCard[]> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: FEATURED_SETTING_KEY },
    });
    const mlsNumbers = Array.isArray(setting?.value)
      ? (setting.value as unknown[]).filter(
          (v): v is string => typeof v === "string" && v.trim() !== ""
        )
      : defaultFeaturedMlsNumbers();

    if (mlsNumbers.length === 0) return [];

    const rows = await prisma.listing.findMany({
      where: { mlsNumber: { in: mlsNumbers, mode: "insensitive" } },
      select: {
        id: true,
        ddfId: true,
        mlsNumber: true,
        addressLine: true,
        city: true,
        province: true,
        price: true,
        beds: true,
        baths: true,
        propertyType: true,
        photoUrl: true,
      },
    });

    const orderMap = new Map(
      mlsNumbers.map((mls, i) => [mls.toLowerCase(), i])
    );
    return [...rows]
      .sort(
        (a, b) =>
          (orderMap.get((a.mlsNumber ?? "").toLowerCase()) ?? 999) -
          (orderMap.get((b.mlsNumber ?? "").toLowerCase()) ?? 999)
      )
      .map(toListingCard);
  } catch {
    return [];
  }
}
