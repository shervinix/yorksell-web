import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/server/db/prisma";
import { getFootprintData, getResolvedFootprintStats } from "@/lib/footprint";
import FootprintMapClient from "./FootprintMapClient";

export const metadata: Metadata = {
  title: "Footprint | Yorksell",
  description:
    "Yorksell Real Estate Group's footprint across the Greater Toronto Area — sold, purchased, and active listings.",
  openGraph: {
    title: "Our Footprint | Yorksell Real Estate Group",
    description: "Our sold, purchased, and active listings across the GTA.",
  },
};

const HERO_IMAGE =
  "https://unsplash.com/photos/UKu0b_VD5Jo/download?force=true&w=2600";

function formatVolume(value: number) {
  if (value >= 1_000_000) {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(value / 1_000_000).replace(/\.0$/, "") + "M";
  }
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function FootprintPage() {
  const data = await getFootprintData(prisma);
  const stats = getResolvedFootprintStats(data);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <header className="relative -mt-20 min-h-[40vh] overflow-hidden pt-20 sm:-mt-[5.5rem] sm:pt-[5.5rem]">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-1 flex-col justify-end px-4 pb-12 pt-4 sm:px-6 md:pb-16 md:pt-6">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
            Our Footprint
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            Yorksell Real Estate Group&apos;s presence across the Greater Toronto Area — every sale, purchase, and active listing.
          </p>
        </div>
      </header>

      {/* Map + Legend */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-6 flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="text-sm font-medium text-[var(--muted)]">Legend</span>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <span className="h-3 w-3 rounded-full bg-[#22c55e] ring-2 ring-white/20" aria-hidden />
                Sold
              </span>
              <span className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <span className="h-3 w-3 rounded-full bg-[#3b82f6] ring-2 ring-white/20" aria-hidden />
                Purchased
              </span>
              <span className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <span className="h-3 w-3 rounded-full bg-[#ef4444] ring-2 ring-white/20" aria-hidden />
                Active
              </span>
            </div>
          </div>
          <FootprintMapClient points={data.points} showFitBounds />
        </div>
      </section>

      {/* Performance stats */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            Our performance
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">
            A snapshot of our activity across the GTA. Data reflects the sample points on the map — update with your real transactions.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <p className="text-sm font-medium text-[var(--muted)]">Sold (listings)</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--foreground)] md:text-3xl">
                {stats.soldCount}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {formatVolume(stats.soldVolume)} volume
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <p className="text-sm font-medium text-[var(--muted)]">Purchased (buyer rep)</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--foreground)] md:text-3xl">
                {stats.purchasedCount}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {formatVolume(stats.purchasedVolume)} volume
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <p className="text-sm font-medium text-[var(--muted)]">Active listings</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--foreground)] md:text-3xl">
                {stats.activeCount}
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <p className="text-sm font-medium text-[var(--muted)]">Total closed volume</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--foreground)] md:text-3xl">
                {formatVolume(stats.totalVolume)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)] md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                  Ready to be on the map?
                </h2>
                <p className="mt-3 text-[var(--muted)]">
                  Whether you&apos;re buying or selling in the GTA, we&apos;re here to help.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
                >
                  Contact us
                </Link>
                <Link
                  href="/listings"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 px-6 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                >
                  View listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
