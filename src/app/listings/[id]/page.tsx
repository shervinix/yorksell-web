import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { getListingPhotoUrls, isHdPhotoUrl } from "@/lib/listing-photos";
import { ListingPhotoSlideshow } from "../ListingPhotoSlideshow";
import { SaveListingButton } from "./SaveListingButton";

/** Pick first non-empty string from MLS raw. */
function pickFirstStr(...vals: unknown[]): string | null {
  for (const v of vals) {
    if (typeof v === "string" && v.trim() !== "") return v.trim();
  }
  return null;
}

/** Pick first finite number from MLS raw (handles nested objects). */
function pickFirstNum(...vals: unknown[]): number | null {
  for (const v of vals) {
    if (v == null) continue;
    const n = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(n)) return Math.trunc(n);
  }
  return null;
}

/** Pick first finite number preserving decimals (for lot dimensions). */
function pickFirstFloat(...vals: unknown[]): number | null {
  for (const v of vals) {
    if (v == null) continue;
    const n = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(n)) return n;
  }
  return null;
}

/** Format dimension for display: keep decimals, trim trailing zeros. */
function formatDimension(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const s = n.toFixed(2).replace(/\.?0+$/, "");
  return s;
}

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await (typeof (params as Promise<{ id: string }>).then === "function"
    ? (params as Promise<{ id: string }>)
    : Promise.resolve(params as { id: string }));
  const listing = await prisma.listing.findFirst({
    where: { OR: [{ id }, { mlsNumber: id }, { ddfId: id }] },
    select: { addressLine: true, city: true, province: true, price: true, beds: true, baths: true, mlsNumber: true, ddfId: true },
  });
  if (!listing) return { title: "Listing | Yorksell" };
  const title = [listing.addressLine, listing.mlsNumber].filter(Boolean).join(" — ") || "Listing";
  const descParts = [
    listing.price ? `$${listing.price.toLocaleString()}` : null,
    listing.beds != null ? `${listing.beds} bed` : null,
    listing.baths != null ? `${listing.baths} bath` : null,
    [listing.city, listing.province].filter(Boolean).join(", ") || null,
  ].filter(Boolean);
  return {
    title: `${title} | Yorksell`,
    description: descParts.length ? descParts.join(" · ") : "Property listing from Yorksell Real Estate Group.",
  };
}

export default async function ListingPage({ params }: PageProps) {
  const { id } = await (typeof (params as Promise<{ id: string }>).then === "function"
    ? (params as Promise<{ id: string }>)
    : Promise.resolve(params as { id: string }));

  const listing = await prisma.listing.findFirst({
    where: { OR: [{ id }, { mlsNumber: id }, { ddfId: id }] },
  });

  if (!listing) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  let isSaved = false;
  if (session?.user?.id) {
    const saved = await prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id as string,
          listingId: listing.id,
        },
      },
    });
    isSaved = !!saved;
  }

  // Prefer digest proxy (requests _LargePhoto_ first) over stored photoUrl, which is often a smaller DDF field.
  const proxyPhoto =
    (listing.mlsNumber ? `/api/listings/photo?mlsNumber=${encodeURIComponent(listing.mlsNumber)}` : null) ||
    (listing.ddfId ? `/api/listings/photo?ddfId=${encodeURIComponent(listing.ddfId)}` : null);
  const stored = listing.photoUrl?.trim() ?? "";
  const fallbackImageSrc =
    proxyPhoto || (stored && isHdPhotoUrl(stored) ? stored : "") || "";
  const raw = (listing.raw ?? {}) as Record<string, unknown>;
  const photoUrls = getListingPhotoUrls(raw);
  const price = listing.price
    ? new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
      }).format(listing.price)
    : "Price on request";

  // Optional MLS fields from raw payload (CREA DDF / RETS style)
  const building = raw.Building as Record<string, unknown> | undefined;
  const land = raw.Land as Record<string, unknown> | undefined;
  const property = raw.Property as Record<string, unknown> | undefined;
  const description = pickFirstStr(
    raw.PublicRemarks,
    raw.Remarks,
    raw.Description,
    raw.LongDescription,
    property?.PublicRemarks,
    property?.Remarks
  );
  const sqft =
    listing.sqft ??
    pickFirstNum(
      building?.SizeInterior,
      building?.SizeTotal,
      building?.BuildingAreaTotal,
      building?.TotalFloorArea,
      building?.SquareFeet,
      building?.LivingArea,
      raw.SizeInterior,
      raw.SizeTotal,
      raw.BuildingAreaTotal,
      raw.TotalFloorArea,
      raw.SquareFeet,
      raw.LivingArea
    );

  // Lot size: prefer explicit frontage/depth in feet, fall back to SizeTotalText when needed.
  const lotSizeText = pickFirstStr(
    land?.SizeTotalText,
    raw.SizeTotalText,
    land?.SizeIrregular,
    raw.SizeIrregular
  );

  let lotWidth =
    pickFirstFloat(
      land?.SizeFrontage,
      raw.SizeFrontage,
      land?.Frontage,
      raw.Frontage
    ) ?? null;
  let lotDepth =
    pickFirstFloat(
      land?.SizeDepth,
      raw.SizeDepth,
      land?.Depth,
      raw.Depth
    ) ?? null;

  // Try to parse dimensions like "30.00 ft X 120.00 ft" from text when numbers are missing (keep decimals).
  if ((!lotWidth || !lotDepth) && lotSizeText) {
    const match = lotSizeText.match(/(\d+(?:\.\d+)?)\s*ft.*?[x×]\s*(\d+(?:\.\d+)?)\s*ft/i);
    if (match) {
      const w = Number(match[1]);
      const d = Number(match[2]);
      if (!lotWidth && Number.isFinite(w)) lotWidth = w;
      if (!lotDepth && Number.isFinite(d)) lotDepth = d;
    }
  }

  // Some feeds (e.g. CREA DDF) store frontage/depth in tenths of a foot; convert when values look like that (e.g. 499 → 49.9 ft).
  if (
    lotWidth != null &&
    lotDepth != null &&
    lotWidth >= 400 &&
    lotDepth >= 400
  ) {
    lotWidth = lotWidth / 10;
    lotDepth = lotDepth / 10;
  }

  const lotSize =
    lotWidth != null && lotDepth != null
      ? `${formatDimension(lotWidth)} x ${formatDimension(lotDepth)} ft`
      : lotSizeText || null;

  const yearBuilt = listing.yearBuilt ?? pickFirstNum(building?.ConstructedDate, raw.YearBuilt, raw.ConstructedDate);
  const postalCode = listing.postalCode?.trim() || null;
  const status = listing.status?.trim() || null;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero extends under the header (same as home page) */}
      <section className="relative -mt-20 h-[65vh] w-full min-h-[320px] pt-20 sm:-mt-[5.5rem] sm:pt-[5.5rem]">
        <ListingPhotoSlideshow
          photos={photoUrls}
          fallbackSrc={fallbackImageSrc}
          alt={listing.addressLine || listing.mlsNumber || "Listing"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <h1 className="text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            {listing.addressLine || (listing.mlsNumber && `Listing ${listing.mlsNumber}`) || (listing.ddfId && `Listing ${listing.ddfId}`) || "Property"}
          </h1>
          <p className="mt-2 text-white/80">
            {[listing.city, listing.province].filter(Boolean).join(", ")}
          </p>
          <p className="mt-4 text-2xl font-medium text-white md:text-3xl">{price}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-10">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Details</h2>
              <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                <Detail label="Bedrooms" value={listing.beds} />
                <Detail label="Bathrooms" value={listing.baths} />
                <Detail label="Type" value={listing.propertyType} />
                <Detail label="MLS®" value={listing.mlsNumber} />
                <Detail label="Status" value={status} />
                <Detail label="Postal code" value={postalCode} />
                <Detail label="Sq. ft." value={sqft != null ? sqft.toLocaleString() : null} />
                <Detail label="Lot size" value={lotSize} />
                <Detail label="Year built" value={yearBuilt} />
              </div>
            </div>
            {description && (
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Description</h2>
                <p className="mt-4 whitespace-pre-line text-[var(--muted)] leading-relaxed">
                  {description}
                </p>
              </div>
            )}
          </div>
          <aside className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)] h-fit">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Request information</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Full details, pricing context, or a private showing.
            </p>
            <Link
              href={`/contact?listing=${encodeURIComponent(listing.mlsNumber ?? listing.id)}`}
              className="mt-6 block w-full rounded-xl bg-[var(--accent)] py-3 text-center text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
            >
              Contact us
            </Link>
            {session?.user && (
              <SaveListingButton listingId={listing.id} initialSaved={isSaved} />
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-[var(--foreground)]">{value ?? "—"}</p>
    </div>
  );
}