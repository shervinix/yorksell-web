import type { Metadata } from "next";
import Link from "next/link";
import SellerForm from "./SellerForm";
import SellFAQ from "./SellFAQ";
import FadeUp from "@/app/FadeUp";

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
  "https://unsplash.com/photos/cspdkWwJuoU/download?force=true&w=2600";

const WHY_YORKSELL = [
  {
    title: "Pricing that holds up",
    description:
      "Overpricing kills momentum. We run a rigorous comparable analysis and give you a number that attracts real buyers, not one designed to win the listing.",
  },
  {
    title: "Presentation that earns its cost",
    description:
      "We advise on exactly what prep is worth doing before you list. Professional photography, staging guidance, and a clean MLS presentation are standard on every property we sell.",
  },
  {
    title: "Offer strategy, not just offer night",
    description:
      "Whether we hold back offers or price for immediate action depends on your property and the current market. We build the strategy before you list, not the day offers come in.",
  },
  {
    title: "Negotiation when it counts",
    description:
      "Getting an offer is one thing. Getting the best terms on conditions, deposit, and closing date is another. We have negotiated across hundreds of transactions and know where sellers give up value unnecessarily.",
  },
] as const;

const PROCESS_STEPS = [
  {
    title: "Seller consultation",
    description:
      "We start by understanding your timeline, goals, and any constraints. This shapes the strategy for everything that follows.",
  },
  {
    title: "Pricing and market analysis",
    description:
      "We pull comparable sales, review active competition, and set a price that positions your property correctly. You get a clear rationale, not just a number.",
  },
  {
    title: "Prep and presentation",
    description:
      "We walk through the property and advise on what to fix, stage, or remove. Professional photography is booked and the listing is prepared for MLS and digital marketing.",
  },
  {
    title: "Launch and showings",
    description:
      "Your property goes live across MLS and relevant platforms. We coordinate all showings, manage access, and follow up with every agent who views the property.",
  },
  {
    title: "Offer strategy and review",
    description:
      "We advise on holdback vs. immediate review based on activity and market conditions. On offer night, we walk you through every bid and give you our recommendation.",
  },
  {
    title: "Conditional period",
    description:
      "Once an offer is accepted, we manage the conditional period: home inspection coordination, status certificate requests if applicable, and any follow-up negotiations.",
  },
  {
    title: "Closing",
    description:
      "Your lawyer handles the title transfer and funds. We stay available through closing day and make sure nothing slips through the gaps at the finish line.",
  },
] as const;

const INCLUDED = [
  "Comparative market analysis",
  "Pre-listing walkthrough and prep advice",
  "Professional photography",
  "MLS listing and syndication",
  "Digital and social media marketing",
  "Showing coordination and lockbox management",
  "Agent follow-up after every showing",
  "Offer night management",
  "Conditional period coordination",
  "Closing support",
] as const;

export default function SellPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* Hero */}
      <header className="relative -mt-[6.5rem] min-h-[45vh] overflow-hidden pt-[6.5rem]">
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
            Sell with us
          </h1>
          <p className="hero-enter-2 mt-3 max-w-xl text-lg text-white/85">
            Expert seller representation across Toronto and the GTA. We help you price right, market well, and close with confidence.
          </p>
          <Link
            href="#get-started"
            className="hero-enter-3 mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white/90"
          >
            What&apos;s my property worth?
          </Link>
        </div>
      </header>

      {/* How we help sellers */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">How we help sellers</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                From valuation to closing, we are with you at every step.
              </p>
            </div>
          </FadeUp>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FadeUp delay={0}>
              <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Pricing &amp; valuation</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  We use current comparables and market data to help you price your property so it sells without leaving money on the table.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={100}>
              <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Marketing &amp; presentation</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  Professional photography and marketing so your property stands out and reaches the right buyers.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={200}>
              <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] sm:col-span-2 lg:col-span-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Offers &amp; closing</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  We guide you through offers, negotiations, conditions, and closing so the process stays clear and on track.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Why Yorksell */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Why sell with Yorksell</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Every agent offers to list your property. Here is what we bring that others don&apos;t.
              </p>
            </div>
          </FadeUp>
          <div className="grid gap-6 sm:grid-cols-2">
            {WHY_YORKSELL.map((item, i) => (
              <FadeUp key={item.title} delay={i * 80} className="h-full">
                <article className="h-full rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">{item.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* The selling process */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">The selling process</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Seven steps from first conversation to sold. Here is exactly what to expect.
              </p>
            </div>
          </FadeUp>
          <ol className="space-y-4">
            {PROCESS_STEPS.map((step, index) => (
              <FadeUp key={step.title} delay={index * 60}>
                <li className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-[var(--foreground)]">{step.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.description}</p>
                    </div>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ol>
        </div>
      </section>

      {/* What your sale includes */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">What your sale includes</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Everything covered from the moment you list to the day you close.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <ul className="grid gap-x-12 gap-y-4 sm:grid-cols-2">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)]" aria-hidden>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-sm text-[var(--foreground)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Seller FAQ */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Common questions</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Answers to what sellers ask us most before their first call.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <SellFAQ />
          </FadeUp>
        </div>
      </section>

      {/* Seller form */}
      <section id="get-started" className="border-t border-white/[0.06] bg-[var(--surface)] scroll-mt-20">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-8">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Get in touch</p>
              <p className="mt-3 text-[var(--muted)]">
                Tell us about your property and we&apos;ll take it from there. No obligation.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <SellerForm />
          </FadeUp>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[var(--muted)]">
              Prefer to talk first? Call us or{" "}
              <Link href="/contact" className="font-medium text-[var(--accent)] hover:underline">
                send a message
              </Link>.
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
