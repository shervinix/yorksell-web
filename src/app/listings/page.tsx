import { Suspense } from "react";
import ListingsSearchPage from "./ListingsSearchPage";
import { getFeaturedListings } from "@/lib/get-featured-listings";

export const metadata = {
  title: "Listings | Yorksell Real Estate Group",
  description:
    "Listings by Yorksell Real Estate Group & ROYAL LEPAGE REAL ESTATE SERVICES LTD. Toronto & GTA. Search by address, city, neighbourhood, or MLS#.",
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2600&q=80";

function ListingsFallback() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="relative -mt-[6.5rem] min-h-[36vh] overflow-hidden pt-[6.5rem]">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" loading="eager" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-1 flex-col justify-end px-4 pb-12 pt-4 sm:px-6 md:pb-16 md:pt-6">
          <h1 className="hero-enter-1 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">Listings</h1>
          <p className="hero-enter-2 mt-3 max-w-xl text-lg text-white/85">Active, sold, and featured listings across Toronto and the GTA.</p>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-white/[0.06] bg-[var(--surface)]">
          <p className="text-[var(--muted)]">Loading…</p>
        </div>
      </div>
    </main>
  );
}

export default async function ListingsPage() {
  const featured = await getFeaturedListings();

  return (
    <Suspense fallback={<ListingsFallback />}>
      <ListingsSearchPage initialFeatured={featured} />
    </Suspense>
  );
}
