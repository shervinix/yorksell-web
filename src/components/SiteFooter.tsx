import Link from "next/link";

const CONTACT = {
  phone: "+1 (416) 487-4311",
  email: "info@yorksell.com",
};

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.1] bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2">
            <img
              src="/logo.png"
              alt="Yorksell Real Estate Group"
              className="h-10 w-auto object-contain object-left"
              width={160}
              height={40}
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
              Real estate across Toronto and the GTA. Clear process, honest advice, no noise.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
              <a
                href={`tel:${CONTACT.phone.replace(/\D/g, "")}`}
                className="transition hover:text-[var(--foreground)]"
              >
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="transition hover:text-[var(--foreground)]"
              >
                {CONTACT.email}
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/buy", label: "Buy" },
                { href: "/sell", label: "Sell" },
                { href: "/compass", label: "Compass" },
                { href: "/listings", label: "Listings" },
                { href: "/footprint", label: "Footprint" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "/about", label: "About" },
                { href: "/team", label: "Team" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
                { href: "/join", label: "Join Yorksell" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[var(--muted)] transition hover:text-[var(--foreground)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} Yorksell Real Estate Group. Toronto &amp; GTA.
          </p>
          <div className="flex flex-wrap gap-5 text-xs text-[var(--muted)]">
            <Link href="/privacy" className="transition hover:text-[var(--foreground)]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[var(--foreground)]">
              Terms
            </Link>
            <Link
              href="/login?callbackUrl=/admin"
              className="transition hover:text-[var(--foreground)]"
            >
              Yorksell Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
