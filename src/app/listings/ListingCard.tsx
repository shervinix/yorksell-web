import Link from "next/link";
import type { ListingCard as ListingCardType } from "@/lib/listings";

function statusStyle(status: string | null | undefined) {
  const s = (status ?? "").toLowerCase();
  if (s === "active" || s === "a")
    return { label: "Active", className: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30" };
  if (s === "sold" || s === "u")
    return { label: "Sold", className: "bg-red-500/20 text-red-300 ring-1 ring-red-500/30" };
  if (s === "pending" || s === "conditional" || s === "p")
    return { label: "Pending", className: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30" };
  if (s === "terminated" || s === "expired" || s === "cancelled")
    return { label: status ?? "Inactive", className: "bg-white/10 text-white/50 ring-1 ring-white/10" };
  return status ? { label: status, className: "bg-white/10 text-white/50 ring-1 ring-white/10" } : null;
}

export function ListingCard({ listing }: { listing: ListingCardType }) {
  const badge = statusStyle(listing.status);

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition duration-200 hover:border-white/[0.14] hover:shadow-[0_8px_32px_rgba(0,0,0,0.32)]">
      <Link href={listing.href} className="block">
        {/* Photo */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111]">
          <img
            src={listing.image}
            alt=""
            className="h-full w-full object-cover scale-[1.03] transition duration-500 group-hover:scale-[1.07]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
          {/* Status badge */}
          {badge && (
            <span className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-xs font-semibold backdrop-blur-sm ${badge.className}`}>
              {badge.label}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Price — prominent */}
          <p className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            {listing.price}
          </p>

          {/* Address */}
          <h3 className="mt-0.5 text-sm font-medium text-[var(--foreground)] line-clamp-1">
            {listing.title}
          </h3>

          {/* Beds/baths + property type chip */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {listing.meta && (
              <p className="text-sm text-[var(--muted)]">{listing.meta}</p>
            )}
            {listing.propertyType && (
              <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-xs text-white/50">
                {listing.propertyType}
              </span>
            )}
          </div>

          {/* Location */}
          {listing.location && (
            <p className="mt-1 text-xs text-[var(--muted)]">{listing.location}</p>
          )}

          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
            View details
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
