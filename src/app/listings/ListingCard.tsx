import Link from "next/link";
import type { ListingCard as ListingCardType } from "@/lib/listings";

export function ListingCard({ listing }: { listing: ListingCardType }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <Link href={listing.href} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={listing.image}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute right-3 top-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            {listing.price}
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-[var(--foreground)]">{listing.title}</h3>
          {listing.meta && (
            <p className="mt-1 text-sm text-[var(--muted)]">{listing.meta}</p>
          )}
          {listing.location && (
            <p className="mt-0.5 text-xs text-[var(--muted)]">{listing.location}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
            View details <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
