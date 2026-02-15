import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Yorksell",
  description:
    "Get in touch with Yorksell Real Estate Group. Toronto & GTA — buying, selling, investing.",
  openGraph: {
    title: "Contact | Yorksell Real Estate Group",
    description: "Toronto & GTA. We're here to help with your real estate goals.",
  },
};

type SearchParams = { listing?: string };
type PageProps = { searchParams: Promise<SearchParams> | SearchParams };

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2600&q=80";

/** Update these to your real contact details. */
const CONTACT = {
  phone: "+1 (416) 487-4311",
  address: "Toronto & Greater Toronto Area",
  email: "info@yorksell.com",
};

export default async function ContactPage({ searchParams }: PageProps) {
  const params = await (typeof (searchParams as Promise<SearchParams>).then === "function"
    ? (searchParams as Promise<SearchParams>)
    : Promise.resolve(searchParams as SearchParams));

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
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
            Contact
          </h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">
            Get in touch — we&apos;re here to help with buying, selling, or investing in the GTA.
          </p>
        </div>
      </header>

      {/* Phone & address section */}
      <section className="border-t border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
            Reach us
          </h2>
          <p className="mt-1 text-[var(--muted)]">
            Call, visit, or send a message — we&apos;ll get back to you soon.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition hover:border-white/10"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <div>
                <p className="font-medium text-[var(--foreground)]">Phone</p>
                <p className="mt-1 text-[var(--muted)] group-hover:text-[var(--foreground)]">
                  {CONTACT.phone}
                </p>
              </div>
            </a>
            <div className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <div>
                <p className="font-medium text-[var(--foreground)]">Area</p>
                <p className="mt-1 text-[var(--muted)]">{CONTACT.address}</p>
              </div>
            </div>
            <a
              href={`mailto:${CONTACT.email}`}
              className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition hover:border-white/10"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <div>
                <p className="font-medium text-[var(--foreground)]">Email</p>
                <p className="mt-1 text-[var(--muted)] group-hover:text-[var(--foreground)] break-all">
                  {CONTACT.email}
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="border-t border-white/[0.06] bg-[var(--background)]">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
          <ContactForm initialListing={params.listing ?? null} />
        </div>
      </section>
    </main>
  );
}
