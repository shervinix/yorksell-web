import type { Metadata } from "next";
import Link from "next/link";
import CompassPartnerForm from "./CompassPartnerForm";

export const metadata: Metadata = {
  title: "Compass Partner Program | Yorksell",
  description:
    "Partner with Yorksell Compass and earn referral fees on every completed relocation. Built for agents outside Ontario referring clients moving to or from Toronto.",
  robots: { index: false, follow: false },
};

const WHY_PARTNER = [
  {
    title: "Your client is covered",
    description:
      "Every referred client gets a dedicated Compass coordinator managing their entire move: property, legal, physical logistics, banking, and settlement. You make the introduction. We take it from there.",
  },
  {
    title: "You stay the expert",
    description:
      "You remain your client's trusted agent in your market. We handle Toronto. The relationship stays yours and we just make you look good.",
  },
  {
    title: "A fee on every close",
    description:
      "You earn a referral fee on every completed transaction. Agreed in writing before we begin, paid directly to you or your brokerage on close.",
  },
  {
    title: "No added workload",
    description:
      "One email or phone call is all it takes. We handle the onboarding, coordination, and updates. You get a confirmation when it closes.",
  },
] as const;

const HOW_IT_WORKS = [
  {
    title: "Make the introduction",
    description:
      "Connect us with your client via email or a quick call. We take it from there with a structured intake to understand their timeline, needs, and budget.",
  },
  {
    title: "We coordinate everything",
    description:
      "A dedicated Compass coordinator manages every service: property search or sale, legal, physical move, banking, and full settlement. Your client has one point of contact throughout.",
  },
  {
    title: "You earn on close",
    description:
      "Your referral fee is confirmed in writing before we begin. On successful close, payment goes directly to you or your brokerage, however your compliance requires it.",
  },
] as const;

const WHO_TO_REFER = [
  {
    label: "US clients relocating to Toronto",
    description:
      "Buyers from New York, San Francisco, Miami, or elsewhere in the US moving to Toronto for work or lifestyle. They need an agent and full relocation support from day one.",
  },
  {
    label: "International buyers",
    description:
      "Clients from the UAE, India, the UK, Hong Kong, and beyond purchasing in Toronto for the first time. Cross-border banking, tax, and legal complexity is our specialty.",
  },
  {
    label: "Toronto clients heading your way",
    description:
      "Toronto residents leaving for your market. We manage their sale here and hand them to you as a warm referral at their destination. Both sides of the move, handled.",
  },
  {
    label: "Corporate relocations",
    description:
      "Employees being relocated to Toronto by their employer who need a full-service partner from arrival. These clients often have compressed timelines and premium budgets.",
  },
] as const;

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2600&q=80";

export default function CompassPartnersPage() {
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
              Compass Partner Program
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              Refer once. Earn on the full move.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/85">
              Yorksell Compass is Toronto&apos;s end-to-end relocation program. Partner with us and earn a referral fee every time a client moves to or from the city.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="#become-a-partner"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-gray-900 transition hover:bg-white/90"
              >
                Become a partner
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

      {/* The program in brief */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">The program</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Compass is Yorksell&apos;s full-service relocation program for clients moving to or from Toronto. One coordinator manages every provider from property to legal to logistics.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                stat: "6",
                label: "Service categories",
                sub: "Real estate, legal, moving, banking, family, and lifestyle: all coordinated.",
              },
              {
                stat: "1",
                label: "Point of contact",
                sub: "A single Compass coordinator manages every vendor on your client's behalf.",
              },
              {
                stat: "30 days",
                label: "Post-move follow-through",
                sub: "We stay engaged until every service is resolved, not just until key handover.",
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

      {/* Why partner */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Why partner</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Built for agents who want to add real value for relocating clients without taking on extra work.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {WHY_PARTNER.map((item) => (
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

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">How it works</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Three steps from introduction to payday.
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
        </div>
      </section>

      {/* Referral fees */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Referral fees</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              The financial upside of every client you refer.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">

            {/* How fees work */}
            <article className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">How fees work</h2>
              <ul className="mt-5 space-y-4">
                {[
                  {
                    label: "Paid on close",
                    detail: "Referral fees are paid after successful transaction completion. No close, no obligation on either side.",
                  },
                  {
                    label: "Confirmed in writing",
                    detail: "Your fee is agreed and documented before we begin working with your client. No surprises.",
                  },
                  {
                    label: "Competitive structure",
                    detail: "Fees are competitive with industry-standard referral arrangements. The exact structure reflects the transaction type and complexity.",
                  },
                  {
                    label: "Paid to you or your brokerage",
                    detail: "Payment goes wherever your compliance requires, directly to you or through your brokerage.",
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

            {/* Illustrative example */}
            <article className="rounded-2xl border border-[var(--accent)]/20 bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">Illustrative example</p>
              <h2 className="mt-2 text-lg font-semibold text-[var(--foreground)]">What a single referral can look like</h2>
              <div className="mt-5 space-y-3">
                <div className="flex justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-sm text-[var(--muted)]">Toronto purchase price</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">$1,500,000</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-sm text-[var(--muted)]">Buy-side commission (2.5%)</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">$37,500</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-sm text-[var(--muted)]">Referral fee (25% of commission)</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">$9,375</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-sm font-semibold text-[var(--foreground)]">You earn</span>
                  <span className="text-2xl font-bold text-[var(--accent)]">$9,375</span>
                </div>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
                Illustrative only. Actual fees depend on transaction structure and are confirmed in writing before commencement. Figures above do not include applicable taxes or brokerage splits.
              </p>
            </article>

          </div>
        </div>
      </section>

      {/* Inbound referrals */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Referrals coming your way</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              The program works in both directions. When a Compass client is heading to your market, we send them to you.
            </p>
          </div>

          {/* Concept callout */}
          <div className="mb-8 rounded-2xl border border-[var(--accent)]/20 bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
              <div className="flex-1">
                <p className="text-lg font-semibold text-[var(--foreground)]">A two-way referral relationship.</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  Every Compass client moving out of Toronto or through our network to another city needs a trusted agent at their destination. As a program partner, you are who we call. These are warm, pre-qualified leads already committed to their move, not cold inquiries.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                  When you close a referred client, Yorksell receives a referral fee from your side of the transaction. The structure mirrors what we pay you: agreed in writing, paid on close.
                </p>
              </div>
              <div className="shrink-0 md:w-56">
                <div className="rounded-xl border border-white/[0.08] bg-[var(--surface)] p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">The flow</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="rounded-lg bg-[var(--surface-elevated)] px-3 py-2 text-[var(--foreground)]">Compass client</div>
                    <div className="text-[var(--muted)]">↓ moving to your market</div>
                    <div className="rounded-lg bg-[var(--surface-elevated)] px-3 py-2 text-[var(--foreground)]">We refer to you</div>
                    <div className="text-[var(--muted)]">↓ you close the deal</div>
                    <div className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-2 font-semibold text-[var(--foreground)]">Referral fee to Yorksell</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Who we refer to you */}
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                label: "Toronto residents relocating out",
                description:
                  "Clients selling their Toronto property and moving to your city. They arrive as a warm referral with their finances in order and a move date confirmed.",
              },
              {
                label: "Compass clients passing through",
                description:
                  "International or inter-city clients whose move routes through or terminates in your market. Already inside the Compass ecosystem. We hand them to you at the right moment.",
              },
              {
                label: "Network referrals",
                description:
                  "As the partner network grows, cross-referrals flow between partners. A client referred to us from New York might ultimately need an agent in Vancouver. That referral goes to the right partner.",
              },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
              >
                <h2 className="text-base font-semibold text-[var(--foreground)]">{item.label}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who to refer */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10">
            <div className="h-px w-8 bg-[var(--accent)]" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Who to refer</p>
            <p className="mt-3 max-w-3xl text-[var(--muted)]">
              Any client whose move touches Toronto is a fit. Here are the most common profiles.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {WHO_TO_REFER.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
              >
                <h2 className="text-lg font-semibold text-[var(--foreground)]">{item.label}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Partner form */}
      <section id="become-a-partner" className="scroll-mt-24 border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
          <CompassPartnerForm />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-14">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-[var(--foreground)]">Questions before applying?</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Book a 15-minute call and we&apos;ll walk you through the program and referral structure.</p>
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
