import type { Metadata } from "next";
import Link from "next/link";
import CompassIntakeForm from "./CompassIntakeForm";

export const metadata: Metadata = {
  title: "Compass | Yorksell",
  description:
    "Yorksell Compass is a full-service relocation program connecting Toronto to key markets for clients moving in and out of the city.",
  openGraph: {
    title: "Yorksell Compass | Relocation Program",
    description:
      "A full-service relocation program connecting Toronto to the markets that matter most with one point of contact.",
  },
};

const WHO_ITS_FOR = [
  {
    label: "Arriving from the US",
    copy:
      "Professionals relocating to Toronto from New York, San Francisco, Chicago, Los Angeles, Miami, or Boston. You know how to buy real estate — we translate the Toronto market so your instincts apply from day one.",
  },
  {
    label: "Arriving internationally",
    copy:
      "Buyers from the UAE, India, the UK, Hong Kong, and beyond navigating the Canadian market for the first time. We handle the complexity — regulatory, logistical, and personal — so nothing falls through.",
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
    title: "The physical move",
    items: ["Movers and packers", "Secure storage", "Vehicle and pet transport", "Specialty and high-value handling"],
  },
  {
    title: "Legal and financial",
    items: ["Real estate lawyers", "Mortgage brokers", "Financial planners", "Estate and will review"],
  },
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
    title: "Home setup",
    items: ["Professional cleaning and trades", "Security and lock installation", "Utilities activation", "Smart home setup"],
  },
  {
    title: "Lifestyle and wellness",
    items: [
      "Interior design and home organization",
      "Healthcare connections including family doctors",
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
    title: "Intake and scope",
    description:
      "We start with a structured needs assessment — your timeline, requirements, cross-border considerations, and family needs. The output is a custom service plan built around your move.",
  },
  {
    title: "Custom service plan",
    description:
      "Yorksell builds a tailored plan specifying which services are needed, which partners are assigned, and how it sequences around your move date. You review and confirm before anything is booked.",
  },
  {
    title: "Coordinated booking",
    description:
      "Yorksell books and confirms all services on your behalf. You do not need to contact any vendor directly. All scheduling is coordinated around your timeline.",
  },
  {
    title: "Single-point oversight",
    description:
      "Yorksell is the single point of contact for every provider in your plan. Status updates come from us — consolidated, clear, and on schedule.",
  },
  {
    title: "Post-move follow-through",
    description:
      "Within 30 days of completion, we follow up on every service. If something needs to be resolved, we resolve it. The engagement does not end at key handover.",
  },
] as const;

export default function CompassPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl lg:text-6xl">
              Both directions. One team.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
              Yorksell Compass is a full-service relocation program connecting Toronto to the markets that matter most — managing
              every detail of the move for clients arriving in the city and leaving it.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#start-your-move"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
              >
                Start your move
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 px-6 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/5"
              >
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Who it&apos;s for</p>
          <p className="mt-3 max-w-3xl text-[var(--muted)]">
            Yorksell Compass serves four types of clients. Every engagement is fully managed — one point of contact, no hand-offs.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
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

      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted)]">What&apos;s included</p>
          <p className="mt-3 max-w-3xl text-[var(--muted)]">
            Every service is booked and managed by Yorksell on your behalf. You have one contact. We handle the rest.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      <section id="how-it-works" className="scroll-mt-24 border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted)]">How it works</p>
          <p className="mt-3 max-w-3xl text-[var(--muted)]">
            Every Compass engagement follows the same five steps, scaled to the complexity of your move.
          </p>
          <ol className="mt-8 space-y-4">
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
        </div>
      </section>

      <section id="start-your-move" className="scroll-mt-24 border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
          <CompassIntakeForm />
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-lg font-medium text-[var(--foreground)]">Not sure where to start?</p>
            <Link
              href="#"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
            >
              Book a 15-minute call
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
