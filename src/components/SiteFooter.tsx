import Link from "next/link";
import BrokerageLogo from "./BrokerageLogo";

const CONTACT = {
  phone: "+1 (416) 639-2353",
  email: "info@yorksell.com",
  address: "4101 Yonge St, Suite 502\nToronto, ON M2P 1N6",
};

const SOCIAL = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/yorksell",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/yorksell",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@YorksellGroup",
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const SERVICES = [
  { href: "/buy", label: "Buy" },
  { href: "/sell", label: "Sell" },
  { href: "/compass", label: "Compass" },
  { href: "/listings", label: "Listings" },
  { href: "/footprint", label: "Footprint" },
];

const COMPANY = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/join", label: "Join Yorksell" },
];

const linkClass =
  "group inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">

        {/* Main grid: brand + links */}
        <div className="flex flex-col gap-10 sm:flex-row sm:gap-12 lg:gap-20">

          {/* Brand column */}
          <div className="shrink-0 sm:w-56 lg:w-64">
            <img
              src="/logo2.png"
              alt="Yorksell Real Estate Group"
              className="h-12 w-auto object-contain object-left"
              width={180}
              height={48}
            />
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              Real estate across Toronto and the GTA. Clear process, honest advice, no noise.
            </p>

            {/* Contact details */}
            <div className="mt-5 flex flex-col gap-1.5">
              <a
                href={`tel:${CONTACT.phone.replace(/\D/g, "")}`}
                className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                {CONTACT.email}
              </a>
              <p className="text-sm text-[var(--muted)]/70 whitespace-pre-line leading-snug mt-0.5">
                {CONTACT.address}
              </p>
            </div>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-2.5">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-white/30 transition hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid flex-1 grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Services
              </h3>
              <ul className="mt-4 space-y-2.5">
                {SERVICES.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className={linkClass}>
                      <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Company
              </h3>
              <ul className="mt-4 space-y-2.5">
                {COMPANY.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className={linkClass}>
                      <span className="transition-transform duration-150 group-hover:translate-x-0.5">
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Brokerage disclosure */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:gap-6">
          {/* Brokerage logo — drop brokerage-logo.png into /public to activate */}
          <BrokerageLogo />
          <p className="text-xs leading-relaxed text-white/25">
            Yorksell Real Estate Group is a team operating under ROYAL LEPAGE REAL ESTATE SERVICES LTD. brokerage in Ontario. Not intended to solicit buyers or sellers already under contract. All information deemed reliable but not guaranteed.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.04] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Yorksell Real Estate Group. Toronto &amp; GTA.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-xs text-white/25">
            <Link href="/privacy" className="transition hover:text-white/50">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white/50">
              Terms
            </Link>
            {/* Staff-only — intentionally low visibility */}
            <Link
              href="/login?callbackUrl=/admin"
              className="transition hover:text-white/40"
              tabIndex={-1}
            >
              Staff login
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
