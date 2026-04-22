import type { Metadata } from "next";
import Link from "next/link";
import BuyerForm from "./BuyerForm";

export const metadata: Metadata = {
  title: "Buy | Yorksell",
  description:
    "Buy your next home in the GTA with Yorksell Real Estate Group. Expert buyer representation, search support, and negotiation.",
  openGraph: {
    title: "Buy with Yorksell | Toronto & GTA",
    description: "Expert buyer representation. We help you find and secure the right property.",
  },
};

const HERO_IMAGE =
  "https://unsplash.com/photos/s95oB2n9jng/download?force=true&w=2600";

export default function BuyPage() {
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
            Buy with us
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            Expert buyer representation across Toronto and the GTA. We help you find the right property and navigate every step.
          </p>
          <Link
            href="#get-started"
            className="mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white/90"
          >
            Tell us what you&apos;re looking for
          </Link>
        </div>
      </header>

      {/* Buyer services */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
            How we help buyers
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">
            From first search to closing, we&apos;re with you at every step.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Search & shortlist</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                We match you with listings that fit your budget, location, and must-haves so you focus on the right properties.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Viewings & advice</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                We coordinate showings and point out what to look for; condition, value, and red flags, so you can decide with confidence.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] sm:col-span-2 lg:col-span-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Offer & closing</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                We guide you through offers, negotiations, conditions, and closing so the process stays clear and on track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)] md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                  Ready to find your next home?
                </h2>
                <p className="mt-3 text-[var(--muted)]">
                  Share your criteria below and we&apos;ll get in touch to start your search.
                </p>
              </div>
              <a
                href="#get-started"
                className="shrink-0 rounded-xl bg-[var(--accent)] px-6 py-3 text-center text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer form */}
      <section id="get-started" className="border-t border-white/[0.06] bg-[var(--surface)] scroll-mt-20">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
          <BuyerForm />
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
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
