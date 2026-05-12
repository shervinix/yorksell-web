import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/server/db/prisma";
import { getFootprintData, getResolvedFootprintStats } from "@/lib/footprint";
import FootprintMapClient from "./FootprintMapClient";
import FootprintVolumeCounter from "./FootprintVolumeCounter";
import FadeUp from "@/app/FadeUp";

export const metadata: Metadata = {
  title: "Footprint | Yorksell",
  description:
    "Yorksell Real Estate Group's footprint across the Greater Toronto Area. Sold, purchased, and active listings.",
  openGraph: {
    title: "Our Footprint | Yorksell Real Estate Group",
    description: "Our sold, purchased, and active listings across the GTA.",
  },
};

const HERO_IMAGE =
  "https://unsplash.com/photos/UKu0b_VD5Jo/download?force=true&w=2600";

export default async function FootprintPage() {
  const data = await getFootprintData(prisma);
  const stats = getResolvedFootprintStats(data);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* Hero */}
      <header className="relative -mt-[6.5rem] min-h-[40vh] overflow-hidden pt-[6.5rem]">
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
          <h1 className="hero-enter-1 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
            Our Footprint
          </h1>
          <p className="hero-enter-2 mt-3 max-w-xl text-lg text-white/85">
            Every pin is a real transaction. Our presence across the GTA gives us pricing insight that comes from being active in these markets every day.
          </p>
        </div>
      </header>

      {/* Map + Legend */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-8">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Transactions across the GTA</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Sold, purchased, and active listings mapped across Toronto and the greater area. The breadth of markets we work in means we know where value is, where it is moving, and where it is being misread.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Legend</span>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e] ring-2 ring-white/20" aria-hidden />
                  Sold
                </span>
                <span className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6] ring-2 ring-white/20" aria-hidden />
                  Purchased
                </span>
                <span className="flex items-center gap-2 text-sm text-[var(--muted)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444] ring-2 ring-white/20" aria-hidden />
                  Active
                </span>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={150}>
            <FootprintMapClient points={data.points} showFitBounds />
          </FadeUp>
        </div>
      </section>

      {/* Total deal volume */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <FadeUp>
            <div className="mb-6">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Our performance</p>
            </div>
          </FadeUp>
          <FootprintVolumeCounter total={stats.totalVolume} />
          <FadeUp>
            <p className="mt-6 text-lg text-[var(--muted)]">Total deal volume across the GTA</p>
          </FadeUp>
        </div>
      </section>

      {/* Why coverage matters */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Why coverage matters</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Being active across multiple GTA markets changes the quality of advice we can give.
              </p>
            </div>
          </FadeUp>
          <div className="space-y-6">
            {[
              {
                title: "Pricing accuracy across markets",
                body: "When we price a property in North York, we are drawing on recent transactions in Midtown, Scarborough, and the 905. A single-neighbourhood agent prices from a narrow sample. We price from a wider one, which means fewer surprises when offers come in.",
              },
              {
                title: "Knowing where value is moving",
                body: "Markets across the GTA do not move in sync. Some areas are six months ahead of others. Because we are transacting across the region continuously, we can tell buyers where the market is going, not just where it has been.",
              },
              {
                title: "Negotiation context beyond the listing",
                body: "Sellers and buyers both make decisions based on what they think the broader market is doing. Having real, current data from across the GTA lets us frame negotiations with confidence and back our position with something more than a single comparable.",
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 80}>
                <div className="flex gap-5 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                  <div>
                    <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)] md:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                    Ready to be on the map?
                  </h2>
                  <p className="mt-3 text-[var(--muted)]">
                    Whether you are buying or selling in the GTA, we are here to help.
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
          </FadeUp>
        </div>
      </section>

    </main>
  );
}
