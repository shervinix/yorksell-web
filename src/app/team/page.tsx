import Link from "next/link";
import type { Metadata } from "next";
import { teamMembers } from "@/data/team";

export const metadata: Metadata = {
  title: "Meet The Team",
  description:
    "Meet the partners at Yorksell Real Estate Group — Toronto & GTA. A focused team for buyers and sellers.",
  openGraph: {
    title: "Meet The Team | Yorksell Real Estate Group",
    description: "Toronto & GTA. Meet our partners. Advice you can trust.",
  },
};

const HERO_IMAGE =
  "https://unsplash.com/photos/eHD8Y1Znfpk/download?force=true&w=2600";

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="relative -mt-20 min-h-[40vh] overflow-hidden pt-20 sm:-mt-[5.5rem] sm:pt-[5.5rem]">
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
            Meet The Team
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            The partners behind Yorksell.
          </p>
        </div>
      </header>

      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <Link
                key={member.slug}
                href={`/team/${member.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition hover:border-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[var(--surface)]">
                  <img
                    src={member.image}
                    alt=""
                    className={`h-full w-full object-cover transition group-hover:scale-105 ${member.imageClassName ?? ""}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                    {member.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-white/70">{member.role}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] group-hover:underline">
                    View profile
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
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
        </div>
      </section>
    </main>
  );
}
