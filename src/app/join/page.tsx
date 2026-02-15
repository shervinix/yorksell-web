import type { Metadata } from "next";
import Link from "next/link";
import JoinYorksellForm from "./JoinYorksellForm";

export const metadata: Metadata = {
  title: "Join Yorksell",
  description:
    "Join Yorksell Real Estate Group as an agent. We're looking for talented professionals in Toronto & GTA.",
  openGraph: {
    title: "Join Yorksell | Real Estate Agents | Toronto & GTA",
    description: "Join our team. We're building a focused group of agents in Toronto and the GTA.",
  },
};

const HERO_IMAGE =
  "https://picsum.photos/seed/join-yorksell/2600/800";

export default function JoinYorksellPage() {
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
            Join Yorksell
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            We&apos;re looking for talented real estate agents to join our team in Toronto and the GTA.
          </p>
          <Link
            href="#get-started"
            className="mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-white/90"
          >
            Express your interest
          </Link>
        </div>
      </header>

      {/* Why join us */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
            Why join Yorksell?
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--muted)]">
            A supportive environment where you can grow your practice and serve clients with integrity.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Collaborative team</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Work alongside experienced partners who share leads, support, and best practices.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Professional tools</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Access MLS, marketing resources, and systems designed to help you succeed.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] sm:col-span-2 lg:col-span-1">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Room to grow</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Build your business with a brand focused on quality and client trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="get-started" className="border-t border-white/[0.06] bg-[var(--background)] scroll-mt-20">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
          <JoinYorksellForm />
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[var(--muted)]">
              Questions? <Link href="/contact" className="font-medium text-[var(--accent)] hover:underline">Contact us</Link> or view our <Link href="/team" className="font-medium text-[var(--accent)] hover:underline">team</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
