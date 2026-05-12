import type { Metadata } from "next";
import Link from "next/link";
import CompassIntakeForm from "./CompassIntakeForm";

export const metadata: Metadata = {
  title: "Compass | Yorksell",
  description:
    "Yorksell Compass is a full-service relocation program, managing every detail of your move, whether you're arriving in Toronto or leaving it.",
  openGraph: {
    title: "Yorksell Compass | Relocation Program",
    description:
      "Your entire move. One point of contact. Yorksell Compass handles everything: from movers and lawyers to schools and banking.",
  },
};

const WHO_ITS_FOR = [
  {
    label: "Arriving from the US",
    copy:
      "Professionals relocating to Toronto from New York, San Francisco, Chicago, Los Angeles, Miami, or Boston. We map your US market knowledge to Toronto: pricing, process, and neighbourhoods, so you buy with confidence from day one.",
  },
  {
    label: "Arriving internationally",
    copy:
      "Buyers from the UAE, India, the UK, Hong Kong, and beyond navigating the Canadian market for the first time. We handle immigration, banking, taxes, and logistics, so you focus on the move, not the paperwork.",
  },
  {
    label: "Arriving from another Canadian city",
    copy:
      "Inter-city movers from Vancouver, Calgary, or Montreal who know real estate but need honest context on a new market. We map your standards to the right Toronto address.",
  },
  {
    label: "Leaving Toronto",
    copy:
      "Toronto residents relocating to major US cities or international markets. We manage the sale of your Toronto property and connect you with trusted agents at your destination. Both sides of the move, handled.",
  },
] as const;

const SERVICES = [
  {
    title: "Cross-border",
    badge: "US–Canada corridor",
    items: [
      "Immigration lawyers",
      "Cross-border tax specialists",
      "Currency exchange and planning",
      "US and Canadian banking setup",
    ],
  },
  {
    title: "The physical move",
    items: ["Movers and packers", "Secure storage", "Vehicle and pet transport", "Specialty and high-value handling"],
  },
  {
    title: "Legal and financial",
    items: ["Real estate lawyers", "Mortgage brokers", "Financial planners", "Estate and will review"],
  },
  {
    title: "Home setup",
    items: ["Professional cleaning and trades", "Security and lock installation", "Utilities activation", "Smart home setup"],
  },
  {
    title: "Lifestyle and wellness",
    items: [
      "Interior design and home organization",
      "Private concierge and local service setup",
      "Fitness and wellness referrals",
      "Local orientation and access",
    ],
  },
  {
    title: "Family and community",
    items: [
      "School placement consultants",
      "Childcare and nanny placement",
      "Community and cultural integration",
      "Professional network introductions",
    ],
  },
] as const;

const HOW_IT_WORKS = [
  {
    title: "Intake and custom plan",
    description:
      "We start with a structured needs assessment covering your timeline, requirements, cross-border considerations, and family needs. The output is a tailored service plan specifying which services are needed, which partners are assigned, and how everything sequences around your move date. You review and confirm before anything is booked.",
  },
  {
    title: "Coordinated booking",
    description:
      "Yorksell books and confirms all services on your behalf. You do not need to contact any vendor directly. All scheduling is coordinated around your timeline.",
  },
  {
    title: "Single-point oversight",
    description:
      "Yorksell is the single point of contact for every provider in your plan. Status updates come from us: consolidated, clear, and on schedule.",
  },
  {
    title: "Post-move follow-through",
    description:
      "Within 30 days of completion, we follow up on every service. If something needs to be resolved, we resolve it. The engagement does not end at key handover.",
  },
] as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2600&q=80";

export default function CompassPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <header className="relative -mt-[6.5rem] min-h-[65vh] overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-[6.5rem] pb-16 sm:px-6 md:pb-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              Relocation, handled end-to-end.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/85">
              Yorksell Compass manages every detail of your move, whether you&apos;re arriving in Toronto or leaving it.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#start-your-move"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-gray-900 transition hover:bg-white/90"
              >
                Start your move
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/40 px-6 text-sm font-medium text-white transition hover:bg-white/10"
              >
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Who it's for */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Who it&apos;s for</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Whether you&apos;re crossing an ocean or a border, Compass is built for the complexity of your move.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {WHO_ITS_FOR.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
              >
                <h2 className="text-lg font-semibold text-[var(--foreground)]">{item.label}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">How it works</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Every Compass engagement follows the same four steps, scaled to the complexity of your move.
            </p>
          </div>
          <ol className="space-y-4">
            {HOW_IT_WORKS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">{step.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-center text-base font-semibold italic text-[var(--foreground)]">
            &ldquo;The engagement doesn&apos;t end at key handover.&rdquo;
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">What&apos;s included</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Six categories. Every service coordinated by us, from movers and mortgage brokers to school placement and banking setup.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">{service.title}</h2>
                  {service.badge ? (
                    <span className="rounded-full border border-white/[0.12] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
                      {service.badge}
                    </span>
                  ) : null}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  {service.items.map((entry) => (
                    <li key={entry} className="flex gap-2">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                      <span>{entry}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Intake form */}
      <section id="start-your-move" className="scroll-mt-24 border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
          <CompassIntakeForm />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-[var(--foreground)]">Every Compass engagement starts with a conversation.</p>
              <p className="mt-1 text-sm text-[var(--muted)]">No obligation. Just clarity on what your move involves.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
            >
              Book a 15-minute call
            </Link>
          </div>
        </div>
      </section>

      {/* Subtle partner / corporate links */}
      <div className="border-t border-white/[0.04] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-xs text-white/25">Also on Compass</span>
            <Link href="/compass/partners" className="text-xs text-white/35 transition hover:text-white/60">
              Agent &amp; Partner Program
            </Link>
            <span className="h-3 w-px bg-white/[0.1]" aria-hidden />
            <Link href="/compass/corporate" className="text-xs text-white/35 transition hover:text-white/60">
              Corporate Relocation
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
