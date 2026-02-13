import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Yorksell",
  description:
    "Yorksell Real Estate Group — a focused team for buyers and sellers in Toronto and the GTA. Pricing, presentation, and execution you can trust.",
  openGraph: {
    title: "About | Yorksell Real Estate Group",
    description: "Toronto & GTA. A focused team for buyers and sellers. Advice you can trust.",
  },
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2600&q=80";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero — extends under the menu (same as home / listing pages) */}
      <header className="relative -mt-20 min-h-[50vh] overflow-hidden pt-20 sm:-mt-[5.5rem] sm:pt-[5.5rem]">
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
            About Yorksell
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            A focused team for buyers and sellers in Toronto and the GTA.
          </p>
        </div>
      </header>

      {/* Who we are */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                Who we are
              </h2>
              <p className="mt-5 leading-relaxed text-[var(--muted)]">
                Yorksell Real Estate Group is a Toronto-based team that helps clients buy, sell, and
                invest in property with clarity and confidence. We focus on pricing, presentation,
                and execution so you get a straightforward process and outcomes you can trust.
              </p>
              <p className="mt-5 leading-relaxed text-[var(--muted)]">
                Whether you&apos;re a first-time buyer, upsizing, downsizing, or building a portfolio,
                we bring the same discipline and communication to every transaction.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="relative aspect-[4/3] w-full">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm font-medium text-white">Yorksell Real Estate Group</p>
                  <p className="mt-0.5 text-xs text-white/70">Toronto & GTA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our approach */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
            Our approach
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            We keep the process clear and data-driven so you can make confident decisions.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Pricing</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Pricing based on current comparables and market conditions, so you know where you
                stand from day one.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Presentation</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Professional photography and marketing so your property is shown at its best to the
                right buyers.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] sm:col-span-2 lg:col-span-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Communication</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Clear updates at every step. Responsive, organized, and focused on your timeline and
                goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Toronto & GTA */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)] md:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
              Toronto & GTA
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-[var(--muted)]">
              We work across Toronto and the Greater Toronto Area — from the core to the suburbs and
              beyond. Whether you&apos;re looking downtown, in North York, Mississauga, Oakville,
              or elsewhere in the GTA, we bring the same level of service and local market knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)] md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                  Ready to work with us?
                </h2>
                <p className="mt-3 text-[var(--muted)]">
                  Tell us your timeline and goals — we&apos;ll outline next steps.
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
