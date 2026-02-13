"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type ApiFeaturedListing = {
  id: string;
  ddfId?: string | null;
  mlsNumber?: string | null;
  status?: string | null;
  addressLine?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  price?: number | null;
  beds?: number | null;
  baths?: number | null;
  propertyType?: string | null;
  photoUrl?: string | null;
};

type FeaturedListing = {
  id: string;
  href: string;
  title: string;
  price: string;
  meta: string;
  location: string;
  image: string;
};

const formatPrice = (value?: number | null) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return "";
  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${Math.round(value).toLocaleString()}`;
  }
};

const formatBedsBaths = (beds?: number | null, baths?: number | null) => {
  const parts: string[] = [];
  if (typeof beds === "number" && Number.isFinite(beds)) parts.push(`${beds} Bed`);
  if (typeof baths === "number" && Number.isFinite(baths)) parts.push(`${baths} Bath`);
  return parts.length ? parts.join(" • ") : "";
};

const toFeatured = (l: ApiFeaturedListing): FeaturedListing => {
  const title =
    (l.addressLine && l.addressLine.trim()) ||
    (l.propertyType && l.propertyType.trim()) ||
    (l.mlsNumber && l.mlsNumber.trim()) ||
    (l.ddfId && `Listing ${l.ddfId}`) ||
    "Listing";

  const city = (l.city && l.city.trim()) || "";
  const prov = (l.province && l.province.trim()) || "";
  const location = [city, prov].filter(Boolean).join(", ") || "Toronto, ON";

  const price = formatPrice(l.price) || "Contact";
  const meta =
    formatBedsBaths(l.beds, l.baths) ||
    (l.propertyType && l.propertyType.trim()) ||
    "MLS listing";

  // Prefer MLS number in URLs, then ddfId, then id
  const key = (l.mlsNumber && l.mlsNumber.trim()) || (l.ddfId && l.ddfId.trim()) || l.id;
  const href = `/listings/${encodeURIComponent(key)}`;

  // Prefer DDF photo URL, then proxy (GetObject: use mlsNumber first per RealtyPress), then placeholder
  const image =
    (l.photoUrl && l.photoUrl.trim()) ||
    (l.mlsNumber ? `/api/listings/photo?mlsNumber=${encodeURIComponent(l.mlsNumber)}` : null) ||
    (l.ddfId ? `/api/listings/photo?ddfId=${encodeURIComponent(l.ddfId)}` : null) ||
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80";

  return {
    id: l.id,
    href,
    title,
    price,
    meta,
    location,
    image,
  };
};

const FEATURED_FALLBACK: FeaturedListing[] = [
  {
    id: "featured-1",
    href: "/listings/featured-1",
    title: "Modern Condo • Waterfront",
    price: "$999,000",
    meta: "2 Bed • 2 Bath • 1 Parking",
    location: "Toronto, ON",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "featured-2",
    href: "/listings/featured-2",
    title: "Family Home • Ravine Lot",
    price: "$2,495,000",
    meta: "4+1 Bed • 4 Bath",
    location: "North York, ON",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "featured-3",
    href: "/listings/featured-3",
    title: "Luxury Townhome • End Unit",
    price: "$1,399,000",
    meta: "3 Bed • 3 Bath • 2 Parking",
    location: "Etobicoke, ON",
    image:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function HomePage() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [featured, setFeatured] = useState<FeaturedListing[]>(FEATURED_FALLBACK);
  const [featuredFromApi, setFeaturedFromApi] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setFeaturedLoading(true);
        setFeaturedError(null);

        const res = await fetch("/api/listings/featured", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to load featured listings (${res.status})`);
        }

        const data = (await res.json()) as { listings?: unknown };
        const raw = Array.isArray((data as any)?.listings) ? ((data as any).listings as unknown[]) : [];

        const mapped: FeaturedListing[] = raw
          .filter(Boolean)
          .map((x) => toFeatured(x as ApiFeaturedListing))
          .slice(0, 3);

        if (!cancelled && mapped.length > 0) {
          setFeatured(mapped);
          setFeaturedFromApi(true);
        }
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "Failed to load featured listings";
          setFeaturedError(msg);
        }
      } finally {
        if (!cancelled) setFeaturedLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // Ensure hero background video plays (helps with strict autoplay policies)
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    const play = () => {
      video.play().catch(() => {});
    };
    if (video.readyState >= 2) play();
    else {
      video.addEventListener("loadeddata", play, { once: true });
      return () => video.removeEventListener("loadeddata", play);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* HERO - video extends behind the header; negative margin pulls it up under the menu */}
      <header className="relative -mt-20 overflow-hidden min-h-[90vh] flex flex-col pt-20 sm:-mt-[5.5rem] sm:pt-[5.5rem]">
        <div className="absolute inset-0 z-0">
          <video
            ref={heroVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover scale-105"
            poster="https://images.unsplash.com/photo-1520694478161-50bfe3f7f925?auto=format&fit=crop&w=2600&q=80"
            aria-hidden
            src="/video/hero.mp4"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/60 to-black" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/40 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-1 px-4 pb-16 pt-2 sm:px-6 md:pb-24 md:pt-4">
          <div className="flex max-w-2xl flex-col justify-end">
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              Toronto & GTA real estate, with clarity.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/80 leading-relaxed">
              We help you buy, sell, and invest with a straightforward process and direct communication.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/listings"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
              >
                View listings
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* TRUST STRIP */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-12">
          <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <p className="max-w-xl text-[var(--foreground)] font-medium">
                Advice you can trust. We focus on pricing, presentation, and execution so you can make confident decisions.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <TrustStat value="Responsive" label="Communication" />
                <TrustStat value="Data-driven" label="Pricing" />
                <TrustStat value="Organized" label="Process" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                A focused team for buyers and sellers.
              </h2>
              <p className="mt-5 text-[var(--muted)] leading-relaxed">
                We handle pricing, marketing, and negotiation so you get a clear process and confident outcomes.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--foreground)]/90">
                <li className="flex gap-3">
                  <Check />
                  <span>Pricing based on current comparables</span>
                </li>
                <li className="flex gap-3">
                  <Check />
                  <span>Professional photography and presentation</span>
                </li>
                <li className="flex gap-3">
                  <Check />
                  <span>Clear communication at every step</span>
                </li>
              </ul>
              <div className="mt-10 flex gap-3">
                <Link
                  href="/about"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                >
                  About us
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="relative aspect-[4/3] w-full">
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-sm font-medium text-white">Yorksell Real Estate Group</p>
                  <p className="mt-0.5 text-xs text-white/70">Toronto & GTA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* SERVICES */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
              How we help
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              Buy, sell, or invest — with one team and one process.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <ServiceCard
              title="Buy"
              body="We help you find the right property and guide you through offer and closing."
              bullets={["Curated search", "Offer strategy", "Closing support"]}
              href="/listings"
              cta="View listings"
              image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
              imageAlt=""
            />
            <ServiceCard
              title="Sell"
              body="From pricing to marketing to negotiation, we manage the full process."
              bullets={["Market pricing", "Professional marketing", "Negotiation"]}
              href="/contact"
              cta="Book a consultation"
              image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              imageAlt=""
            />
            <ServiceCard
              title="Invest"
              body="We evaluate numbers and strategy so you can make informed decisions."
              bullets={["Rentability analysis", "Cash flow review", "Exit planning"]}
              href="/contact"
              cta="Get in touch"
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
              imageAlt=""
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FEATURED */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                Featured listings
              </h2>
              <p className="mt-2 text-[var(--muted)]">
                Current MLS listings across Toronto and the GTA.
              </p>
            </div>
            <Link
              href="/listings"
              className="hidden h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5 md:inline-flex"
            >
              View all
            </Link>
          </div>

          {(featuredLoading || featuredError) && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
              {featuredLoading ? (
                <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-white/30" />
              )}
              <span>
                {featuredLoading ? "Loading…" : featuredError ?? "Showing featured listings."}
              </span>
            </div>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featured.map((l) => (
              <article
                key={l.id}
                className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              >
                <Link href={l.href} className="block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={l.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute right-3 top-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                      {l.price}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-[var(--foreground)]">{l.title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">{l.meta}</p>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">{l.location}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
                      View details
                      <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-10 md:hidden">
            <Link
              href="/listings"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-[var(--surface)] text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
            >
              View all listings
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/[0.06] bg-[var(--surface)] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2600&q=60"
            alt=""
            className="h-full w-full object-cover opacity-20"
            loading="lazy"
            referrerPolicy="no-referrer"
            aria-hidden
          />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)]/95 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-sm md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                  Ready to talk?
                </h2>
                <p className="mt-3 text-[var(--muted)]">
                  Share your timeline and goals and we’ll outline next steps.
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
                  href="/members"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 px-6 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                >
                  Members
                </Link>
              </div>
            </div>
          </div>

          <footer className="mt-14 border-t border-white/[0.06] pt-8 text-xs text-[var(--muted)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Yorksell Real Estate Group.</p>
              <div className="flex gap-6">
                <Link href="/privacy" className="hover:text-[var(--foreground)]">Privacy</Link>
                <Link href="/terms" className="hover:text-[var(--foreground)]">Terms</Link>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}


function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-sm font-semibold text-[var(--foreground)]">{value}</div>
      <div className="mt-0.5 text-xs text-[var(--muted)]">{label}</div>
    </div>
  );
}

function Check() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white">
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
  image,
  imageAlt,
}: {
  title: string;
  body: string;
  bullets: string[];
  href: string;
  cta: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
      {image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
        <ul className="mt-5 space-y-2 text-sm text-[var(--foreground)]/90">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.45 7.5a1 1 0 0 1-1.42.006L3.29 9.704a1 1 0 1 1 1.414-1.414l3.84 3.84 6.743-6.79a1 1 0 0 1 1.417-.05Z" clipRule="evenodd" />
                </svg>
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Link href={href} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline">
            {cta}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6" aria-hidden>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}