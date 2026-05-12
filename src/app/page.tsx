import Link from "next/link";
import { REVIEWS, GOOGLE_REVIEWS_URL } from "@/data/reviews";
import { getFeaturedListings } from "@/lib/get-featured-listings";
import { ListingCard } from "@/app/listings/ListingCard";
import JoinNetworkForm from "@/app/JoinNetworkForm";
import HeroSearch from "@/app/HeroSearch";
import FadeUp from "@/app/FadeUp";

export const revalidate = 60;

export default async function HomePage() {
  const featured = await getFeaturedListings();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* HERO */}
      <header className="relative -mt-[6.5rem] overflow-hidden min-h-[90vh] flex flex-col pt-[6.5rem]">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
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
            <h1 className="hero-enter-1 text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              Advice You Can Trust.
            </h1>
            <p className="hero-enter-2 mt-5 max-w-lg text-lg text-white/80 leading-relaxed">
              Real estate across Toronto and the GTA. Clear process, honest advice, no noise
            </p>
            <div className="hero-enter-3 mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
              >
                Get in touch
              </Link>
              <Link
                href="/listings"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 text-sm font-medium text-white transition hover:bg-white/10"
              >
                View listings
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ABOUT */}
      <section className="bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <FadeUp>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                The team behind the result.
              </h2>
              <p className="mt-5 text-[var(--muted)] leading-relaxed">
                Pricing, presentation, and negotiation handled with precision. You stay informed at every stage and nothing gets missed.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--foreground)]/90">
                <li className="flex gap-3">
                  <Check />
                  <span>Every decision supported by current market intelligence</span>
                </li>
                <li className="flex gap-3">
                  <Check />
                  <span>Marketing designed to position, not just promote</span>
                </li>
                <li className="flex gap-3">
                  <Check />
                  <span>One point of contact, always available</span>
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
            </FadeUp>
            <FadeUp delay={150}>
            <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-[var(--surface)] shadow-[0_8px_40px_rgba(0,0,0,0.55)]">
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
            </FadeUp>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* SERVICES */}
      <section className="bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
              Our Expertise
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              Four ways to work with us, same standard of service.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FadeUp delay={0} className="h-full">
              <ServiceCard
                title="Buy"
                body="We help you find the right property and guide you through offer and closing."
                bullets={["Curated search", "Offer strategy", "Closing support"]}
                href="/listings"
                cta="View listings"
                image="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80"
                imageAlt=""
              />
            </FadeUp>
            <FadeUp delay={100} className="h-full">
              <ServiceCard
                title="Sell"
                body="From pricing to marketing to negotiation, we manage the full process."
                bullets={["Market pricing", "Professional marketing", "Expert negotiation"]}
                href="/contact"
                cta="Book a consultation"
                image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                imageAlt=""
              />
            </FadeUp>
            <FadeUp delay={200} className="h-full">
              <ServiceCard
                title="Invest"
                body="We evaluate numbers and strategy so you can make informed decisions."
                bullets={["Cap rate and NOI analysis", "Due diligence", "Disposition and exit strategy"]}
                href="/contact"
                cta="Get in touch"
                image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                imageAlt=""
              />
            </FadeUp>
            <FadeUp delay={300} className="h-full">
              <ServiceCard
                title="Compass"
                body="Full-service relocation management for clients moving to or from Toronto."
                bullets={["End-to-end coordination", "Cross-border expertise", "One point of contact"]}
                href="/compass"
                cta="Explore Compass"
                image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                imageAlt=""
              />
            </FadeUp>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="bg-[var(--background)]">
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

            <FadeUp className="mt-10 grid gap-6 md:grid-cols-3">
              {featured.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </FadeUp>

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
      )}

      <SectionDivider />

      {/* GOOGLE REVIEWS */}
      <section className="bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                What clients say
              </h2>
              <p className="mt-2 text-[var(--muted)]">
                Real reviews from Google. Toronto & GTA buyers and sellers.
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
              <FadeUp key={i} delay={Math.min(i * 80, 400)} className="h-full">
              <article
                className="flex h-full flex-col rounded-2xl border border-white/[0.12] bg-[var(--surface)] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
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
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[var(--background)] overflow-hidden">
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
          <FadeUp>
          <div className="rounded-2xl border border-white/[0.12] bg-[var(--surface)] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.5)] md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
                  Ready to talk?
                </h2>
                <p className="mt-3 text-[var(--muted)]">
                  Share your timeline and goals and we'll outline next steps.
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
          </FadeUp>

          {/* Join Our Network / Newsletter */}
          <FadeUp delay={100}>
          <div className="mt-16 rounded-3xl border border-white/[0.12] bg-[var(--surface)] p-10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] md:p-14 lg:p-16">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
              <div className="max-w-lg">
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl lg:text-4xl">
                  Join our network
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
                  Get market insights, new listings, and updates from Yorksell. No spam, we send only what's useful.
                </p>
              </div>
              <JoinNetworkForm />
            </div>
          </div>
          </FadeUp>
        </div>
      </section>
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
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-[var(--surface)] shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
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
