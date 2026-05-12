import type { Metadata } from "next";
import Link from "next/link";
import CompassCorporateForm from "./CompassCorporateForm";

export const metadata: Metadata = {
  title: "Compass Corporate | Yorksell",
  description:
    "Yorksell Compass Corporate is a managed relocation program for HR teams. One partner handles every employee move to or from Toronto: property, legal, logistics, and settlement.",
  robots: { index: false, follow: false },
};

const PAIN_POINTS = [
  {
    title: "Relocation is expensive in HR time",
    description:
      "Coordinating a single employee move involves dozens of vendor calls, follow-ups, and approvals. Multiply that across a team and it becomes a significant operational burden on top of everything else HR is managing.",
  },
  {
    title: "No single point of accountability",
    description:
      "When movers, lawyers, banks, and landlords are all separate vendors, no one owns the outcome. Problems fall through the gaps, and HR becomes the default escalation point for issues they didn't create.",
  },
  {
    title: "Employee experience is inconsistent",
    description:
      "An employee who struggles through a difficult relocation is slower to onboard, less productive, and more likely to leave. A smooth move is an investment in retention, and one that is hard to deliver without a dedicated program.",
  },
] as const;

const WHAT_EMPLOYEES_GET = [
  {
    title: "Property",
    items: [
      "Handled directly by Yorksell agents. No referral, no handoff",
      "Neighbourhood briefing and market orientation",
      "Offer strategy and transaction management",
      "Sale of their outgoing property if needed",
    ],
  },
  {
    title: "Legal and financial",
    items: [
      "Real estate lawyers",
      "Cross-border tax specialists",
      "Mortgage brokers",
      "Canadian banking setup",
    ],
  },
  {
    title: "The physical move",
    items: [
      "Vetted movers and packers",
      "Secure storage if needed",
      "Vehicle and pet transport",
      "Specialty and high-value item handling",
    ],
  },
  {
    title: "Settlement and setup",
    items: [
      "Utilities and internet activation",
      "Security and lock installation",
      "Professional cleaning",
      "Smart home and AV setup",
    ],
  },
  {
    title: "Cross-border",
    items: [
      "Immigration lawyers and work permit support",
      "Currency exchange and planning",
      "US and Canadian banking coordination",
      "Cross-border tax planning",
    ],
  },
  {
    title: "Family and community",
    items: [
      "School placement consultants",
      "Childcare and nanny placement",
      "Community and cultural integration",
      "Spousal and partner career support introductions",
    ],
  },
] as const;

const HOW_IT_WORKS = [
  {
    title: "Program onboarding",
    description:
      "We set up your company's profile: service defaults, approval thresholds, invoicing preferences, and your designated Compass contact at Yorksell. This takes one meeting. From that point, triggering a relocation is a single call or email.",
  },
  {
    title: "Employee intake",
    description:
      "When a relocation is triggered, HR notifies us. We run a structured intake directly with the employee covering timeline, family needs, cross-border considerations, and preferences. HR is not in the middle of every detail.",
  },
  {
    title: "Full coordination",
    description:
      "We manage every vendor in the employee's plan. HR receives milestone updates at agreed intervals. The employee has one coordinator for everything. No vendor juggling, no chasing.",
  },
  {
    title: "Completion and reporting",
    description:
      "At the close of every relocation, HR receives a completion report: services delivered, timeline, any outstanding items, and costs. A clear record for every move, every time.",
  },
] as const;

const WHY_COMPASS = [
  {
    title: "We are the real estate team",
    description:
      "Your employee's property search is handled by Yorksell agents, not contracted out to a third-party agent we have never worked with before. We know the Toronto market because we work in it every day. That knowledge does not come from a briefing document.",
  },
  {
    title: "A vendor network built on real transactions",
    description:
      "Every specialist we bring in: lawyers, mortgage brokers, movers, settlement coordinators. All are people we have worked with on dozens of files. We know their standards, their capacity, and how to get things done when timelines compress. These are not referrals. They are working relationships.",
  },
  {
    title: "A dedicated contact, not a call centre",
    description:
      "Your company is assigned a named contact at Yorksell. Every relocation goes through one person who knows your program, your standards, and your employees.",
  },
  {
    title: "Cross-border expertise built in",
    description:
      "The US–Canada corridor and international moves are our core. Immigration, tax, banking, and currency are handled as part of the program, not referred out as an afterthought.",
  },
  {
    title: "Consistent employee experience",
    description:
      "Every employee, regardless of seniority or move complexity, receives the same structured intake and coordination. No one gets a better or worse relocation because of when they were hired.",
  },
  {
    title: "HR time freed up",
    description:
      "After the initial intake trigger, HR's involvement is minimal. We handle the coordination and escalations. HR sees updates, not tasks.",
  },
] as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2600&q=80";

export default function CompassCorporatePage() {
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
            <span className="inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-white/70 mb-5">
              Compass Corporate
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              Relocate your people. We handle the rest.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/85">
              Yorksell is a Toronto real estate group offering a fully managed relocation program for HR teams. We are not a coordination firm farming out to other agents. We are the agents, backed by a vendor network built over years of active transactions in this market.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#get-in-touch"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-gray-900 transition hover:bg-white/90"
              >
                Talk to us
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/40 px-6 text-sm font-medium text-white transition hover:bg-white/10"
              >
                See the program
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* The challenge */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">The challenge</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Most companies handle employee relocations reactively: one at a time, across scattered vendors, with HR in the middle of every problem.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {PAIN_POINTS.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
              >
                <h2 className="text-base font-semibold text-[var(--foreground)]">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The solution */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">The solution</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Compass replaces the scattered vendor approach with a single managed program. HR triggers the move. We run it.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                stat: "1",
                label: "Call to start a relocation",
                sub: "HR notifies Yorksell. We handle the intake, planning, and execution from there.",
              },
              {
                stat: "6",
                label: "Service categories covered",
                sub: "Property, legal, logistics, banking, cross-border, and family support: all coordinated.",
              },
              {
                stat: "30 days",
                label: "Post-move follow-through",
                sub: "We stay engaged until every service is resolved and your employee is settled.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
              >
                <p className="text-3xl font-bold tracking-tight text-[var(--foreground)]">{item.stat}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built differently */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Built differently</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Most relocation programs are a layer of coordination on top of other people&apos;s expertise. Ours is not.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)] md:p-10">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">How most firms work</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  A national relocation firm takes your brief, builds a vendor list, and manages paperwork. The agent they assign to your employee is someone they contracted. The lawyer is a referral. The movers came from a preferred vendor database. When something goes wrong, they escalate to people they do not know well, on a file they did not originate.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  Your employee is two or three handoffs away from anyone with real accountability.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">How Yorksell works</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--foreground)]">
                  When your employee needs to buy or rent in Toronto, our agents handle it. Directly. With the same market knowledge we bring to every transaction. We know which neighbourhoods fit which lifestyles, which buildings have problems, which offers win, and which lawyers close cleanly under pressure.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--foreground)]">
                  The specialists we bring in are not pulled from a vendor database: lawyers, financial planners, movers, settlement coordinators. They are people we have placed clients with dozens of times. We know how they work. We know when to push. That relationship is the difference between a smooth move and a problem at 11pm the night before closing.
                </p>
              </div>
            </div>
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
              From program setup to completion report, here is how every relocation runs.
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
            &ldquo;HR triggers the move. We run it.&rdquo;
          </p>
        </div>
      </section>

      {/* What employees get */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">What your employees get</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Six service categories, fully coordinated. Every employee in the program receives the same structured support from day one.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_EMPLOYEES_GET.map((service) => (
              <article
                key={service.title}
                className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
              >
                <h2 className="text-base font-semibold text-[var(--foreground)]">{service.title}</h2>
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

      {/* Why Compass */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Why Compass</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              What makes Compass different from patching together vendors or using a national relocation firm.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_COMPASS.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
              >
                <h2 className="text-lg font-semibold text-[var(--foreground)]">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Program structure */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Program structure</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Compass Corporate is priced per engagement, with volume arrangements available for companies with recurring relocation needs.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">

            <article className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">How pricing works</h2>
              <ul className="mt-5 space-y-4">
                {[
                  {
                    label: "Per-engagement pricing",
                    detail: "Each employee relocation is scoped and priced individually based on services required, move complexity, and corridor.",
                  },
                  {
                    label: "Volume arrangements",
                    detail: "Companies with four or more relocations per year can discuss a preferred program structure with fixed service inclusions and preferred pricing.",
                  },
                  {
                    label: "Flexible invoicing",
                    detail: "Costs can be invoiced to the company, split with the employee, or structured as a relocation allowance. We follow your HR policy.",
                  },
                  {
                    label: "Transparent scope",
                    detail: "Every engagement begins with a written service plan approved by HR. No scope creep, no surprise invoices.",
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

            <article className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">What HR gets</p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--foreground)]">Built for your team, not just your employees</h2>
              <ul className="mt-5 space-y-4">
                {[
                  {
                    label: "Named program contact",
                    detail: "One Yorksell contact for all your relocations. They know your company, your standards, and your people.",
                  },
                  {
                    label: "Milestone updates",
                    detail: "HR receives a clear update at each key stage: intake complete, services booked, move day, and settled. No chasing for status.",
                  },
                  {
                    label: "Completion reports",
                    detail: "A written close-out report for every relocation. Services delivered, timeline, and any outstanding items, ready for your records.",
                  },
                  {
                    label: "Escalation ownership",
                    detail: "If something goes wrong, we resolve it. HR is not the fallback. That is what the program is for.",
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

          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section id="get-in-touch" className="scroll-mt-24 border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
          <CompassCorporateForm />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-[var(--foreground)]">Prefer to talk it through first?</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Book a 20-minute call and we will walk you through the program in detail.</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
            >
              Book a call
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
