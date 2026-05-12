"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";

function getInitials(name?: string | null, email?: string | null): string {
  const str = name?.trim() || email?.trim() || "?";
  const parts = str.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return str[0].toUpperCase().slice(0, 2);
}

function UserAvatar({
  image,
  initials,
  size = "md",
}: {
  image?: string | null;
  initials: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? "h-12 w-12 text-base" : size === "md" ? "h-8 w-8 text-xs" : "h-6 w-6 text-[10px]";
  if (image) {
    return (
      <img
        src={image}
        alt=""
        className={`${dim} rounded-full object-cover border border-white/10`}
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <span className={`${dim} flex items-center justify-center rounded-full bg-[var(--accent)]/20 font-bold text-[var(--accent)]`}>
      {initials}
    </span>
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
  const [unreadCount, setUnreadCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Fetch unread message count when logged in
  useEffect(() => {
    if (!session) { setUnreadCount(0); return; }
    fetch("/api/members/unread")
      .then((r) => r.json())
      .then((d) => setUnreadCount(d.unread ?? 0))
      .catch(() => {});
  }, [session]);

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
      const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
      window.addEventListener("keydown", onKeyDown);
      return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKeyDown); };
    }
    document.body.style.overflow = "";
    return undefined;
  }, [mobileOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setUserMenuOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick, true);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("click", onClick, true); };
  }, [userMenuOpen]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setServicesOpen(false); };
    const onClick = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick, true);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("click", onClick, true); };
  }, [servicesOpen]);

  const navTransparent = !scrolled;
  const linkClass = navTransparent
    ? "rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
    : "rounded-lg px-3 py-2 text-sm text-[var(--foreground)]/80 transition hover:bg-white/10 hover:text-[var(--foreground)]";
  const barClass =
    "backdrop-blur-xl border border-white/[0.15] shadow-[0_2px_16px_rgba(0,0,0,0.3)] " +
    (navTransparent
      ? "bg-white/5"
      : "bg-[var(--surface-elevated)]/80 shadow-[0_4px_24px_rgba(0,0,0,0.35)]");
  const ctaPrimaryClass = "inline-flex h-10 items-center justify-center rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]";

  const initials = getInitials(session?.user?.name, session?.user?.email);
  const userImage = (session?.user as { image?: string | null })?.image ?? null;
  const userName = session?.user?.name ?? session?.user?.email ?? "Signed in";
  const userEmail = session?.user?.name ? session?.user?.email : null;

  // Active link helper
  function isActive(href: string) {
    if (href === "/members") return pathname === "/members";
    return pathname.startsWith(href);
  }

  const menuLinkClass = (href: string) =>
    "flex items-center justify-between px-4 py-2.5 text-sm transition-colors " +
    (isActive(href)
      ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
      : "text-[var(--foreground)] hover:bg-white/5");

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        <div className="flex flex-col w-full bg-gradient-to-b from-black/30 to-transparent">
          <div className="pointer-events-none h-5 w-full" aria-hidden="true" />
          <div className="flex w-full items-center px-4 pb-3 sm:px-6 sm:pb-4">
            <div className={
              "flex min-h-12 w-full items-center justify-between gap-4 rounded-2xl px-4 py-2.5 transition-all duration-300 sm:min-h-0 sm:px-6 " +
              barClass
            }>
              {/* Logo */}
              <Link href="/" className="flex shrink-0 items-center ml-2" aria-label="Yorksell Real Estate Group – Home">
                <img
                  src="/logo2.png"
                  alt="Yorksell Real Estate Group"
                  className="h-10 w-auto object-contain object-left sm:h-12"
                  width={160}
                  height={40}
                />
              </Link>

              {/* Desktop nav */}
              <nav className="hidden flex-1 items-center justify-center gap-6 xl:flex xl:gap-8" aria-label="Main">
                <Link href="/listings" className={linkClass}>Listings</Link>
                <div className="relative" ref={servicesRef}>
                  <button
                    type="button"
                    onClick={() => setServicesOpen((o) => !o)}
                    className={linkClass + " inline-flex items-center gap-0.5"}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                  >
                    Services
                    <svg viewBox="0 0 24 24" fill="none" className={"h-4 w-4 shrink-0 transition " + (servicesOpen ? "rotate-180" : "")} aria-hidden>
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {servicesOpen && (
                    <div className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] py-1 shadow-xl" role="menu">
                      {[
                        { href: "/buy", label: "Buy" },
                        { href: "/sell", label: "Sell" },
                        { href: "/property-management", label: "Property Management" },
                      ].map(({ href, label }) => (
                        <Link key={href} href={href} className="block px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-white/5" role="menuitem" onClick={() => setServicesOpen(false)}>
                          {label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link href="/about" className={linkClass}>About</Link>
                <Link href="/team" className={linkClass}>Team</Link>
                <Link href="/compass" className={linkClass}>Compass</Link>
                <Link href="/footprint" className={linkClass}>Footprint</Link>
                <Link href="/blog" className={linkClass}>Blog</Link>
              </nav>

              <div className="flex shrink-0 items-center gap-2">
                {/* Desktop user menu */}
                {status !== "loading" && (
                  <div className="relative hidden xl:block" ref={userMenuRef}>
                    {/* Trigger button */}
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen((o) => !o)}
                      className={
                        "relative inline-flex h-10 w-10 items-center justify-center rounded-xl transition " +
                        (session
                          ? "border border-white/20 bg-white/10 hover:bg-white/15"
                          : navTransparent
                          ? "border border-white/10 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white"
                          : "border border-white/10 bg-white/5 text-[var(--foreground)]/85 hover:bg-white/10 hover:text-[var(--foreground)]")
                      }
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                      aria-label="Profile menu"
                    >
                      {session ? (
                        userImage ? (
                          <img src={userImage} alt="" className="h-full w-full rounded-xl object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-xs font-bold leading-none text-white">{initials}</span>
                        )
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                          <path d="M15 7a3 3 0 11-6 0 3 3 0 016 0Zm-8 11a5 5 0 1110 0v1H7v-1Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {/* Unread badge */}
                      {session && unreadCount > 0 && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-[var(--background)] bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Dropdown */}
                    {userMenuOpen && (
                      <div
                        className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
                        role="menu"
                      >
                        {session ? (
                          <>
                            {/* Profile card header */}
                            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
                              <UserAvatar image={userImage} initials={initials} size="lg" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[var(--foreground)]">{userName}</p>
                                {userEmail && (
                                  <p className="truncate text-xs text-[var(--muted)]">{userEmail}</p>
                                )}
                                <span className="mt-1 inline-flex items-center rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]">
                                  Member
                                </span>
                              </div>
                            </div>

                            {/* Nav links */}
                            <div className="py-1">
                              <Link
                                href="/members"
                                className={menuLinkClass("/members")}
                                role="menuitem"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <span className="flex items-center gap-2.5">
                                  <svg className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                  </svg>
                                  Members area
                                </span>
                                {isActive("/members") && <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
                              </Link>

                              <Link
                                href="/members/client-services"
                                className={menuLinkClass("/members/client-services")}
                                role="menuitem"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <span className="flex items-center gap-2.5">
                                  <svg className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                                  </svg>
                                  Client Services
                                </span>
                                {unreadCount > 0 ? (
                                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                  </span>
                                ) : isActive("/members/client-services") ? (
                                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                                ) : null}
                              </Link>

                              <Link
                                href="/members/profile"
                                className={menuLinkClass("/members/profile")}
                                role="menuitem"
                                onClick={() => setUserMenuOpen(false)}
                              >
                                <span className="flex items-center gap-2.5">
                                  <svg className="h-4 w-4 shrink-0 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                  </svg>
                                  Profile &amp; settings
                                </span>
                                {isActive("/members/profile") && <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
                              </Link>
                            </div>

                            {/* Sign out — separated */}
                            <div className="border-t border-white/[0.06] py-1">
                              <button
                                type="button"
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--muted)] transition hover:bg-red-500/10 hover:text-red-400"
                                role="menuitem"
                                onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                              >
                                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                </svg>
                                Sign out
                              </button>
                            </div>
                          </>
                        ) : (
                          /* Logged-out state */
                          <div className="p-3 space-y-2">
                            <Link
                              href="/login"
                              className="flex items-center justify-center rounded-xl border border-white/[0.1] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/5"
                              role="menuitem"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Log in
                            </Link>
                            <Link
                              href="/signup"
                              className="flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
                              role="menuitem"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Create account
                            </Link>
                            <p className="text-center text-[10px] text-[var(--muted)]/60">
                              Free to join · No commitment
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Hamburger */}
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className={
                    "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl xl:hidden " +
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
                  {/* Unread dot on hamburger for mobile */}
                  {session && unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--background)] bg-red-500" />
                  )}
                </button>

                <Link href="/contact" className={"hidden h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold xl:inline-flex " + ctaPrimaryClass}>
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="site-mobile-menu"
        className={mobileOpen ? "fixed inset-0 z-50 xl:hidden" : "hidden"}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="absolute inset-0 h-full w-full bg-black/60" />
        <div className="absolute right-0 top-0 h-full w-[min(86vw,22rem)] max-w-sm overflow-y-auto bg-[var(--surface-elevated)] shadow-2xl border-l border-white/[0.06]">

          {/* Mobile drawer header */}
          <div className="flex items-center justify-between gap-4 px-5 pt-5">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex shrink-0 items-center" aria-label="Yorksell Real Estate Group – Home">
              <img src="/logo2.png" alt="Yorksell Real Estate Group" className="h-12 w-auto object-contain object-left" width={160} height={40} />
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

          {/* Mobile account section */}
          {status !== "loading" && (
            <div className="mx-5 mt-5">
              {session ? (
                <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface)] p-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar image={userImage} initials={initials} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--foreground)]">{userName}</p>
                      {userEmail && <p className="truncate text-xs text-[var(--muted)]">{userEmail}</p>}
                    </div>
                  </div>
                  <div className="mt-3 grid gap-1.5">
                    <MobileNavLink href="/members" onClick={() => setMobileOpen(false)}>Members area</MobileNavLink>
                    <Link
                      href="/members/client-services"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                    >
                      <span>Client Services</span>
                      <span className="flex items-center gap-2 text-[var(--muted)]">
                        {unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                        →
                      </span>
                    </Link>
                    <MobileNavLink href="/members/profile" onClick={() => setMobileOpen(false)}>Profile &amp; settings</MobileNavLink>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2 rounded-xl border border-white/[0.06] bg-[var(--surface)] px-4 py-3 text-left text-sm font-medium text-red-400 hover:bg-red-500/10"
                      onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                    >
                      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-white/[0.1] px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
                  >
                    Create account
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile nav links */}
          <div className="mx-5 mt-5 grid gap-2 border-t border-white/[0.06] pt-5">
            <MobileNavLink href="/listings" onClick={() => setMobileOpen(false)}>Listings</MobileNavLink>
            <div className="px-1 py-1">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Services</p>
              <div className="grid gap-2">
                <MobileNavLink href="/buy" onClick={() => setMobileOpen(false)}>Buy</MobileNavLink>
                <MobileNavLink href="/sell" onClick={() => setMobileOpen(false)}>Sell</MobileNavLink>
                <MobileNavLink href="/property-management" onClick={() => setMobileOpen(false)}>Property Management</MobileNavLink>
              </div>
            </div>
            <MobileNavLink href="/about" onClick={() => setMobileOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="/team" onClick={() => setMobileOpen(false)}>Team</MobileNavLink>
            <MobileNavLink href="/compass" onClick={() => setMobileOpen(false)}>Compass</MobileNavLink>
            <MobileNavLink href="/footprint" onClick={() => setMobileOpen(false)}>Footprint</MobileNavLink>
            <MobileNavLink href="/blog" onClick={() => setMobileOpen(false)}>Blog</MobileNavLink>
          </div>

          <div className="mx-5 my-6 grid gap-3 border-t border-white/[0.06] pt-6">
            <Link href="/listings" onClick={() => setMobileOpen(false)} className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5">
              Listings
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]">
              Contact
            </Link>
          </div>
          <p className="px-5 pb-6 text-xs text-[var(--muted)]">Toronto & GTA</p>
        </div>
      </div>
    </>
  );
}
