import type { Metadata } from "next";
import Link from "next/link";
import PropertyManagementForm from "./PropertyManagementForm";
import PMFaq from "./PMFaq";
import FadeUp from "@/app/FadeUp";

export const metadata: Metadata = {
  title: "Property Management | Yorksell",
  description:
    "Full-service property management in the GTA. Tenant placement, screening, maintenance coordination, and lease management.",
  openGraph: {
    title: "Property Management | Yorksell | Toronto & GTA",
    description: "Full-service property management. Let us handle your rental properties.",
  },
};

const HERO_IMAGE =
  "https://unsplash.com/photos/EL8jKaZnU0A/download?force=true&w=2600";

const WHY_YORKSELL = [
  {
    title: "We know the rental market",
    description:
      "As active agents running transactions daily, we price rentals accurately, know what tenants are looking for, and can position your unit to lease quickly at the right rate.",
  },
  {
    title: "Tenant placement is our core skill",
    description:
      "Finding and qualifying the right tenant draws on the same expertise as selling: marketing, vetting prospects, and running a competitive process. We have done this across hundreds of placements.",
  },
  {
    title: "A vendor network built over years",
    description:
      "We are not sourcing contractors on the fly. Our maintenance network comes from years of active transactions: tradespeople we know, trust, and have worked with repeatedly.",
  },
  {
    title: "One team for your entire portfolio",
    description:
      "Whether you are buying, selling, or managing, you deal with the same team. No handoffs, no rebuilding relationships, and no one learning your portfolio from scratch.",
  },
] as const;

const PROCESS_STEPS = [
  {
    title: "Property assessment",
    description:
      "We walk through the property, assess its condition, and run a rental market analysis to determine the right asking rent based on current comparable listings in your area.",
  },
  {
    title: "Tenant marketing",
    description:
      "We list the unit on major rental platforms and leverage our agent network to generate qualified leads quickly. Listings are professionally presented and targeted to the right renter profile.",
  },
  {
    title: "Showings and screening",
    description:
      "We coordinate all viewings and vet every applicant with credit checks, employment verification, and reference calls. You review our recommendation before any lease is signed.",
  },
  {
    title: "Lease preparation and signing",
    description:
      "We prepare an Ontario-compliant lease, walk the tenant through the terms, and execute all documentation. Move-in conditions and key handover are coordinated by us.",
  },
  {
    title: "Ongoing management",
    description:
      "Tenants contact us directly for any issues. We coordinate maintenance through our vendor network, conduct regular property inspections, and keep you informed without overwhelming you.",
  },
  {
    title: "Lease renewals",
    description:
      "We reach out before the lease end date, review market rents, and advise on renewal or re-listing. All paperwork and tenant communication is handled on your behalf.",
  },
] as const;

export default function PropertyManagementPage() {
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
            Property Management
          </h1>
          <p className="hero-enter-2 mt-3 max-w-xl text-lg text-white/85">
            Full-service property management across Toronto and the GTA. Tenant placement, maintenance coordination, and lease management, handled by the same team that knows your investment.
          </p>
          <Link
            href="#get-started"
            className="hero-enter-3 mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white/90"
          >
            Get a free consultation
          </Link>
        </div>
      </header>

      {/* How we help landlords */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">How we help landlords</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                From tenant placement to ongoing operations, we handle the details so you don&apos;t have to.
              </p>
            </div>
          </FadeUp>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FadeUp delay={0}>
              <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Tenant screening</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  We vet applicants with credit checks, employment verification, and references so you get reliable, qualified tenants.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={100}>
              <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Lease renewals &amp; compliance</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  We handle all lease documentation, renewals, and ensure your tenancy agreements are fully compliant with Ontario law.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={200}>
              <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] sm:col-span-2 lg:col-span-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Maintenance &amp; repairs</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  We coordinate repairs with trusted vendors and handle emergencies so your property stays in top shape.
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
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Why Yorksell for property management</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Most property managers are not active in the market. We are.
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

      {/* How it works */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">How it works</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                From your first call to a tenanted, well-managed property. Here is exactly what to expect.
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

      {/* Pricing tiers */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Management packages</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Choose the level of support that fits your portfolio. All packages include tenant placement and lease administration.
              </p>
            </div>
          </FadeUp>
          <div className="grid gap-6 lg:grid-cols-3">
            <FadeUp delay={0} className="h-full">
              <div className="h-full rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Essential</h3>
                <p className="mt-1 text-2xl font-bold text-[var(--accent)]">8%</p>
                <p className="text-xs text-[var(--muted)]">of monthly rent</p>
                <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Tenant placement &amp; screening</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Lease administration &amp; renewals</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Monthly reporting</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Tenant communications</li>
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={100} className="h-full">
              <div className="relative h-full rounded-2xl border-2 border-[var(--accent)] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-4 py-1 text-sm font-medium text-white">Popular</span>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Full Service</h3>
                <p className="mt-1 text-2xl font-bold text-[var(--accent)]">10%</p>
                <p className="text-xs text-[var(--muted)]">of monthly rent</p>
                <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Everything in Essential</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Maintenance coordination</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Emergency response 24/7</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Property inspections</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Vendor management</li>
                </ul>
              </div>
            </FadeUp>
            <FadeUp delay={200} className="h-full">
              <div className="h-full rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Premium</h3>
                <p className="mt-1 text-2xl font-bold text-[var(--accent)]">12%</p>
                <p className="text-xs text-[var(--muted)]">of monthly rent</p>
                <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Everything in Full Service</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Dedicated property manager</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Proactive maintenance plans</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Financial &amp; tax reporting</li>
                  <li className="flex items-start gap-2"><span className="mt-0.5 text-[var(--accent)]">✓</span>Owner portal access</li>
                </ul>
              </div>
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
                Answers to what landlords ask us most before their first call.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <PMFaq />
          </FadeUp>
        </div>
      </section>

      {/* Contact form */}
      <section id="get-started" className="border-t border-white/[0.06] bg-[var(--background)] scroll-mt-20">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="mb-8">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Get in touch</p>
              <p className="mt-3 text-[var(--muted)]">
                Tell us about your property and we&apos;ll get in touch to discuss how we can help.
              </p>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <PropertyManagementForm />
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
