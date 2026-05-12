import Link from "next/link";
import type { Metadata } from "next";
import { teamMembers } from "@/data/team";
import FadeUp from "@/app/FadeUp";

export const metadata: Metadata = {
  title: "About | Yorksell",
  description:
    "Yorksell Real Estate Group. A focused team for buyers and sellers in Toronto and the GTA. Pricing, presentation, and execution you can trust.",
  openGraph: {
    title: "About | Yorksell Real Estate Group",
    description: "Toronto & GTA. A focused team for buyers and sellers. Advice you can trust.",
  },
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2600&q=80";

const AREAS = [
  {
    region: "Downtown Toronto",
    neighbourhoods: "King West, Queen West, Distillery District, The Annex, Yorkville, Corktown, Liberty Village, Harbourfront",
  },
  {
    region: "Midtown & North Toronto",
    neighbourhoods: "Forest Hill, Lawrence Park, Leaside, Davisville, Chaplin Estates, Bedford Park, Rosedale",
  },
  {
    region: "East End",
    neighbourhoods: "The Beaches, Leslieville, East York, Danforth, Riverdale, Scarborough",
  },
  {
    region: "West End",
    neighbourhoods: "Etobicoke, High Park, Bloor West Village, The Junction, Roncesvalles, Swansea",
  },
  {
    region: "North York",
    neighbourhoods: "Willowdale, Don Mills, Bayview Village, Newtonbrook, Bathurst Manor",
  },
  {
    region: "905 & Beyond",
    neighbourhoods: "Mississauga, Oakville, Burlington, Vaughan, Richmond Hill, Markham, Pickering",
  },
] as const;

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* Hero */}
      <header className="relative -mt-[6.5rem] min-h-[50vh] overflow-hidden pt-[6.5rem]">
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
            About Yorksell
          </h1>
          <p className="hero-enter-2 mt-3 max-w-xl text-lg text-white/85">
            A focused team of agents for buyers, sellers, and investors across Toronto and the GTA.
          </p>
        </div>
      </header>

      {/* Who we are */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <FadeUp>
              <div>
                <div className="mb-6">
                  <div className="h-px w-8 bg-[var(--accent)]" />
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Who we are</p>
                </div>
                <p className="leading-relaxed text-[var(--muted)]">
                  Yorksell Real Estate Group is a team of four active agents based in Toronto. We are not a solo practice and not a large brokerage. We are a focused group that works together across buying, selling, investing, and relocation so every client benefits from more than one perspective.
                </p>
                <p className="mt-5 leading-relaxed text-[var(--muted)]">
                  We cover the full GTA with specialists in residential sales, listing strategy, investment properties, and the Compass relocation program. Whatever brought you here, you are working with people who are in the market every day and will give you a straight answer.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={150}>
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <div className="relative aspect-[4/3] w-full">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-sm font-medium text-white">Yorksell Real Estate Group</p>
                    <p className="mt-0.5 text-xs text-white/70">Toronto &amp; GTA</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Our approach */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Our approach</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                We keep the process clear and data-driven so you can make confident decisions.
              </p>
            </div>
          </FadeUp>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FadeUp delay={0} className="h-full">
              <div className="h-full rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Pricing</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  Pricing based on current comparables and market conditions, so you know where you stand from day one.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={100} className="h-full">
              <div className="h-full rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Presentation</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  Professional photography and marketing so your property is shown at its best to the right buyers.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={200} className="h-full sm:col-span-2 lg:col-span-1">
              <div className="h-full rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Communication</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  Clear updates at every step. Responsive, organized, and focused on your timeline and goals.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Meet the team */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">The team</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Four partners, each specializing in a different area of the market.
              </p>
            </div>
          </FadeUp>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, i) => (
              <FadeUp key={member.slug} delay={i * 80}>
                <Link
                  href={`/team/${member.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition hover:border-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-[var(--surface)]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className={`h-full w-full object-cover transition duration-500 group-hover:scale-110 ${member.imageClassName ?? ""}`}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="font-semibold text-[var(--foreground)]">{member.name}</p>
                    <p className="mt-0.5 text-xs text-white/55">{member.role}</p>
                    {member.tagline && (
                      <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{member.tagline}</p>
                    )}
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] group-hover:underline">
                      View profile <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={100}>
            <div className="mt-6 text-center">
              <Link
                href="/team"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                Meet the full team <span aria-hidden>→</span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Areas we serve */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <FadeUp>
            <div className="mb-10">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Areas we serve</p>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                We work across Toronto and the Greater Toronto Area. If your neighbourhood is not listed, get in touch. We likely cover it.
              </p>
            </div>
          </FadeUp>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((area, i) => (
              <FadeUp key={area.region} delay={i * 60}>
                <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{area.region}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--muted)]">{area.neighbourhoods}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <FadeUp>
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)] md:p-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                    Ready to work with us?
                  </h2>
                  <p className="mt-3 text-[var(--muted)]">
                    Tell us your timeline and goals and we will outline next steps.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
                  >
                    Contact us
                  </Link>
                  <Link
                    href="/listings"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 px-6 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                  >
                    View listings
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

    </main>
  );
}
