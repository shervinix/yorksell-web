import { Suspense } from "react";
import ListingsSearchPage from "./ListingsSearchPage";

function ListingsFallback() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-14">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            MLS Search
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Toronto & GTA. Loading…
          </p>
        </div>
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-white/[0.06] bg-[var(--surface)]">
          <p className="text-[var(--muted)]">Loading search…</p>
        </div>
      </div>
    </main>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingsFallback />}>
      <ListingsSearchPage />
    </Suspense>
  );
}

export const metadata = {
  title: "Browse Listings | Toronto & GTA | Yorksell",
  description:
    "Browse MLS listings in Toronto and the GTA. Search by address, city, neighbourhood, or MLS#. Luxury real estate with clear advice and tight execution.",
};
