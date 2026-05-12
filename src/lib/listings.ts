export const LISTING_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80";

export function formatPrice(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
    return "Contact";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatBedsBaths(
  beds: number | null | undefined,
  baths: number | null | undefined
): string {
  const parts: string[] = [];
  if (typeof beds === "number" && Number.isFinite(beds)) parts.push(`${beds} Bed`);
  if (typeof baths === "number" && Number.isFinite(baths)) parts.push(`${baths} Bath`);
  return parts.join(" • ");
}

export type ListingCard = {
  id: string;
  href: string;
  title: string;
  price: string;
  meta: string;
  location: string;
  image: string;
  propertyType?: string | null;
  status?: string | null;
};

type RawFeaturedListing = {
  id: string;
  ddfId?: string | null;
  mlsNumber?: string | null;
  addressLine?: string | null;
  city?: string | null;
  province?: string | null;
  price?: number | null;
  beds?: number | null;
  baths?: number | null;
  propertyType?: string | null;
  photoUrl?: string | null;
};

export function toListingCard(l: RawFeaturedListing): ListingCard {
  const title =
    l.addressLine?.trim() ||
    l.propertyType?.trim() ||
    (l.mlsNumber ? `Listing ${l.mlsNumber}` : null) ||
    (l.ddfId ? `Listing ${l.ddfId}` : null) ||
    "Listing";

  const location = [l.city?.trim(), l.province?.trim()].filter(Boolean).join(", ");
  const price = formatPrice(l.price);
  const meta = formatBedsBaths(l.beds, l.baths) || l.propertyType?.trim() || "";
  const slug = l.mlsNumber?.trim() || l.ddfId?.trim() || l.id;
  const href = `/listings/${encodeURIComponent(slug)}`;
  const image =
    l.photoUrl?.trim() ||
    (l.mlsNumber
      ? `/api/listings/photo?mlsNumber=${encodeURIComponent(l.mlsNumber)}`
      : null) ||
    (l.ddfId
      ? `/api/listings/photo?ddfId=${encodeURIComponent(l.ddfId)}`
      : null) ||
    LISTING_PLACEHOLDER_IMAGE;

  return { id: l.id, href, title, price, meta, location, image, propertyType: l.propertyType ?? null, status: null };
}

type SearchResultListing = {
  id: string;
  mlsNumber?: string | null;
  addressLine?: string | null;
  city?: string | null;
  province?: string | null;
  price?: number | null;
  beds?: number | null;
  baths?: number | null;
  propertyType?: string | null;
  photoUrl?: string | null;
  url: string;
};

export function toListingCardFromResult(l: SearchResultListing & { status?: string | null }): ListingCard {
  // Use the stored photoUrl first (fast, no external call).
  // If missing, fall back to the proxy which requests _LargePhoto_ from CREA DDF.
  const mlsNumber = (l as { mlsNumber?: string | null }).mlsNumber?.trim();
  const image =
    l.photoUrl?.trim() ||
    (mlsNumber ? `/api/listings/photo?mlsNumber=${encodeURIComponent(mlsNumber)}` : null) ||
    LISTING_PLACEHOLDER_IMAGE;

  return {
    id: l.id,
    href: l.url,
    title: l.addressLine?.trim() || l.propertyType?.trim() || "Listing",
    price: formatPrice(l.price),
    meta: formatBedsBaths(l.beds, l.baths),
    location: [l.city?.trim(), l.province?.trim()].filter(Boolean).join(", "),
    image,
    propertyType: l.propertyType ?? null,
    status: l.status ?? null,
  };
}
