import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { SavedListingCard } from "./SavedListingCard";
import { WelcomeBanner } from "./WelcomeBanner";

function formatPrice(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value) || value <= 0) return "Contact";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px w-6 bg-[var(--accent)]" />
      <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        {children}
      </h2>
    </div>
  );
}

export default async function MembersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/members");

  const userId = session.user?.id as string;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, image: true, createdAt: true },
  });

  const displayName = user?.name ?? session.user?.name ?? session.user?.email ?? "Member";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "long" })
    : null;

  // ── Client data (stage, agent, appointments, unread messages) ──
  const clientRecord = await prisma.client.findUnique({
    where: { userId },
    select: {
      stage: true,
      agentName: true,
      agentTitle: true,
      agentPhone: true,
      agentEmail: true,
      showMessages: true,
      showAppointments: true,
      appointments: {
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
        take: 1,
      },
      messages: {
        where: { fromAgent: true, readAt: null },
        select: { id: true },
      },
    },
  }).catch(() => null);

  const nextAppointment = clientRecord?.appointments[0] ?? null;
  const unreadCount = clientRecord?.messages.length ?? 0;

  // Appointment within 7 days?
  const apptSoonMs = nextAppointment
    ? new Date(nextAppointment.date).getTime() - Date.now()
    : null;
  const apptIsSoon = apptSoonMs !== null && apptSoonMs > 0 && apptSoonMs < 7 * 24 * 60 * 60 * 1000;

  // ── Saved listings ──
  let savedRows: Array<{
    listing: {
      id: string;
      mlsNumber: string | null;
      ddfId: string;
      addressLine: string | null;
      city: string | null;
      province: string | null;
      price: number | null;
      beds: number | null;
      baths: number | null;
      propertyType: string | null;
      photoUrl: string | null;
    } | null;
  }> = [];
  try {
    savedRows = await prisma.savedListing.findMany({
      where: { userId },
      include: {
        listing: {
          select: {
            id: true,
            mlsNumber: true,
            ddfId: true,
            addressLine: true,
            city: true,
            province: true,
            price: true,
            beds: true,
            baths: true,
            propertyType: true,
            photoUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    savedRows = [];
  }

  const savedListings = savedRows
    .map((s) => {
      const l = s.listing;
      if (!l) return null;
      const key = (l.mlsNumber && l.mlsNumber.trim()) || (l.ddfId && l.ddfId.trim()) || l.id;
      const href = `/listings/${encodeURIComponent(key)}`;
      const title =
        (l.addressLine && l.addressLine.trim()) ||
        (l.propertyType && l.propertyType.trim()) ||
        (l.mlsNumber && l.mlsNumber.trim()) ||
        (l.ddfId && `Listing ${l.ddfId}`) ||
        "Listing";
      const location = [l.city, l.province].filter(Boolean).join(", ") || "Toronto, ON";
      const meta =
        [l.beds != null && `${l.beds} Bed`, l.baths != null && `${l.baths} Bath`]
          .filter(Boolean)
          .join(" • ") ||
        (l.propertyType && l.propertyType.trim()) ||
        "MLS listing";
      const image =
        (l.photoUrl && l.photoUrl.trim()) ||
        (l.mlsNumber ? `/api/listings/photo?mlsNumber=${encodeURIComponent(l.mlsNumber)}` : null) ||
        (l.ddfId ? `/api/listings/photo?ddfId=${encodeURIComponent(l.ddfId)}` : null) ||
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80";
      return { id: l.id, href, title, price: formatPrice(l.price), meta, location, image };
    })
    .filter(Boolean) as { id: string; href: string; title: string; price: string; meta: string; location: string; image: string }[];

  // ── Leads ──
  type LeadWithListing = Awaited<ReturnType<typeof prisma.lead.findMany>>[number] & {
    listing: { id: string; mlsNumber: string | null; ddfId: string; addressLine: string | null } | null;
  };
  let myLeads: LeadWithListing[] = [];
  try {
    myLeads = (await prisma.lead.findMany({
      where: { userId },
      include: {
        listing: { select: { id: true, mlsNumber: true, ddfId: true, addressLine: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })) as LeadWithListing[];
  } catch {
    myLeads = [];
  }

  const sourceLabel: Record<string, string> = {
    listing_contact: "Listing inquiry",
    contact_page: "Contact form",
    home_cta: "Home page",
    buy_page: "Buy page",
    sell_page: "Sell page",
    property_management_page: "Property Management",
    newsletter: "Newsletter signup",
    join_page: "Join Yorksell",
  };

  // ── Quick links ──
  const quickLinks = [
    {
      href: "/members/profile",
      label: "Profile & settings",
      desc: "Update your info and password",
      badge: null,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
    {
      href: "/listings",
      label: "Browse listings",
      desc: "Explore Toronto & GTA",
      badge: null,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
    },
    {
      href: "/members/client-services",
      label: "Client Services",
      desc: "Your full transaction portal",
      badge: unreadCount > 0 ? unreadCount : null,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
        </svg>
      ),
    },
    {
      href: "/contact",
      label: "Contact us",
      desc: "Get in touch with the team",
      badge: null,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-16">

        {/* ── Welcome banner (client component for greeting + sign out) ── */}
        <WelcomeBanner
          displayName={displayName}
          initials={initials}
          image={user?.image ?? null}
          memberSince={memberSince}
          agentName={clientRecord?.agentName ?? null}
        />

        {/* ── Upcoming appointment alert ── */}
        {apptIsSoon && nextAppointment && (
          <Link
            href="/members/client-services"
            className="mt-4 flex items-center gap-4 rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/8 px-5 py-4 transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/12"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15">
              <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Upcoming appointment</p>
              <p className="mt-0.5 font-medium text-[var(--foreground)]">{nextAppointment.title}</p>
              <p className="text-sm text-[var(--muted)]">
                {new Date(nextAppointment.date).toLocaleDateString("en-CA", {
                  weekday: "long", month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
            <svg className="h-4 w-4 shrink-0 text-[var(--accent)]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        )}

        {/* ── Transaction status card ── */}
        {clientRecord && (clientRecord.stage || unreadCount > 0 || nextAppointment) && (
          <Link
            href="/members/client-services"
            className="group mt-4 flex items-center gap-4 rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] px-5 py-4 shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition hover:border-white/[0.12]"
          >
            <div className="min-w-0 flex-1 space-y-2">
              {clientRecord.stage && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Stage</span>
                  <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
                    {clientRecord.stage}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {unreadCount > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
                    <span className="flex h-2 w-2 rounded-full bg-red-500" />
                    {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
                  </span>
                )}
                {nextAppointment && !apptIsSoon && (
                  <span className="text-sm text-[var(--muted)]">
                    Next appt:{" "}
                    {new Date(nextAppointment.date).toLocaleDateString("en-CA", {
                      month: "short", day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
            <span className="shrink-0 text-xs font-medium text-[var(--accent)] group-hover:underline">
              View portal →
            </span>
          </Link>
        )}

        {/* ── Quick links ── */}
        <section className="mt-8">
          <SectionLabel>Quick links</SectionLabel>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((ql) => (
              <Link
                key={ql.href}
                href={ql.href}
                className="relative flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition hover:border-white/[0.12] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              >
                {/* Unread badge */}
                {ql.badge !== null && (
                  <span className="absolute right-3 top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {ql.badge}
                  </span>
                )}
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                  {ql.icon}
                </span>
                <div>
                  <span className="block font-medium text-[var(--foreground)]">{ql.label}</span>
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">{ql.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Saved properties ── */}
        <section className="mt-10">
          <SectionLabel>
            <>
              Saved properties
              {savedListings.length > 0 && (
                <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--foreground)]">
                  {savedListings.length}
                </span>
              )}
            </>
          </SectionLabel>
          {savedListings.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05]">
                <svg className="h-6 w-6 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <p className="text-[var(--muted)]">No saved properties yet.</p>
              <p className="mt-1 text-sm text-[var(--muted)]/60">Heart a listing to save it here.</p>
              <Link
                href="/listings"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
              >
                Browse listings
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedListings.map((l) => (
                <SavedListingCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </section>

        {/* ── Your inquiries (hidden when empty) ── */}
        {myLeads.length > 0 && (
          <section className="mt-10 pb-10">
            <SectionLabel>
              <>
                Your inquiries
                <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--foreground)]">
                  {myLeads.length}
                </span>
              </>
            </SectionLabel>
            <ul className="space-y-3">
              {myLeads.map((lead) => {
                const isRecent = Date.now() - new Date(lead.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
                return (
                  <li
                    key={lead.id}
                    className="rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                          {sourceLabel[lead.source] ?? lead.source}
                        </span>
                        {isRecent && (
                          <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                            New
                          </span>
                        )}
                        <span className="text-xs text-[var(--muted)]/60">
                          {new Date(lead.createdAt).toLocaleDateString("en-CA", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </span>
                      </div>
                      {lead.listing && (
                        <Link
                          href={`/listings/${encodeURIComponent(lead.listing.mlsNumber ?? lead.listing.ddfId ?? lead.listing.id)}`}
                          className="text-sm font-medium text-[var(--accent)] hover:underline"
                        >
                          {lead.listing.addressLine ?? `Listing ${lead.listing.mlsNumber ?? lead.listing.ddfId}`}
                        </Link>
                      )}
                    </div>
                    {lead.message && (
                      <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{lead.message}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

      </div>
    </main>
  );
}
