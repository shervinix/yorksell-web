import type { Metadata } from "next";
import Link from "next/link";
import ValuationForm from "./ValuationForm";
import ListWithUsForm from "./ListWithUsForm";

export const metadata: Metadata = {
  title: "Sell | Yorksell",
  description:
    "Sell your property in the GTA with Yorksell Real Estate Group. Pricing, marketing, and expert representation.",
  openGraph: {
    title: "Sell with Yorksell | Toronto & GTA",
    description: "Expert seller representation. Get a free valuation and list with confidence.",
  },
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2600&q=80";

export default function SellPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <header className="relative -mt-20 min-h-[45vh] overflow-hidden pt-20 sm:-mt-[5.5rem] sm:pt-[5.5rem]">
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
            Sell with us
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            Expert seller representation across Toronto and the GTA. We help you price right, market well, and close with confidence.
          </p>
          <Link
            href="#whats-my-worth"
            className="mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white/90"
          >
            What&apos;s my property worth?
          </Link>
        </div>
      </header>

      {/* Seller services */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
            How we help sellers
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">
            From valuation to closing, we&apos;re with you at every step.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Pricing & valuation</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                We use current comparables and market data to help you price your property so it sells without leaving money on the table.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Marketing & presentation</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Professional photography and marketing so your property stands out and reaches the right buyers.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] sm:col-span-2 lg:col-span-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Offers & closing</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                We guide you through offers, negotiations, conditions, and closing so the process stays clear and on track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What's my property worth */}
      <section id="whats-my-worth" className="border-t border-white/[0.06] bg-[var(--background)] scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)] md:p-10">
            <div className="mx-auto max-w-xl">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                What&apos;s my property worth?
              </h2>
              <p className="mt-3 text-[var(--muted)]">
                Share your property details and we&apos;ll prepare a free valuation based on current market data and comparable sales. No obligation.
              </p>
              <div className="mt-8">
                <ValuationForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)] md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                  Ready to list?
                </h2>
                <p className="mt-3 text-[var(--muted)]">
                  Tell us about your property below and we&apos;ll get in touch to discuss next steps.
                </p>
              </div>
              <a
                href="#list-with-us"
                className="shrink-0 rounded-xl bg-[var(--accent)] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
              >
                List with us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* List with us form */}
      <section id="list-with-us" className="border-t border-white/[0.06] bg-[var(--background)] scroll-mt-20">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
          <ListWithUsForm />
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[var(--muted)]">
              Prefer to talk first? Call us or <Link href="/contact" className="font-medium text-[var(--accent)] hover:underline">send a message</Link>.
            </p>
            <Link
              href="/listings"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
            >
              Browse listings
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
