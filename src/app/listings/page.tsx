import Link from "next/link";
import { prisma } from "@/server/db/prisma";

const PAGE_SIZE = 24;
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80";

function formatPrice(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return "Contact";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatBedsBaths(beds: number | null | undefined, baths: number | null | undefined) {
  const parts: string[] = [];
  if (typeof beds === "number" && Number.isFinite(beds)) parts.push(`${beds} Bed`);
  if (typeof baths === "number" && Number.isFinite(baths)) parts.push(`${baths} Bath`);
  return parts.length ? parts.join(" • ") : "";
}

type SearchParams = { [key: string]: string | string[] | undefined };

interface PageProps {
  searchParams: Promise<SearchParams> | SearchParams;
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const params = await (typeof searchParams.then === "function" ? searchParams : Promise.resolve(searchParams));
  const page = Math.max(1, Number(params.page) || 1);
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const beds = params.beds ? Number(params.beds) : undefined;
  const city = typeof params.city === "string" ? params.city.trim() || undefined : undefined;
  const propertyType = typeof params.propertyType === "string" ? params.propertyType.trim() || undefined : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "updated_desc";

  const where: Parameters<typeof prisma.listing.findMany>[0]["where"] = {};
  if (minPrice != null && maxPrice != null && Number.isFinite(minPrice) && Number.isFinite(maxPrice)) {
    where.price = { gte: minPrice, lte: maxPrice };
  } else if (minPrice != null && Number.isFinite(minPrice)) {
    where.price = { gte: minPrice };
  } else if (maxPrice != null && Number.isFinite(maxPrice)) {
    where.price = { lte: maxPrice };
  }
  if (beds != null && Number.isFinite(beds)) where.beds = { gte: beds };
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (propertyType) where.propertyType = { contains: propertyType, mode: "insensitive" };

  const orderBy: Parameters<typeof prisma.listing.findMany>[0]["orderBy"] =
    sort === "price_asc"
      ? [{ price: "asc" }, { updatedAt: "desc" }]
      : sort === "price_desc"
        ? [{ price: "desc" }, { updatedAt: "desc" }]
        : [{ updatedAt: "desc" }];

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
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
    }),
    prisma.listing.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildQuery = (overrides: SearchParams = {}) => {
    const q = new URLSearchParams();
    const pageVal = "page" in overrides ? overrides.page : params.page;
    const minPriceVal = "minPrice" in overrides ? overrides.minPrice : params.minPrice;
    const maxPriceVal = "maxPrice" in overrides ? overrides.maxPrice : params.maxPrice;
    const bedsVal = "beds" in overrides ? overrides.beds : params.beds;
    const cityVal = "city" in overrides ? overrides.city : params.city;
    const propertyTypeVal = "propertyType" in overrides ? overrides.propertyType : params.propertyType;
    const sortVal = "sort" in overrides ? overrides.sort : params.sort;
    if (pageVal && String(pageVal) !== "1") q.set("page", String(pageVal));
    if (minPriceVal) q.set("minPrice", String(minPriceVal));
    if (maxPriceVal) q.set("maxPrice", String(maxPriceVal));
    if (bedsVal) q.set("beds", String(bedsVal));
    if (cityVal) q.set("city", String(cityVal));
    if (propertyTypeVal) q.set("propertyType", String(propertyTypeVal));
    if (sortVal) q.set("sort", String(sortVal));
    return q.toString();
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-14">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Listings
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Toronto & GTA. Updated from the MLS.
          </p>
        </div>

        <form
          method="GET"
          className="mb-8 rounded-2xl border border-white/[0.06] bg-[var(--surface)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
        >
          <input type="hidden" name="page" value="1" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label htmlFor="city" className="block text-xs font-medium text-[var(--muted)]">City</label>
              <input id="city" name="city" type="text" defaultValue={params.city} placeholder="e.g. Toronto" className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted)]" />
            </div>
            <div>
              <label htmlFor="minPrice" className="block text-xs font-medium text-[var(--muted)]">Min price</label>
              <input id="minPrice" name="minPrice" type="number" min={0} step={10000} defaultValue={params.minPrice} placeholder="0" className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)]" />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-xs font-medium text-[var(--muted)]">Max price</label>
              <input id="maxPrice" name="maxPrice" type="number" min={0} step={10000} defaultValue={params.maxPrice} placeholder="Any" className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)]" />
            </div>
            <div>
              <label htmlFor="beds" className="block text-xs font-medium text-[var(--muted)]">Min beds</label>
              <select id="beds" name="beds" defaultValue={params.beds ?? ""} className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)]">
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="block text-xs font-medium text-[var(--muted)]">Sort by</label>
              <select id="sort" name="sort" defaultValue={params.sort ?? "updated_desc"} className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)]">
                <option value="updated_desc">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]">
              Apply
            </button>
            <Link href="/listings" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-white/5">
              Clear
            </Link>
          </div>
        </form>

        <p className="mb-6 text-sm text-[var(--muted)]">
          {total} {total === 1 ? "listing" : "listings"}
        </p>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface)] p-12 text-center text-[var(--muted)]">
            No listings match your filters.
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => {
                const slug = (listing.mlsNumber && listing.mlsNumber.trim()) || listing.id;
                const title =
                  (listing.addressLine && listing.addressLine.trim()) ||
                  (listing.propertyType && listing.propertyType.trim()) ||
                  "Listing";
                const location = [listing.city, listing.province].filter(Boolean).join(", ") || "";
                const image =
                  (listing.photoUrl && listing.photoUrl.trim()) || PLACEHOLDER_IMAGE;

                return (
                  <article key={listing.id} className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <Link href={`/listings/${encodeURIComponent(slug)}`} className="block">
                      <div className="relative aspect-4/3 w-full overflow-hidden">
                        <img src={image} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        <div className="absolute right-3 top-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                          {formatPrice(listing.price)}
                        </div>
                      </div>
                      <div className="p-5">
                        <h2 className="font-semibold text-[var(--foreground)]">{title}</h2>
                        <p className="mt-1 text-sm text-[var(--muted)]">{formatBedsBaths(listing.beds, listing.baths)}</p>
                        {location && <p className="mt-0.5 text-xs text-[var(--muted)]">{location}</p>}
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
                          View details <span aria-hidden>→</span>
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
                {page > 1 && (
                  <Link href={`/listings?${buildQuery({ page: String(page - 1) })}`} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-white/5">
                    Previous
                  </Link>
                )}
                <span className="px-4 py-2 text-sm text-[var(--muted)]">Page {page} of {totalPages}</span>
                {page < totalPages && (
                  <Link href={`/listings?${buildQuery({ page: String(page + 1) })}`} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-white/5">
                    Next
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export const metadata = {
  title: "Browse Listings | Toronto & GTA | Yorksell",
  description: "Browse MLS listings in Toronto and the GTA. Luxury real estate with clear advice and tight execution.",
};
