import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/server/db/prisma";
import { ChecklistSection } from "./ChecklistSection";
import { MessagesSection } from "./MessagesSection";

export const metadata = {
  title: "Client Services | Yorksell",
  description: "Your files, stats, notes, and updates as a Yorksell client.",
};

/** "listingViews" → "Listing Views" */
function prettifyKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\s/, "")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Returns true if the date is within the last 7 days */
function isNew(date: Date): boolean {
  return Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000;
}

function FileTypeIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const isPdf = ext === "pdf";
  const isImg = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  const isDoc = ["doc", "docx"].includes(ext);
  const isSheet = ["xls", "xlsx", "csv"].includes(ext);

  if (isPdf)
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </span>
    );
  if (isImg)
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </span>
    );
  if (isDoc)
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </span>
    );
  if (isSheet)
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75.125V5.625m0 12.75v-12.75A1.125 1.125 0 013.375 4.5h17.25c.621 0 1.125.504 1.125 1.125v12.75m-19.5 0h19.5" />
        </svg>
      </span>
    );
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[var(--muted)]">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px w-6 bg-[var(--accent)]" />
      <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{children}</h2>
    </div>
  );
}

function EmptyCard({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 text-center shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      <p className="text-sm text-[var(--muted)]">{message}</p>
      {sub && <p className="mt-1 text-xs text-[var(--muted)]/60">{sub}</p>}
    </div>
  );
}

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
}

function fmtDateTime(d: Date | string) {
  return new Date(d).toLocaleDateString("en-CA", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtPrice(n: number) {
  return "$" + n.toLocaleString("en-CA");
}

export default async function ClientServicesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login?callbackUrl=/members/client-services");
  const userId = session.user?.id as string;
  if (!userId) redirect("/login?callbackUrl=/members/client-services");

  const client = await prisma.client.findUnique({
    where: { userId },
    include: {
      files: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      updates: { orderBy: { createdAt: "desc" } },
      checklist: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
      messages: { orderBy: { createdAt: "asc" } },
      appointments: { orderBy: { date: "asc" } },
      offers: { orderBy: { createdAt: "desc" } },
    },
  });

  const hasServices =
    client && (client.buyerClient || client.sellerClient || client.propertyManagementClient);

  const services: string[] = [];
  if (client?.buyerClient) services.push("Buyer");
  if (client?.sellerClient) services.push("Seller");
  if (client?.propertyManagementClient) services.push("Property Management");

  // Fetch pinned listings
  const pinnedListings =
    client && client.pinnedListingIds.length > 0
      ? await prisma.listing.findMany({
          where: { id: { in: client.pinnedListingIds } },
          select: {
            id: true,
            ddfId: true,
            mlsNumber: true,
            addressLine: true,
            city: true,
            province: true,
            price: true,
            beds: true,
            baths: true,
            propertyType: true,
            photoUrl: true,
          },
        })
      : [];

  const offerStatusColor: Record<string, string> = {
    Accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Firm: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Conditional: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    Withdrawn: "bg-red-500/10 text-red-400 border-red-500/20",
    Expired: "bg-red-500/10 text-red-400 border-red-500/20",
    Pending: "bg-white/[0.06] text-[var(--muted)] border-white/[0.08]",
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-16">
        {/* Back nav */}
        <Link
          href="/members"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Members area
        </Link>

        <h1 className="mt-6 text-2xl font-semibold tracking-tight md:text-3xl">Client Services</h1>

        {!hasServices ? (
          <section className="mt-8 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.15)] md:p-14">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.05]">
              <svg className="h-7 w-7 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
              </svg>
            </div>
            <p className="text-base font-medium text-[var(--foreground)]">No active client services</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Once you become a client for buying, selling, or property management, you&apos;ll
              have access to your full transaction portal here.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
            >
              Get in touch
            </Link>
          </section>
        ) : (
          <>
            {/* Active services */}
            <div className="mt-8 flex flex-wrap gap-2">
              {services.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* ── Transaction Stage ── */}
            {client.stage && (
              <section className="mt-10">
                <SectionLabel>Transaction stage</SectionLabel>
                <div className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15">
                      <svg className="h-5 w-5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Current Stage</p>
                      <p className="mt-0.5 text-lg font-semibold text-[var(--foreground)]">{client.stage}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Agent Contact Card ── */}
            {client.agentName && (
              <section className="mt-10">
                <SectionLabel>Your agent</SectionLabel>
                <div className="rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-base font-bold text-[var(--accent)]">
                      {client.agentName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--foreground)]">{client.agentName}</p>
                      {client.agentTitle && (
                        <p className="text-sm text-[var(--muted)]">{client.agentTitle}</p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-3">
                        {client.agentPhone && (
                          <a
                            href={`tel:${client.agentPhone}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:bg-white/[0.08]"
                          >
                            <svg className="h-3.5 w-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                            {client.agentPhone}
                          </a>
                        )}
                        {client.agentEmail && (
                          <a
                            href={`mailto:${client.agentEmail}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:bg-white/[0.08]"
                          >
                            <svg className="h-3.5 w-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                            {client.agentEmail}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Pinned Listings ── */}
            {pinnedListings.length > 0 && (
              <section className="mt-10">
                <SectionLabel>Pinned listings</SectionLabel>
                <div className="grid gap-3 sm:grid-cols-2">
                  {pinnedListings.map((l) => (
                    <Link
                      key={l.id}
                      href={`/listings/${l.ddfId}`}
                      className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition hover:border-white/[0.12]"
                    >
                      {l.photoUrl ? (
                        <img
                          src={l.photoUrl}
                          alt={l.addressLine ?? ""}
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                          <svg className="h-6 w-6 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                          {l.addressLine ?? "Address not available"}
                        </p>
                        <p className="text-xs text-[var(--muted)]">{[l.city, l.province].filter(Boolean).join(", ")}</p>
                        {l.price && (
                          <p className="mt-1 text-sm font-semibold text-[var(--accent)]">{fmtPrice(l.price)}</p>
                        )}
                        <p className="text-xs text-[var(--muted)]">
                          {[l.beds && `${l.beds} bed`, l.baths && `${l.baths} bath`, l.propertyType].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── Checklist ── */}
            {client.showChecklist && (
              <section className="mt-10">
                <SectionLabel>Closing checklist</SectionLabel>
                {client.checklist.length === 0 ? (
                  <EmptyCard message="No checklist items yet." sub="Your agent will add tasks here to track your progress." />
                ) : (
                  <ChecklistSection
                    initial={client.checklist.map((c) => ({
                      id: c.id,
                      title: c.title,
                      assignedTo: c.assignedTo,
                      done: c.done,
                      doneAt: c.doneAt?.toISOString() ?? null,
                      order: c.order,
                    }))}
                  />
                )}
              </section>
            )}

            {/* ── Appointments ── */}
            {client.showAppointments && (
              <section className="mt-10">
                <SectionLabel>Upcoming appointments</SectionLabel>
                {client.appointments.length === 0 ? (
                  <EmptyCard message="No appointments scheduled." sub="Showings and meetings will appear here." />
                ) : (
                  <ul className="space-y-3">
                    {client.appointments.map((a) => {
                      const isPast = new Date(a.date) < new Date();
                      return (
                        <li
                          key={a.id}
                          className={`flex gap-4 rounded-xl border bg-[var(--surface-elevated)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)] ${
                            isPast ? "border-white/[0.04] opacity-60" : "border-white/[0.06]"
                          }`}
                        >
                          <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04] py-2 text-center">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                              {new Date(a.date).toLocaleDateString("en-CA", { month: "short" })}
                            </span>
                            <span className="text-xl font-bold leading-none text-[var(--foreground)]">
                              {new Date(a.date).getDate()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[var(--foreground)]">{a.title}</p>
                            <p className="mt-0.5 text-xs text-[var(--muted)]">{fmtDateTime(a.date)}</p>
                            {a.notes && <p className="mt-1 text-xs text-[var(--muted)]/70">{a.notes}</p>}
                          </div>
                          {isPast && (
                            <span className="shrink-0 self-start rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-[var(--muted)]">Past</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            )}

            {/* ── Offers ── */}
            {client.showOffers && (
              <section className="mt-10">
                <SectionLabel>Offer tracker</SectionLabel>
                {client.offers.length === 0 ? (
                  <EmptyCard message="No offers on file yet." sub="Submitted offers and their status will be tracked here." />
                ) : (
                  <ul className="space-y-3">
                    {client.offers.map((o) => (
                      <li
                        key={o.id}
                        className="rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            {o.address && (
                              <p className="font-semibold text-[var(--foreground)]">{o.address}</p>
                            )}
                            {o.price && (
                              <p className="mt-0.5 text-xl font-bold text-[var(--accent)]">{fmtPrice(o.price)}</p>
                            )}
                          </div>
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            offerStatusColor[o.status] ?? offerStatusColor.Pending
                          }`}>
                            {o.status}
                          </span>
                        </div>
                        {(o.conditions || o.closingDate) && (
                          <div className="mt-3 space-y-1">
                            {o.closingDate && (
                              <p className="text-xs text-[var(--muted)]">
                                <span className="font-medium">Closing:</span> {fmtDate(o.closingDate)}
                              </p>
                            )}
                            {o.conditions && (
                              <p className="text-xs text-[var(--muted)]">
                                <span className="font-medium">Conditions:</span> {o.conditions}
                              </p>
                            )}
                          </div>
                        )}
                        {o.notes && (
                          <p className="mt-2 text-xs text-[var(--muted)]/70">{o.notes}</p>
                        )}
                        <p className="mt-2 text-[10px] text-[var(--muted)]/50">{fmtDate(o.createdAt)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* ── Messages ── */}
            {client.showMessages && (
              <section className="mt-10">
                <SectionLabel>Messages</SectionLabel>
                <MessagesSection
                  initial={client.messages.map((m) => ({
                    id: m.id,
                    fromAgent: m.fromAgent,
                    content: m.content,
                    createdAt: m.createdAt.toISOString(),
                  }))}
                />
              </section>
            )}

            {/* ── Files ── */}
            {client.showFiles && (
              <section className="mt-10">
                <SectionLabel>Files</SectionLabel>
                {client.files.length === 0 ? (
                  <EmptyCard message="No files shared yet." sub="Your agent will upload documents here when ready." />
                ) : (
                  <ul className="space-y-2">
                    {client.files.map((file) => (
                      <li
                        key={file.id}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition hover:border-white/[0.10]"
                      >
                        <FileTypeIcon name={file.name} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-[var(--foreground)]">{file.name}</p>
                          <p className="mt-0.5 text-xs text-[var(--muted)]">{fmtDate(file.createdAt)}</p>
                        </div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:bg-white/[0.08]"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* ── Stats ── */}
            {client.showStats && (
              <section className="mt-10">
                <SectionLabel>Stats</SectionLabel>
                {!client.statsJson ||
                (typeof client.statsJson === "object" &&
                  Object.keys(client.statsJson as object).length === 0) ? (
                  <EmptyCard message="No stats available yet." sub="Your agent will populate your stats here." />
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(client.statsJson as Record<string, unknown>).map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                      >
                        <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                          {prettifyKey(key)}
                        </p>
                        <p className="mt-1.5 text-xl font-semibold text-[var(--foreground)]">
                          {String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* ── Notes ── */}
            {client.showNotes && (
              <section className="mt-10">
                <SectionLabel>Notes from your agent</SectionLabel>
                {client.notes.length === 0 ? (
                  <EmptyCard message="No notes yet." sub="Your agent's notes for you will appear here." />
                ) : (
                  <ul className="space-y-3">
                    {client.notes.map((note) => (
                      <li key={note.id} className="flex gap-4">
                        <div className="flex flex-col items-center pt-1">
                          <div className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                          <div className="mt-1 flex-1 w-px bg-white/[0.06]" />
                        </div>
                        <div className="min-w-0 flex-1 pb-4">
                          <p className="text-xs text-[var(--muted)]">{fmtDate(note.createdAt)}</p>
                          <p className="mt-1.5 whitespace-pre-wrap text-sm text-[var(--foreground)] leading-relaxed">
                            {note.content}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* ── Updates ── */}
            {client.showUpdates && (
              <section className="mt-10 pb-10">
                <SectionLabel>Updates</SectionLabel>
                {client.updates.length === 0 ? (
                  <EmptyCard message="No updates yet." sub="Transaction milestones and announcements will appear here." />
                ) : (
                  <ul className="space-y-4">
                    {client.updates.map((update) => {
                      const fresh = isNew(update.createdAt);
                      return (
                        <li
                          key={update.id}
                          className={`rounded-xl border bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] ${
                            fresh ? "border-[var(--accent)]/25" : "border-white/[0.06]"
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-[var(--foreground)]">{update.title}</h3>
                              {fresh && (
                                <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[var(--muted)]">{fmtDate(update.createdAt)}</p>
                          </div>
                          <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--muted)] leading-relaxed">
                            {update.content}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
