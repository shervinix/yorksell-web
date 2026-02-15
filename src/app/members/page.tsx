import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/server/db/prisma";

function formatPrice(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value) || value <= 0) return "Contact";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function MembersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/members");
  }

  const displayName = session.user?.name ?? session.user?.email ?? "Member";

  const userId = session.user?.id as string;

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
    if (prisma.savedListing) {
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
    }
  } catch {
    savedRows = [];
  }

  const savedListings = savedRows.map((s) => {
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
    return {
      id: l.id,
      href,
      title,
      price: formatPrice(l.price),
      meta,
      location,
      image,
    };
  }).filter(Boolean) as { id: string; href: string; title: string; price: string; meta: string; location: string; image: string }[];

  type LeadWithListing = Awaited<ReturnType<typeof prisma.lead.findMany>>[number] & {
    listing: { id: string; mlsNumber: string | null; ddfId: string; addressLine: string | null } | null;
  };
  let myLeads: LeadWithListing[] = [];
  try {
    myLeads = await prisma.lead.findMany({
      where: { userId },
      include: {
        listing: {
          select: { id: true, mlsNumber: true, ddfId: true, addressLine: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }) as LeadWithListing[];
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

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-16">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Members Area
        </h1>

        {/* Welcome */}
        <section className="mt-8 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)] md:p-8">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Welcome back, {displayName}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Your dashboard for saved properties, inquiries, and account settings.
          </p>
        </section>

        {/* Quick links */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Quick links
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/members/profile"
              className="flex flex-col rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition hover:border-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <span className="font-medium text-[var(--foreground)]">Profile &amp; settings</span>
              <span className="mt-1 text-xs text-[var(--muted)]">Update your info and password</span>
            </Link>
            <Link
              href="/listings"
              className="flex flex-col rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition hover:border-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <span className="font-medium text-[var(--foreground)]">View all listings</span>
              <span className="mt-1 text-xs text-[var(--muted)]">Browse Toronto &amp; GTA</span>
            </Link>
            <Link
              href="/members/client-services"
              className="flex flex-col rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition hover:border-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <span className="font-medium text-[var(--foreground)]">Client Services</span>
              <span className="mt-1 text-xs text-[var(--muted)]">Files, stats, notes, and updates</span>
            </Link>
            <Link
              href="/contact"
              className="flex flex-col rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition hover:border-white/10 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
            >
              <span className="font-medium text-[var(--foreground)]">Contact us</span>
              <span className="mt-1 text-xs text-[var(--muted)]">Get in touch with the team</span>
            </Link>
          </div>
        </section>

        {/* Saved properties */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Saved properties
          </h2>
          {savedListings.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
              <p className="text-[var(--muted)]">No saved properties yet.</p>
              <Link
                href="/listings"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
              >
                Browse listings
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {savedListings.map((l) => (
                <article
                  key={l.id}
                  className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
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
                    <div className="p-4">
                      <h3 className="font-semibold text-[var(--foreground)]">{l.title}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">{l.meta}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">{l.location}</p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
                        View details
                        <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Your inquiries */}
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Your inquiries
          </h2>
          {myLeads.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 text-center shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
              <p className="text-sm text-[var(--muted)]">No inquiries yet. When you contact us or inquire about a listing while logged in, they’ll appear here.</p>
              <Link
                href="/contact"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
              >
                Contact us
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {myLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                        {sourceLabel[lead.source] ?? lead.source}
                      </span>
                      <span className="ml-2 text-xs text-[var(--muted)]">
                        {new Date(lead.createdAt).toLocaleDateString("en-CA", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
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
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
                      {lead.message}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
