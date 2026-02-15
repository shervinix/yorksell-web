import Link from "next/link";
import type { ListingListItem } from "@/app/api/listings/route";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80";

function formatPrice(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
    return "Contact";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatBedsBaths(
  beds: number | null | undefined,
  baths: number | null | undefined
) {
  const parts: string[] = [];
  if (typeof beds === "number" && Number.isFinite(beds))
    parts.push(`${beds} Bed`);
  if (typeof baths === "number" && Number.isFinite(baths))
    parts.push(`${baths} Bath`);
  return parts.length ? parts.join(" • ") : "";
}

function ListingCard({ listing }: { listing: ListingListItem }) {
  const title =
    (listing.addressLine && listing.addressLine.trim()) ||
    (listing.propertyType && listing.propertyType.trim()) ||
    "Listing";
  const location = [listing.city, listing.province]
    .filter(Boolean)
    .join(", ") || "";
  const image =
    (listing.photoUrl && listing.photoUrl.trim()) || PLACEHOLDER_IMAGE;

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <Link href={listing.url} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute right-3 top-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            {formatPrice(listing.price)}
          </div>
        </div>
        <div className="p-5">
          <h2 className="font-semibold text-[var(--foreground)]">{title}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {formatBedsBaths(listing.beds, listing.baths)}
          </p>
          {location && (
            <p className="mt-0.5 text-xs text-[var(--muted)]">{location}</p>
          )}
          {listing.status && (
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
              {listing.status}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
            View details <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

async function getOurListings(): Promise<{
  active: ListingListItem[];
  sold: ListingListItem[];
}> {
  const base =
    process.env.NEXTAUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const res = await fetch(`${base}/api/listings/ours`, {
    cache: "no-store",
  });
  if (!res.ok) return { active: [], sold: [] };
  const data = await res.json();
  return {
    active: Array.isArray(data.active) ? data.active : [],
    sold: Array.isArray(data.sold) ? data.sold : [],
  };
}

export default async function OurListingsPage() {
  const { active, sold } = await getOurListings();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-14">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Our Listings
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Current listings and recently sold properties by Yorksell Real Estate Group.
          </p>
          <Link
            href="/listings"
            className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
          >
            ← Back to MLS search
          </Link>
        </div>

        <section className="mb-14">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            Current listings
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Properties currently listed with us.
          </p>
          {active.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-[var(--surface)] p-12 text-center text-[var(--muted)]">
              No active listings at the moment. Check back soon or browse all{" "}
              <Link href="/listings" className="text-[var(--accent)] hover:underline">
                MLS listings
              </Link>
              .
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {active.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            Recently sold
          </h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Properties we&apos;ve recently sold.
          </p>
          {sold.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-[var(--surface)] p-12 text-center text-[var(--muted)]">
              No recently sold listings to show.
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sold.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Our Listings | Yorksell Real Estate Group",
  description:
    "Current listings and recently sold properties by Yorksell Real Estate Group. Toronto & GTA.",
};
