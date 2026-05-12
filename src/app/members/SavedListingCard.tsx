"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type SavedListing = {
  id: string;
  href: string;
  title: string;
  price: string;
  meta: string;
  location: string;
  image: string;
};

export function SavedListingCard({ listing }: { listing: SavedListing }) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const [removed, setRemoved] = useState(false);

  async function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (removing) return;
    setRemoving(true);
    try {
      await fetch(`/api/members/saved-listings?listingId=${listing.id}`, {
        method: "DELETE",
      });
      setRemoved(true);
      router.refresh();
    } catch {
      setRemoving(false);
    }
  }

  if (removed) return null;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition hover:border-white/[0.10] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      {/* Remove button */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={removing}
        aria-label="Remove from saved"
        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/70 backdrop-blur transition hover:bg-black/80 hover:text-white disabled:opacity-40"
      >
        {removing ? (
          <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </button>

      <Link href={listing.href} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111]">
          <img
            src={listing.image}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="p-4">
          <p className="text-lg font-semibold text-[var(--foreground)]">{listing.price}</p>
          <h3 className="mt-0.5 font-medium text-[var(--foreground)] line-clamp-1">{listing.title}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{listing.meta}</p>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{listing.location}</p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
            View details
            <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
