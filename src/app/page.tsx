"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { REVIEWS, GOOGLE_REVIEWS_URL } from "@/data/reviews";

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

      <SectionDivider />

      {/* GOOGLE REVIEWS */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                What clients say
              </h2>
              <p className="mt-2 text-[var(--muted)]">
                Real reviews from Google — Toronto & GTA buyers and sellers.
              </p>
            </div>
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
            >
              See all reviews on Google
              <span aria-hidden>→</span>
            </a>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review, i) => (
              <article
                key={i}
                className="flex flex-col rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
              >
                <div className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-4 w-4 shrink-0 ${star <= review.rating ? "text-amber-400/90" : "text-white/20"}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--foreground)]/90">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <span className="text-sm font-medium text-[var(--foreground)]">{review.author}</span>
                  {review.date && (
                    <span className="text-xs text-[var(--muted)]">{review.date}</span>
                  )}
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google review
                </p>
              </article>
            ))}
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

          {/* Join Our Network / Newsletter */}
          <div className="mt-16 rounded-3xl border border-white/[0.08] bg-[var(--surface-elevated)]/98 p-10 shadow-[0_8px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm md:p-14 lg:p-16">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
              <div className="max-w-lg">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl lg:text-4xl">
                  Join our network
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
                  Get market insights, new listings, and updates from Yorksell. No spam — we send only what’s useful.
                </p>
              </div>
              <JoinNetworkForm />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}


function JoinNetworkForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          source: "newsletter",
        }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "Thanks — you're on the list.");
      setEmail("");
      setName("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[var(--surface)] px-4 py-3 text-base text-[var(--foreground)] placeholder-[var(--muted)] outline-none transition focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/30";

  return (
    <form onSubmit={onSubmit} className="w-full min-w-0 lg:max-w-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <input
            type="email"
            name="email"
            required
            placeholder="Your email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
          <input
            type="text"
            name="name"
            placeholder="Name (optional)"
            className={inputClass + " sm:w-40"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "loading"}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-xl bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60 sm:px-8"
        >
          {status === "loading" ? "Joining…" : "Join"}
        </button>
      </div>
      {message && (
        <p
          className={
            "mt-4 text-sm " +
            (status === "success" ? "text-green-500" : status === "error" ? "text-red-400" : "text-[var(--muted)]")
          }
        >
          {message}
        </p>
      )}
    </form>
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