import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { ListingHeroImage } from "../ListingHeroImage";
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

  const imageSrc =
    (listing.photoUrl && listing.photoUrl.trim()) ||
    (listing.mlsNumber ? `/api/listings/photo?mlsNumber=${encodeURIComponent(listing.mlsNumber)}` : null) ||
    (listing.ddfId ? `/api/listings/photo?ddfId=${encodeURIComponent(listing.ddfId)}` : null);
  // #region agent log
  const usedPhotoUrl = Boolean(listing.photoUrl && listing.photoUrl.trim());
  const payload = { location: "listings/[id]/page.tsx", message: "Listing image source", data: { listingId: id, hasPhotoUrl: usedPhotoUrl, hasMlsNumber: Boolean(listing.mlsNumber), hasDdfId: Boolean(listing.ddfId), imageSrcType: usedPhotoUrl ? "photoUrl" : imageSrc?.startsWith("/api/") ? "proxy" : "empty" }, hypothesisId: "H5" };
  try { require("fs").appendFileSync(require("path").join(process.cwd(), ".cursor", "debug.log"), JSON.stringify(payload) + "\n"); } catch {}
  fetch("http://127.0.0.1:7242/ingest/989fcf82-5e2c-43b6-af60-a19ff17876f2", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
  // #endregion
  const price = listing.price
    ? new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
      }).format(listing.price)
    : "Price on request";

  // Optional MLS fields from raw payload (CREA DDF / RETS style)
  const raw = (listing.raw ?? {}) as Record<string, unknown>;
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
  const sqft = listing.sqft ?? pickFirstNum(building?.SquareFeet, raw.SquareFeet, raw.LivingArea, building?.LivingArea);
  const lotSqft = pickFirstNum(land?.SizeTotal, raw.LotSize, land?.SizeFrontage, raw.LotSquareFeet);
  const yearBuilt = listing.yearBuilt ?? pickFirstNum(building?.ConstructedDate, raw.YearBuilt, raw.ConstructedDate);
  const postalCode = listing.postalCode?.trim() || null;
  const status = listing.status?.trim() || null;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero extends under the header (same as home page) */}
      <section className="relative -mt-20 h-[65vh] w-full min-h-[320px] pt-20 sm:-mt-[5.5rem] sm:pt-[5.5rem]">
        <ListingHeroImage src={imageSrc || ""} />
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
                <Detail label="Lot (sq. ft.)" value={lotSqft != null ? lotSqft.toLocaleString() : null} />
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