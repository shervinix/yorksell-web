import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Yorksell",
  description:
    "Get in touch with Yorksell Real Estate Group. Toronto & GTA. Buying, selling, investing.",
  openGraph: {
    title: "Contact | Yorksell Real Estate Group",
    description: "Toronto & GTA. We're here to help with your real estate goals.",
  },
};

type SearchParams = { listing?: string };
type PageProps = { searchParams: Promise<SearchParams> | SearchParams };

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2600&q=80";

const CONTACT = {
  phone: "+1 (416) 639-2353",
  address: "4101 Yonge St, Suite 502, Toronto, ON M2P 1N6",
  email: "info@yorksell.com",
};

const SOCIAL = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/yorksell",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/yorksell",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@YorksellGroup",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default async function ContactPage({ searchParams }: PageProps) {
  const params = await (typeof (searchParams as Promise<SearchParams>).then === "function"
    ? (searchParams as Promise<SearchParams>)
    : Promise.resolve(searchParams as SearchParams));

  // Pre-fill from session if logged in
  const session = await getServerSession(authOptions);
  let prefill: { name: string; email: string; phone: string } = { name: "", email: "", phone: "" };
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { name: true, email: true, phone: true },
    }).catch(() => null);
    prefill = {
      name: user?.name ?? session.user.name ?? "",
      email: user?.email ?? session.user.email ?? "",
      phone: user?.phone ?? "",
    };
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <header className="relative -mt-[6.5rem] min-h-[46vh] overflow-hidden pt-[6.5rem]">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/50 to-black/85" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-end px-4 pb-14 pt-4 sm:px-6 md:pb-20">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
            Let&apos;s talk
          </h1>
          <p className="mt-3 text-lg text-white/85 whitespace-nowrap">
            Whether you&apos;re buying, selling, or investing in the GTA, we&apos;re ready to help.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium text-white/90">Typically respond within one business day</span>
          </div>
        </div>
      </header>

      {/* Main content — two-column at lg */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">

          {/* ── Left column: contact info + social ── */}
          <div className="space-y-10">
            {/* Contact cards */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Get in touch</h2>
              <div className="mt-4 space-y-3">
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.12)] transition hover:border-white/10"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Phone</p>
                    <p className="mt-0.5 font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                      {CONTACT.phone}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${CONTACT.email}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.12)] transition hover:border-white/10"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Email</p>
                    <p className="mt-0.5 font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors break-all">
                      {CONTACT.email}
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Area</p>
                    <p className="mt-0.5 font-medium text-[var(--foreground)]">{CONTACT.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response time */}
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Office hours</p>
              <div className="mt-3 space-y-1.5 text-sm text-[var(--foreground)]">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Monday – Friday</span>
                  <span>9:00 am – 9:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Saturday</span>
                  <span>9:00 am – 5:00 pm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Sunday</span>
                  <span>10:00 am – 4:00 pm</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-[var(--muted)]/70">
                All times Eastern. Messages sent outside hours will be answered the next business day.
              </p>
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Follow us</p>
              <div className="mt-4 flex gap-3">
                {SOCIAL.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] text-[var(--muted)] shadow-[0_4px_24px_rgba(0,0,0,0.12)] transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column: form ── */}
          <div>
            <ContactForm initialListing={params.listing ?? null} prefill={prefill} />
          </div>
        </div>
      </div>
    </main>
  );
}
