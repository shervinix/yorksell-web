import Link from "next/link";
import type { Metadata } from "next";
import { teamMembers } from "@/data/team";
import FadeUp from "@/app/FadeUp";

export const metadata: Metadata = {
  title: "Meet The Team",
  description:
    "Meet the partners at Yorksell Real Estate Group. Toronto & GTA. A focused team for buyers and sellers.",
  openGraph: {
    title: "Meet The Team | Yorksell Real Estate Group",
    description: "Toronto & GTA. Meet our partners. Advice you can trust.",
  },
};

const HERO_IMAGE =
  "https://unsplash.com/photos/eHD8Y1Znfpk/download?force=true&w=2600";

const HOW_WE_WORK = [
  {
    title: "One contact, whole team",
    description:
      "You work primarily with one partner, but every call and every decision is backed by the knowledge and network of the full team. You are never limited to one person's experience.",
  },
  {
    title: "Specialists, not generalists",
    description:
      "Each partner focuses on a different area of the market. Residential sales, listing strategy, investment, and relocation are each handled by someone who works in that space every day.",
  },
  {
    title: "Available when it counts",
    description:
      "Real estate moves fast. As a team, someone is always reachable. Offer nights, last-minute questions, and time-sensitive decisions do not get missed.",
  },
  {
    title: "Built for the long term",
    description:
      "The team model means continuity. Whoever you worked with on your first transaction is still here when you come back. We build relationships, not one-off files.",
  },
] as const;

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* Hero */}
      <header className="relative -mt-[6.5rem] min-h-[40vh] overflow-hidden pt-[6.5rem]">
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
            Meet The Team
          </h1>
          <p className="hero-enter-2 mt-3 max-w-xl text-lg text-white/85">
            Four partners. Each focused on a different part of the market, working together on every file.
          </p>
        </div>
      </header>

      {/* Team cards */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, i) => (
              <FadeUp key={member.slug} delay={i * 80} className="h-full">
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition hover:border-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                  <Link href={`/team/${member.slug}`} className="relative block aspect-square w-full overflow-hidden bg-[var(--surface)]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className={`h-full w-full object-cover transition duration-500 group-hover:scale-110 ${member.imageClassName ?? ""}`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <Link href={`/team/${member.slug}`} className="group/name">
                      <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] group-hover/name:text-white">
                        {member.name}
                      </h2>
                    </Link>
                    <p className="mt-1 text-sm font-medium text-white/55">{member.role}</p>

                    {/* Contact details */}
                    <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4">
                      {member.contact.phone && (
                        <a
                          href={`tel:${member.contact.phone.replace(/\D/g, "")}`}
                          className="flex items-center gap-2 text-xs text-[var(--muted)] transition hover:text-[var(--foreground)]"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0 text-white/25" aria-hidden>
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {member.contact.phone}
                        </a>
                      )}
                      {member.contact.email && (
                        <a
                          href={`mailto:${member.contact.email}`}
                          className="flex items-center gap-2 text-xs text-[var(--muted)] transition hover:text-[var(--foreground)]"
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0 text-white/25" aria-hidden>
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          {member.contact.email}
                        </a>
                      )}
                    </div>

                    <Link
                      href={`/team/${member.slug}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
                    >
                      View profile <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* How we work together */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">How we work together</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                What it actually means to work with a team rather than a solo agent.
              </p>
            </div>
          </FadeUp>
          <div className="grid gap-6 sm:grid-cols-2">
            {HOW_WE_WORK.map((item, i) => (
              <FadeUp key={item.title} delay={i * 80} className="h-full">
                <article className="h-full rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                  <h2 className="text-base font-semibold text-[var(--foreground)]">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <FadeUp>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)] md:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                    Ready to work with us?
                  </h2>
                  <p className="mt-3 text-[var(--muted)]">
                    Get in touch with any of our partners or use the form to reach the team.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </main>
  );
}
