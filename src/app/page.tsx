"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const FEATURED = [
  {
    id: "featured-1",
    title: "Modern Condo • Waterfront",
    price: "$999,000",
    meta: "2 Bed • 2 Bath • 1 Parking",
    location: "Toronto, ON",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "featured-2",
    title: "Family Home • Ravine Lot",
    price: "$2,495,000",
    meta: "4+1 Bed • 4 Bath",
    location: "North York, ON",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "featured-3",
    title: "Luxury Townhome • End Unit",
    price: "$1,399,000",
    meta: "3 Bed • 3 Bath • 2 Parking",
    location: "Etobicoke, ON",
    image:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Lock body scroll when the drawer is open
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileOpen(false);
      };

      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onKeyDown);
      };
    }

    // When closed, ensure overflow is reset
    document.body.style.overflow = "";
    return;
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-zinc-50">
      {/* HERO */}
      <header className="relative overflow-hidden">
        {/* Blurred background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1520694478161-50bfe3f7f925?auto=format&fit=crop&w=2600&q=80"
            alt="Toronto"
            className="h-full w-full object-cover blur-2xl scale-110 opacity-70"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-white dark:to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.20),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22 viewBox=%220 0 240 240%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22240%22 height=%22240%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E')]" />
        </div>

        {/* Top nav */}
        <nav className="sticky top-4 z-40 mx-auto max-w-6xl px-6 pt-6">
          <div
            className={
              "flex items-center justify-between rounded-full px-3 py-2 backdrop-blur-2xl transition-all " +
              (scrolled
                ? "bg-white/14 ring-1 ring-white/10 shadow-[0_1px_0_rgba(255,255,255,0.08),0_12px_34px_rgba(0,0,0,0.22)]"
                : "bg-white/[0.05] ring-1 ring-white/8 shadow-[0_1px_0_rgba(255,255,255,0.06)]")
            }
          >
            <Link href="/" className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/[0.08] text-white ring-1 ring-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
                <span className="text-sm font-semibold">Y</span>
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">Yorksell</div>
                <div className="text-[11px] text-white/70">
                  Advice You Can Trust
                </div>
              </div>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/listings"
                className="group relative rounded-full px-3 py-2 text-sm text-white/80 transition hover:text-white"
              >
                <span>Listings</span>
                <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-white/70 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
              <Link
                href="/about"
                className="group relative rounded-full px-3 py-2 text-sm text-white/80 transition hover:text-white"
              >
                <span>About</span>
                <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-white/70 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
              <Link
                href="/contact"
                className="group relative rounded-full px-3 py-2 text-sm text-white/80 transition hover:text-white"
              >
                <span>Contact</span>
                <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-white/70 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
              <Link
                href="/members"
                className="group relative rounded-full px-3 py-2 text-sm text-white/80 transition hover:text-white"
              >
                <span>Members</span>
                <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-white/70 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 md:hidden"
                aria-label="Open menu"
                aria-controls="mobile-menu"
                aria-expanded={mobileOpen}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M5 7h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 17h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <Link
                href="/listings"
                className="hidden h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/[0.10] transition sm:inline-flex"
              >
                Browse
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-black shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:bg-zinc-200 transition"
              >
                Book a Consult
              </Link>
            </div>
          </div>

          {/* Mobile menu (overlay + drawer) */}
          <div
            id="mobile-menu"
            className={mobileOpen ? "fixed inset-0 z-50 md:hidden" : "hidden"}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 h-full w-full bg-black/60"
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white p-5 shadow-2xl dark:bg-black">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black">
                    <span className="text-sm font-semibold">Y</span>
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      Yorksell
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-500">
                      Advice You Can Trust
                    </div>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-50 dark:hover:bg-zinc-900"
                  aria-label="Close menu"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid gap-2">
                <MobileNavLink
                  href="/listings"
                  onClick={() => setMobileOpen(false)}
                >
                  Listings
                </MobileNavLink>
                <MobileNavLink
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </MobileNavLink>
                <MobileNavLink
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </MobileNavLink>
                <MobileNavLink
                  href="/members"
                  onClick={() => setMobileOpen(false)}
                >
                  Members
                </MobileNavLink>
              </div>

              <div className="mt-6 grid gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                <Link
                  href="/listings"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  Browse listings
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Book a consult
                </Link>
              </div>

              <p className="mt-6 text-xs leading-6 text-zinc-500 dark:text-zinc-500">
                Toronto + GTA. Buying, selling, and investing — with clear advice
                and tight execution.
              </p>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-10 md:pb-20 md:pt-14">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              Toronto • GTA
              <span className="h-1 w-1 rounded-full bg-white/40" />
              Buying • Selling • Investing
            </p>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Real estate, done right.
            </h1>

            <p className="mt-5 text-lg leading-8 text-white/80">
              Clear advice, thoughtful presentation, and fast communication —
              with a plan you can understand.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/listings"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Explore Listings
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
              >
                Get a Pricing Plan
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              <HeroPill>Pricing that makes sense</HeroPill>
              <HeroPill>Strong negotiation</HeroPill>
              <HeroPill>Great presentation</HeroPill>
              <HeroPill>Quick updates</HeroPill>
            </div>
            <div className="mt-10 inline-flex items-center gap-3 text-xs text-white/70">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M12 5v12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 14l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>Scroll to explore</span>
            </div>
          </div>
        </div>
      </header>

      {/* TRUST STRIP */}
      <section className="bg-white/70 dark:bg-black/60">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-3xl border border-zinc-200/80 bg-white/70 p-6 backdrop-blur dark:border-zinc-800/80 dark:bg-black/50">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  A calm, modern experience — start to finish.
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Clear next steps, fast communication, and thoughtful presentation.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 md:gap-6">
                <TrustStat value="Fast" label="Response time" />
                <TrustStat value="Sharp" label="Pricing strategy" />
                <TrustStat value="Clean" label="Execution" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-800 dark:bg-black">
                Downtown
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-800 dark:bg-black">
                North York
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-800 dark:bg-black">
                Etobicoke
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-800 dark:bg-black">
                Richmond Hill
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-800 dark:bg-black">
                Markham
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white dark:bg-black">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                A boutique team with a high-output playbook.
              </h2>
              <p className="mt-4 leading-8 text-zinc-600 dark:text-zinc-400">
                Yorksell is built for clients who want a smooth process and
                confident decisions. We focus on the details — presentation,
                comps, and negotiation — and keep you updated every step of the
                way.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                <li className="flex gap-3">
                  <Check />
                  <span>Pricing and positioning built on real comps.</span>
                </li>
                <li className="flex gap-3">
                  <Check />
                  <span>Fast replies, fewer surprises, tighter timelines.</span>
                </li>
                <li className="flex gap-3">
                  <Check />
                  <span>High-quality photos, video, and launch strategy.</span>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  Learn more
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Talk to Yorksell
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-black">
              <div className="relative aspect-[4/3] w-full">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
                  alt="Yorksell team"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur">
                    <p className="text-sm font-semibold">
                      A modern, client-first approach.
                    </p>
                    <p className="mt-1 text-sm text-white/80">
                      Thoughtful strategy, simple communication, and strong
                      execution.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                        Toronto + GTA
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                        Buying
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                        Selling
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                        Investing
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-0 border-t border-zinc-200 dark:border-zinc-800">
                <AboutStat label="Pricing" value="Comps + positioning" />
                <AboutStat label="Process" value="Responsive + organized" />
                <AboutStat label="Marketing" value="Photos + video" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* SERVICES */}
      <section className="bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
        <div className="mx-auto max-w-6xl px-6 pb-14">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-black md:p-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                How we help
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400">
                Three ways we can help — choose what you need.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <ServiceCard
                title="Buy"
                body="We shortlist the right options, guide your offer, and keep everything moving."
                bullets={["Search + shortlist", "Offer strategy", "Closing coordination"]}
                href="/listings"
                cta="Browse listings"
              />
              <ServiceCard
                title="Sell"
                body="Pricing, presentation, and a launch that gets the right eyes on your home."
                bullets={["Pricing plan", "Media + launch", "Negotiation + firming"]}
                href="/contact"
                cta="Book a consult"
              />
              <ServiceCard
                title="Invest"
                body="We look at numbers, risk, and upside — then help you make the right move."
                bullets={["Rentability", "Cashflow math", "Exit strategy"]}
                href="/contact"
                cta="Run numbers"
              />
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FEATURED */}
      <section className="bg-gradient-to-b from-white to-zinc-50 dark:from-black dark:to-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Featured listings
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                A few highlights. Browse everything on the Listings page.
              </p>
            </div>
            <Link
              href="/listings"
              className="hidden h-10 items-center justify-center rounded-full border border-zinc-200 px-5 text-sm font-medium hover:bg-white dark:border-zinc-800 dark:hover:bg-black md:inline-flex"
            >
              View all
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {FEATURED.map((l) => (
              <article
                key={l.id}
                className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-black"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <img
                    src={l.image}
                    alt={l.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold leading-6">{l.title}</h3>
                    <span className="shrink-0 rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-black">
                      {l.price}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{l.meta}</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">{l.location}</p>
                  <div className="mt-4">
                    <Link
                      href="/listings"
                      className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                    >
                      View details
                      <span aria-hidden className="transition group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link
              href="/listings"
              className="inline-flex h-10 w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-900"
            >
              View all listings
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-white dark:bg-black">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.06),transparent_60%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_60%)]" />
        </div>
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-black md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Want a clear plan for your next move?
                </h2>
                <p className="mt-3 leading-8 text-zinc-600 dark:text-zinc-400">
                  Tell us your timeline, budget, and must-haves — we’ll map out next steps.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Contact Yorksell
                </Link>
                <Link
                  href="/members"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-900"
                >
                  Members area
                </Link>
              </div>
            </div>
          </div>

          <footer className="mt-10 border-t border-zinc-200 pt-8 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Yorksell Real Estate Group. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:underline">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:underline">
                  Terms
                </Link>
              </div>
            </div>
            <p className="mt-3">
              *Listing data subject to board rules and licensing. MLS/IDX/DDF integration will be enabled once your feed credentials are active.
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}

function HeroPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
      {children}
    </span>
  );
}


function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-center shadow-sm dark:border-zinc-800 dark:bg-black/60">
      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-500">
        {label}
      </div>
    </div>
  );
}

function AboutStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4">
      <div className="text-[11px] text-zinc-500 dark:text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{value}</div>
    </div>
  );
}

function Check() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.45 7.5a1 1 0 0 1-1.42.006L3.29 9.704a1 1 0 1 1 1.414-1.414l3.84 3.84 6.743-6.79a1 1 0 0 1 1.417-.05Z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

function ServiceCard({
  title,
  body,
  bullets,
  href,
  cta,
}: {
  title: string;
  body: string;
  bullets: string[];
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">{body}</p>
        </div>
        <div className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-zinc-50 md:flex">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
            <path
              d="M7 7h10v10H7V7Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
              opacity="0.55"
            />
            <path d="M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path
              d="M12 9v6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.65"
            />
          </svg>
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-black">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.45 7.5a1 1 0 0 1-1.42.006L3.29 9.704a1 1 0 1 1 1.414-1.414l3.84 3.84 6.743-6.79a1 1 0 0 1 1.417-.05Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Link href={href} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50">
          {cta}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:text-zinc-50 dark:hover:bg-zinc-900"
    >
      <span>{children}</span>
      <span className="text-zinc-400" aria-hidden>
        →
      </span>
    </Link>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto max-w-6xl px-6" aria-hidden>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />
    </div>
  );
}