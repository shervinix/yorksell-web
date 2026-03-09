import type { Metadata } from "next";
import Link from "next/link";
import PropertyManagementForm from "./PropertyManagementForm";

export const metadata: Metadata = {
  title: "Property Management | Yorksell",
  description:
    "Full-service property management in the GTA. Tenant screening, rent collection, maintenance coordination, and more.",
  openGraph: {
    title: "Property Management | Yorksell | Toronto & GTA",
    description: "Full-service property management. Let us handle your rental properties.",
  },
};

const HERO_IMAGE =
  "https://unsplash.com/photos/EL8jKaZnU0A/download?force=true&w=2600";

export default function PropertyManagementPage() {
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
            Property Management
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            Full-service property management across Toronto and the GTA. Tenant screening, rent collection, maintenance, and more — so you can enjoy passive income with peace of mind.
          </p>
          <Link
            href="#get-started"
            className="mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white/90"
          >
            Get a free consultation
          </Link>
        </div>
      </header>

      {/* Property management services */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
            How we help landlords
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">
            From tenant placement to ongoing operations, we handle the details so you don&apos;t have to.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Tenant screening</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                We vet applicants with credit checks, employment verification, and references so you get reliable tenants.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Rent collection</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Timely collection and remittance, with clear reporting so you always know where your income stands.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] sm:col-span-2 lg:col-span-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Maintenance & repairs</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                We coordinate repairs with trusted vendors and handle emergencies so your property stays in top shape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
            Management packages
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">
            Choose the level of support that fits your portfolio. All packages include tenant screening and rent collection.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Essential</h3>
              <p className="mt-1 text-2xl font-bold text-[var(--accent)]">8%</p>
              <p className="text-xs text-[var(--muted)]">of monthly rent</p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Tenant placement & screening
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Rent collection & remittance
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Monthly reporting
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Lease administration
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border-2 border-[var(--accent)] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-4 py-1 text-sm font-medium text-white">Popular</span>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Full Service</h3>
              <p className="mt-1 text-2xl font-bold text-[var(--accent)]">10%</p>
              <p className="text-xs text-[var(--muted)]">of monthly rent</p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Everything in Essential
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Maintenance coordination
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Emergency response 24/7
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Property inspections
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Vendor management
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Premium</h3>
              <p className="mt-1 text-2xl font-bold text-[var(--accent)]">12%</p>
              <p className="text-xs text-[var(--muted)]">of monthly rent</p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Everything in Full Service
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Dedicated property manager
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Proactive maintenance plans
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Financial & tax reporting
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--accent)]">✓</span>
                  Owner portal access
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="get-started" className="border-t border-white/[0.06] bg-[var(--surface)] scroll-mt-20">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
          <PropertyManagementForm />
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
