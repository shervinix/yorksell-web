"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
    >
      <span>{children}</span>
      <span className="text-[var(--muted)]" aria-hidden>→</span>
    </Link>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
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
    document.body.style.overflow = "";
    return undefined;
  }, [mobileOpen]);

  const navTransparent = isHome && !scrolled;
  const linkClass = navTransparent
    ? "rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
    : "rounded-lg px-3 py-2 text-sm text-[var(--foreground)]/80 transition hover:bg-white/10 hover:text-[var(--foreground)]";
  const logoTextClass = navTransparent ? "text-white" : "text-[var(--foreground)]";
  const logoSubClass = navTransparent ? "text-white/60" : "text-[var(--muted)]";
  // Glass bar: semi-transparent, backdrop blur, content scrolls underneath
  const barClass =
    "backdrop-blur-xl border border-white/[0.08] " +
    (navTransparent
      ? "bg-white/5 shadow-none"
      : "bg-[var(--surface-elevated)]/70 shadow-[0_4px_24px_rgba(0,0,0,0.25)]");
  const ctaBorderClass = navTransparent ? "border-white/10" : "border-white/10";
  const ctaPrimaryClass = "inline-flex h-10 items-center justify-center rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]";

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        <div className="flex w-full items-center px-4 py-3 sm:px-6 sm:py-4">
          <div
            className={
              "flex min-h-12 w-full items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-300 sm:min-h-0 sm:px-6 " +
              barClass
            }
          >
            <Link href="/" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
              <span
                className={
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-10 sm:w-10 " +
                  (navTransparent ? "bg-white/10 text-white ring-white/10" : "bg-white/10 text-[var(--foreground)] ring-white/10")
                }
              >
                <span className="text-sm font-semibold tracking-tight">Y</span>
              </span>
              <div className="leading-tight min-w-0">
                <div className={"truncate text-sm font-semibold tracking-tight " + logoTextClass}>
                  Yorksell
                </div>
                <div className={"truncate text-[11px] " + logoSubClass}>Real Estate Group</div>
              </div>
            </Link>

            {/* Desktop nav - centered, spaced out; hidden on mobile (hamburger shown instead) */}
            <nav className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-8" aria-label="Main">
              <Link href="/" className={linkClass}>
                Home
              </Link>
              <Link href="/listings" className={linkClass}>
                Listings
              </Link>
              <Link href="/about" className={linkClass}>
                About
              </Link>
              <Link href="/footprint" className={linkClass}>
                Footprint
              </Link>
              <Link href="/contact" className={linkClass}>
                Contact
              </Link>
              <Link href="/members" className={linkClass}>
                Members
              </Link>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className={
                  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl md:hidden " +
                  (navTransparent
                    ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                    : "border border-white/10 bg-white/5 text-[var(--foreground)] hover:bg-white/10")
                }
                aria-label="Open menu"
                aria-controls="site-mobile-menu"
                aria-expanded={mobileOpen}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                  <path d="M5 7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M5 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              <Link href="/contact" className={"hidden h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold md:inline-flex " + ctaPrimaryClass}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <div
        id="site-mobile-menu"
        className={mobileOpen ? "fixed inset-0 z-50 md:hidden" : "hidden"}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="absolute inset-0 h-full w-full bg-black/60"
        />
        <div className="absolute right-0 top-0 h-full w-[min(86vw,22rem)] max-w-sm overflow-y-auto bg-[var(--surface-elevated)] p-5 shadow-2xl border-l border-white/[0.06]">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 min-w-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                <span className="text-sm font-semibold">Y</span>
              </span>
              <div className="leading-tight min-w-0">
                <div className="text-sm font-semibold text-[var(--foreground)] truncate">Yorksell</div>
                <div className="text-[11px] text-[var(--muted)]">Real Estate Group</div>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-[var(--foreground)] hover:bg-white/5"
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="mt-6 grid gap-2">
            <MobileNavLink href="/" onClick={() => setMobileOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="/listings" onClick={() => setMobileOpen(false)}>Listings</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setMobileOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="/footprint" onClick={() => setMobileOpen(false)}>Footprint</MobileNavLink>
            <MobileNavLink href="/contact" onClick={() => setMobileOpen(false)}>Contact</MobileNavLink>
            <MobileNavLink href="/members" onClick={() => setMobileOpen(false)}>Members</MobileNavLink>
          </div>
          <div className="mt-6 grid gap-3 border-t border-white/[0.06] pt-6">
            <Link
              href="/listings"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
            >
              Listings
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
            >
              Contact
            </Link>
          </div>
          <p className="mt-6 text-xs text-[var(--muted)]">Toronto & GTA</p>
        </div>
      </div>
    </>
  );
}
