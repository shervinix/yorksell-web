"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!userMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick, true);
    };
  }, [userMenuOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick, true);
    };
  }, [servicesOpen]);

  const navTransparent = isHome && !scrolled;
  const linkClass = navTransparent
    ? "rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
    : "rounded-lg px-3 py-2 text-sm text-[var(--foreground)]/80 transition hover:bg-white/10 hover:text-[var(--foreground)]";
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
            {/* Logo: add your image as public/logo.png (or use /logo.svg and add public/logo.svg) */}
            <Link href="/" className="flex shrink-0 items-center" aria-label="Yorksell Real Estate Group – Home">
              <img
                src="/logo.png"
                alt="Yorksell Real Estate Group"
                className="h-10 w-auto object-contain object-left sm:h-12"
                width={160}
                height={40}
              />
            </Link>

            {/* Desktop nav - centered, spaced out; hidden on mobile (hamburger shown instead) */}
            <nav className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-8" aria-label="Main">
              <Link href="/" className={linkClass}>
                Home
              </Link>
              <Link href="/listings" className={linkClass}>
                Listings
              </Link>
              <Link href="/listings/ours" className={linkClass}>
                Our Listings
              </Link>
              <div className="relative" ref={servicesRef}>
                <button
                  type="button"
                  onClick={() => setServicesOpen((o) => !o)}
                  className={
                    linkClass +
                    " inline-flex items-center gap-0.5"
                  }
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  aria-label="Services menu"
                >
                  Services
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className={"h-4 w-4 shrink-0 transition " + (servicesOpen ? "rotate-180" : "")}
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {servicesOpen && (
                  <div
                    className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] py-1 shadow-xl"
                    role="menu"
                  >
                    <Link
                      href="/buy"
                      className="block px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-white/5"
                      role="menuitem"
                      onClick={() => setServicesOpen(false)}
                    >
                      Buy
                    </Link>
                    <Link
                      href="/sell"
                      className="block px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-white/5"
                      role="menuitem"
                      onClick={() => setServicesOpen(false)}
                    >
                      Sell
                    </Link>
                    <Link
                      href="/property-management"
                      className="block px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-white/5"
                      role="menuitem"
                      onClick={() => setServicesOpen(false)}
                    >
                      Property Management
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/about" className={linkClass}>
                About
              </Link>
              <Link href="/team" className={linkClass}>
                Team
              </Link>
              <Link href="/footprint" className={linkClass}>
                Footprint
              </Link>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              {status !== "loading" && (
                <>
                  {!session ? (
                    <div className="hidden items-center gap-2 md:flex">
                      <Link
                        href="/login"
                        className={
                          "rounded-lg px-3 py-2 text-sm font-medium transition " +
                          (navTransparent
                            ? "text-white/80 hover:bg-white/10 hover:text-white"
                            : "text-[var(--foreground)]/80 hover:bg-white/10 hover:text-[var(--foreground)]")
                        }
                      >
                        Log in
                      </Link>
                      <Link
                        href="/signup"
                        className={
                          "rounded-lg px-3 py-2 text-sm font-medium transition " +
                          (navTransparent
                            ? "text-white/80 hover:bg-white/10 hover:text-white"
                            : "text-[var(--foreground)]/80 hover:bg-white/10 hover:text-[var(--foreground)]")
                        }
                      >
                        Sign up
                      </Link>
                    </div>
                  ) : (
                    <div className="relative hidden md:block" ref={userMenuRef}>
                      <button
                        type="button"
                        onClick={() => setUserMenuOpen((o) => !o)}
                        className={
                          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition " +
                          (navTransparent
                            ? "text-white/80 hover:bg-white/10 hover:text-white"
                            : "text-[var(--foreground)]/80 hover:bg-white/10 hover:text-[var(--foreground)]")
                        }
                        aria-expanded={userMenuOpen}
                        aria-haspopup="true"
                        aria-label="Account menu"
                      >
                        <span className="max-w-[120px] truncate">
                          {session.user?.name ?? session.user?.email ?? "Account"}
                        </span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className={"h-4 w-4 shrink-0 transition " + (userMenuOpen ? "rotate-180" : "")}
                          aria-hidden
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {userMenuOpen && (
                        <div
                          className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] py-1 shadow-xl"
                          role="menu"
                        >
                          <Link
                            href="/members/profile"
                            className="block px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-white/5"
                            role="menuitem"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Profile &amp; settings
                          </Link>
                          <Link
                            href="/members"
                            className="block px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-white/5"
                            role="menuitem"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Members area
                          </Link>
                          <Link
                            href="/members/client-services"
                            className="block px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-white/5"
                            role="menuitem"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Client Services
                          </Link>
                          <button
                            type="button"
                            className="block w-full px-4 py-2.5 text-left text-sm text-[var(--foreground)] hover:bg-white/5"
                            role="menuitem"
                            onClick={() => {
                              setUserMenuOpen(false);
                              signOut({ callbackUrl: "/" });
                            }}
                          >
                            Sign out
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
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
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex shrink-0 items-center" aria-label="Yorksell Real Estate Group – Home">
              <img
                src="/logo.png"
                alt="Yorksell Real Estate Group"
                className="h-12 w-auto object-contain object-left"
                width={160}
                height={40}
              />
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
            <MobileNavLink href="/listings/ours" onClick={() => setMobileOpen(false)}>Our Listings</MobileNavLink>
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Services</p>
              <div className="mt-2 grid gap-2">
                <MobileNavLink href="/buy" onClick={() => setMobileOpen(false)}>Buy</MobileNavLink>
                <MobileNavLink href="/sell" onClick={() => setMobileOpen(false)}>Sell</MobileNavLink>
                <MobileNavLink href="/property-management" onClick={() => setMobileOpen(false)}>Property Management</MobileNavLink>
              </div>
            </div>
            <MobileNavLink href="/about" onClick={() => setMobileOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="/team" onClick={() => setMobileOpen(false)}>Team</MobileNavLink>
            <MobileNavLink href="/footprint" onClick={() => setMobileOpen(false)}>Footprint</MobileNavLink>
          </div>
          {status !== "loading" && (
            <div className="mt-4 border-t border-white/[0.06] pt-4">
              {!session ? (
                <div className="grid gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                  >
                    Log in
                    <span className="text-[var(--muted)]" aria-hidden>→</span>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                  >
                    Sign up
                    <span className="text-[var(--muted)]" aria-hidden>→</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                    Account
                  </p>
                  <MobileNavLink href="/members/profile" onClick={() => setMobileOpen(false)}>
                    Profile &amp; settings
                  </MobileNavLink>
                  <MobileNavLink href="/members" onClick={() => setMobileOpen(false)}>
                    Members area
                  </MobileNavLink>
                  <MobileNavLink href="/members/client-services" onClick={() => setMobileOpen(false)}>
                    Client Services
                  </MobileNavLink>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-[var(--surface)] px-4 py-3 text-left text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
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
