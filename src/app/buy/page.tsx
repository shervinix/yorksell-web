import type { Metadata } from "next";
import Link from "next/link";
import BuyerForm from "./BuyerForm";
import BuyFAQ from "./BuyFAQ";
import FadeUp from "@/app/FadeUp";

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

const WHY_YORKSELL = [
  {
    title: "Market knowledge, not just listings",
    description:
      "We track pricing trends, neighbourhood shifts, and building-level details across the GTA. When you view a property, you get an honest read on value, not just enthusiasm.",
  },
  {
    title: "Negotiation is our core skill",
    description:
      "Knowing when to push, when to hold, and how to structure an offer in a competitive market is what separates a good outcome from a missed one. We've done this across hundreds of transactions.",
  },
  {
    title: "Off-market and early access",
    description:
      "Our network of active agents means we hear about properties before they hit MLS. For buyers in competitive segments, that head start matters.",
  },
  {
    title: "Available when it matters",
    description:
      "Real estate moves fast. When a property comes up or an offer needs to go in tonight, you need someone who picks up. We're reachable when it counts.",
  },
] as const;

const PROCESS_STEPS = [
  {
    title: "Initial consultation",
    description:
      "We start by understanding your timeline, budget, must-haves, and deal-breakers. This shapes everything that follows and keeps the search focused from day one.",
  },
  {
    title: "Mortgage pre-approval",
    description:
      "Before we view properties, we make sure your financing is in order. We can connect you with trusted mortgage brokers if needed. A pre-approval makes your offers stronger and your search more efficient.",
  },
  {
    title: "Curated search",
    description:
      "We filter MLS and our network for properties that genuinely fit your criteria. You see the right listings, not everything available.",
  },
  {
    title: "Viewings and honest assessment",
    description:
      "We attend every showing. Beyond the obvious, we point out what matters: building condition, layout trade-offs, neighbourhood context, and value relative to comparable sales.",
  },
  {
    title: "Offer strategy",
    description:
      "When you're ready to move, we run a comparative market analysis, discuss conditions, and build an offer strategy. We advise on price, deposit, and terms based on what we know about the seller and the market.",
  },
  {
    title: "Accepted offer and conditions",
    description:
      "Once accepted, we coordinate the inspection, liaise with your lawyer, and manage any financing or status certificate conditions. Nothing falls through the gaps.",
  },
  {
    title: "Closing day",
    description:
      "Your lawyer handles title transfer and funds. We follow up to make sure everything runs smoothly and are available if any last-minute issues arise. Then you get your keys.",
  },
] as const;

export default function BuyPage() {
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
            Buy with us
          </h1>
          <p className="hero-enter-2 mt-3 max-w-xl text-lg text-white/85">
            Expert buyer representation across Toronto and the GTA. We help you find the right property and navigate every step.
          </p>
          <Link
            href="#get-started"
            className="hero-enter-3 mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white/90"
          >
            Tell us what you&apos;re looking for
          </Link>
        </div>
      </header>

      {/* How we help buyers */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">How we help buyers</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                From first search to closing, we&apos;re with you at every step.
              </p>
            </div>
          </FadeUp>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FadeUp delay={0}>
              <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Search &amp; shortlist</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  We match you with listings that fit your budget, location, and must-haves so you focus on the right properties.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={100}>
              <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Viewings &amp; advice</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  We coordinate showings and point out what to look for: condition, value, and red flags, so you can decide with confidence.
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
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Offer &amp; closing</h3>
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
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Why buy with Yorksell</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Every agent offers search and representation. Here is what we bring that others don&apos;t.
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

      {/* The buying process */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">The buying process</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Seven steps from first conversation to keys in hand. Here is exactly what to expect.
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

      {/* First-time buyer callout */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">First-time buyers</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Buying for the first time in Ontario comes with programs and rebates worth knowing about. We walk you through all of them.
              </p>
            </div>
          </FadeUp>
          <div className="grid gap-6 lg:grid-cols-2">
            <FadeUp>
              <article className="h-full rounded-2xl border border-[var(--accent)]/20 bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">Programs available to you</p>
                <h2 className="mt-2 text-lg font-semibold text-[var(--foreground)]">Financial advantages for first-time buyers</h2>
                <ul className="mt-5 space-y-4">
                  {[
                    {
                      label: "Land Transfer Tax Rebate",
                      detail: "First-time buyers in Ontario receive a rebate of up to $4,000 on provincial land transfer tax. Toronto buyers receive an additional municipal rebate of up to $4,475, for a combined saving of up to $8,475.",
                    },
                    {
                      label: "First Home Savings Account (FHSA)",
                      detail: "Contribute up to $8,000 per year (lifetime limit $40,000) in a tax-deductible, tax-free account specifically for your first home purchase.",
                    },
                    {
                      label: "Home Buyers' Plan (HBP)",
                      detail: "Withdraw up to $35,000 from your RRSP tax-free to put toward your down payment. Repayable over 15 years.",
                    },
                    {
                      label: "First Home Buyer Incentive",
                      detail: "A shared-equity program where the government contributes 5–10% toward your purchase to lower your monthly mortgage payments.",
                    },
                  ].map((item) => (
                    <li key={item.label} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                        <p className="mt-0.5 text-sm text-[var(--muted)]">{item.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </FadeUp>
            <FadeUp delay={150}>
              <article className="h-full rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">What to expect</p>
                <h2 className="mt-2 text-lg font-semibold text-[var(--foreground)]">We take the guesswork out of it</h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  Buying your first home is one of the biggest financial decisions you will make. The process has more moving parts than most people expect: mortgage approval, offer strategy, conditions, lawyers, closing costs. The stakes are high.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  We spend extra time with first-time buyers to make sure every step is explained clearly before it happens. You won&apos;t feel rushed, pressured, or lost in the paperwork. We have done this enough times to know where first-timers get tripped up, and we make sure you don&apos;t.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  We will also make sure you are claiming every rebate and incentive you are entitled to. Most first-time buyers leave money on the table simply because nobody told them it existed.
                </p>
                <Link
                  href="#get-started"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  Start the conversation
                  <span aria-hidden>→</span>
                </Link>
              </article>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Common questions</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Answers to what buyers ask us most before their first call.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <BuyFAQ />
          </FadeUp>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
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
          </FadeUp>
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
