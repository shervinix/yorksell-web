import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { getListingPhotoUrls, isHdPhotoUrl } from "@/lib/listing-photos";
import { ListingPhotoSlideshow } from "../ListingPhotoSlideshow";
import { SaveListingButton } from "./SaveListingButton";
import SingleListingMapClient from "./SingleListingMapClient";

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function pickStr(...vals: unknown[]): string | null {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function pickNum(...vals: unknown[]): number | null {
  for (const v of vals) {
    if (v == null) continue;
    const s = String(v).trim();
    if (!s) continue;
    // Extract first integer from the string (handles "2929 sqft", "10 250", etc.)
    const m = s.match(/(\d[\d,\s]*)/);
    if (!m) continue;
    const n = parseInt(m[1].replace(/[,\s]/g, ""), 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function pickFloat(...vals: unknown[]): number | null {
  for (const v of vals) {
    if (v == null) continue;
    const s = String(v).trim();
    if (!s) continue;
    const n = parseFloat(s.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

/** Parse sqft — returns display string handling exact values and ranges. */
function parseSqftDisplay(val: unknown): string | null {
  if (val == null) return null;
  const s = String(val).trim();
  if (!s) return null;

  // Range: "700 - 1100 sqft" or "1500 - 2000 sqft"
  const rangeMatch = s.match(/(\d[\d,]*)\s*[-–]\s*(\d[\d,]*)/);
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1].replace(/,/g, ""), 10);
    const hi = parseInt(rangeMatch[2].replace(/,/g, ""), 10);
    if (Number.isFinite(lo) && lo > 0) {
      return Number.isFinite(hi) && hi > lo
        ? `${lo.toLocaleString()} – ${hi.toLocaleString()}`
        : lo.toLocaleString();
    }
  }

  // Single value: "2929 sqft", "2929", 2929
  const m = s.match(/(\d[\d,\s]*)/);
  if (m) {
    const n = parseInt(m[1].replace(/[,\s]/g, ""), 10);
    if (Number.isFinite(n) && n > 0) return n.toLocaleString();
  }
  return null;
}

function formatDim(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/\.?0+$/, "");
}

function formatDate(s: string | null | undefined): string | null {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

/** Extract agent names and brokerage names from CREA DDF AgentDetails. */
function parseAgentDetails(raw: Record<string, unknown>): { agents: string[]; brokerages: string[] } {
  const agents: string[] = [];
  const brokerages: string[] = [];

  const details = raw.AgentDetails;
  if (!details) return { agents, brokerages };

  const list = Array.isArray(details) ? details : [details];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const name = typeof r.Name === "string" ? r.Name.trim() : null;
    if (name) agents.push(name);

    const offices = Array.isArray(r.Office) ? r.Office : r.Office ? [r.Office] : [];
    for (const office of offices) {
      if (!office || typeof office !== "object") continue;
      const oName = (office as Record<string, unknown>).Name;
      if (typeof oName === "string" && oName.trim()) {
        const n = oName.trim();
        if (!brokerages.includes(n)) brokerages.push(n);
      }
    }
  }

  return { agents, brokerages };
}

/* ─── metadata ────────────────────────────────────────────────────────────── */

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

async function resolveId(params: PageProps["params"]): Promise<string> {
  return typeof (params as Promise<{ id: string }>).then === "function"
    ? (await (params as Promise<{ id: string }>)).id
    : (params as { id: string }).id;
}

export async function generateMetadata({ params }: PageProps) {
  const id = await resolveId(params);
  const listing = await prisma.listing.findFirst({
    where: { OR: [{ id }, { mlsNumber: id }, { ddfId: id }] },
    select: { addressLine: true, city: true, province: true, price: true, beds: true, baths: true, mlsNumber: true },
  });
  if (!listing) return { title: "Listing | Yorksell" };
  const title = [listing.addressLine, listing.mlsNumber].filter(Boolean).join(" · ") || "Listing";
  const parts = [
    listing.price ? `$${listing.price.toLocaleString()}` : null,
    listing.beds != null ? `${listing.beds} bed` : null,
    listing.baths != null ? `${listing.baths} bath` : null,
    [listing.city, listing.province].filter(Boolean).join(", ") || null,
  ].filter(Boolean);
  return {
    title: `${title} | Yorksell`,
    description: parts.length ? parts.join(" · ") : "Property listing from Yorksell Real Estate Group.",
  };
}

/* ─── page ────────────────────────────────────────────────────────────────── */

export default async function ListingPage({ params }: PageProps) {
  const id = await resolveId(params);

  const listing = await prisma.listing.findFirst({
    where: { OR: [{ id }, { mlsNumber: id }, { ddfId: id }] },
  });
  if (!listing) notFound();

  const session = await getServerSession(authOptions);
  let isSaved = false;
  if (session?.user?.id) {
    const saved = await prisma.savedListing.findUnique({
      where: { userId_listingId: { userId: session.user.id as string, listingId: listing.id } },
    });
    isSaved = !!saved;
  }

  /* photos */
  const proxyPhoto =
    (listing.mlsNumber ? `/api/listings/photo?mlsNumber=${encodeURIComponent(listing.mlsNumber)}` : null) ||
    (listing.ddfId ? `/api/listings/photo?ddfId=${encodeURIComponent(listing.ddfId)}` : null);
  const stored = listing.photoUrl?.trim() ?? "";
  const fallbackImageSrc = proxyPhoto || (stored && isHdPhotoUrl(stored) ? stored : "") || "";
  const raw = (listing.raw ?? {}) as Record<string, unknown>;
  const photoUrls = getListingPhotoUrls(raw);

  /* price */
  const price = listing.price
    ? new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(listing.price)
    : "Price on request";

  /* raw sub-objects */
  const building = (raw.Building ?? {}) as Record<string, unknown>;
  const land = (raw.Land ?? {}) as Record<string, unknown>;
  const property = (raw.Property ?? {}) as Record<string, unknown>;

  /* description */
  const description = pickStr(
    raw.PublicRemarks, raw.Remarks, raw.Description, raw.LongDescription,
    property.PublicRemarks, property.Remarks
  );

  /* sqft — handles "2929 sqft", "700 - 1100 sqft", plain numbers */
  const sqftRaw =
    listing.sqft != null
      ? String(listing.sqft)
      : (building.SizeInterior ?? building.SizeTotal ?? building.TotalFinishedArea ?? null);
  const sqftDisplay = parseSqftDisplay(sqftRaw);

  /* lot size */
  const lotSizeText = pickStr(land.SizeTotalText, raw.SizeTotalText, land.SizeIrregular, raw.SizeIrregular);
  let lotWidth = pickFloat(land.SizeFrontage, raw.SizeFrontage, land.Frontage, raw.Frontage) ?? null;
  let lotDepth = pickFloat(land.SizeDepth, raw.SizeDepth, land.Depth, raw.Depth) ?? null;
  if ((!lotWidth || !lotDepth) && lotSizeText) {
    const m = lotSizeText.match(/(\d+(?:\.\d+)?)\s*ft.*?[x×]\s*(\d+(?:\.\d+)?)\s*ft/i);
    if (m) {
      const w = Number(m[1]); const d = Number(m[2]);
      if (!lotWidth && Number.isFinite(w)) lotWidth = w;
      if (!lotDepth && Number.isFinite(d)) lotDepth = d;
    }
  }
  if (lotWidth != null && lotDepth != null && lotWidth >= 400 && lotDepth >= 400) {
    lotWidth /= 10; lotDepth /= 10;
  }
  const lotSize = lotWidth != null && lotDepth != null
    ? `${formatDim(lotWidth)} × ${formatDim(lotDepth)} ft`
    : lotSizeText || null;

  /* building details */
  const yearBuilt = listing.yearBuilt ?? pickNum(building.ConstructedDate, raw.YearBuilt, raw.ConstructedDate);
  const stories = pickNum(building.StoriesTotal, raw.StoriesTotal);
  const basement = pickStr(building.BasementDevelopment, building.BasementType);
  const heating = [pickStr(building.HeatingType), pickStr(building.HeatingFuel)].filter(Boolean).join(", ") || null;
  const cooling = pickStr(building.CoolingType, raw.CoolingType);
  const exterior = pickStr(building.ExteriorFinish, raw.ExteriorFinish);
  const style = pickStr(building.ArchitecturalStyle, raw.ArchitecturalStyle);
  const fireplaceRaw = building.FireplacePresent;
  const fireplaceTotal = pickNum(building.FireplaceTotal);
  const hasFireplace =
    fireplaceTotal != null && fireplaceTotal > 0
      ? `Yes (${fireplaceTotal})`
      : typeof fireplaceRaw === "string" && /yes|true|1/i.test(fireplaceRaw)
        ? "Yes"
        : typeof fireplaceRaw === "boolean" && fireplaceRaw
          ? "Yes"
          : null;

  /* parking */
  const parkingTotal = pickNum(raw.ParkingSpaceTotal, raw.ParkingTotal);
  const parkingSpaces = raw.ParkingSpaces as Record<string, unknown> | undefined;
  const parkingObj = parkingSpaces?.Parking as Record<string, unknown> | undefined;
  const parkingName = pickStr(parkingObj?.Name, parkingSpaces?.Name);
  const parking = parkingTotal != null
    ? [String(parkingTotal), parkingName].filter(Boolean).join(" · ")
    : parkingName || null;

  /* ownership + transaction */
  const ownership = pickStr(raw.OwnershipType, raw.Ownership);
  const transaction = pickStr(raw.TransactionType, raw.TransactionType);
  const listDate = formatDate(pickStr(raw.ListingContractDate, raw.ListDate));

  /* status / postal / MLS */
  const status = listing.status?.trim() || null;
  const postalCode = listing.postalCode?.trim() || null;
  const mlsNumber = listing.mlsNumber?.trim() || null;

  /* coords */
  const hasCoords = listing.lat != null && listing.lng != null &&
    Number.isFinite(listing.lat) && Number.isFinite(listing.lng);

  /* agent / brokerage */
  const { agents, brokerages } = parseAgentDetails(raw);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* Photo hero */}
      <section className="relative -mt-[6.5rem] h-[65vh] min-h-[320px] w-full pt-[6.5rem]">
        <ListingPhotoSlideshow
          photos={photoUrls}
          fallbackSrc={fallbackImageSrc}
          alt={listing.addressLine || listing.mlsNumber || "Listing"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back breadcrumb */}
        <div className="absolute left-0 right-0 top-[6.5rem] mx-auto max-w-6xl px-4 pt-4 sm:px-6">
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm transition hover:bg-black/60 hover:text-white"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 3L5 8l5 5" />
            </svg>
            All listings
          </Link>
        </div>

        {/* Hero title overlay */}
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          {status && (
            <span className={`mb-3 inline-block rounded-md px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${
              /active|a$/i.test(status)
                ? "bg-emerald-500/25 text-emerald-300 ring-1 ring-emerald-500/40"
                : /sold|u$/i.test(status)
                  ? "bg-red-500/25 text-red-300 ring-1 ring-red-500/40"
                  : "bg-white/15 text-white/80"
            }`}>
              {status}
            </span>
          )}
          <h1 className="text-3xl font-semibold text-white md:text-4xl lg:text-5xl">
            {listing.addressLine || (listing.mlsNumber && `Listing ${listing.mlsNumber}`) || "Property"}
          </h1>
          <p className="mt-1.5 text-white/75">
            {[listing.city, listing.province, postalCode].filter(Boolean).join(", ")}
          </p>
        </div>
      </section>

      {/* Key stats bar */}
      <div className="border-b border-white/[0.06] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-stretch divide-x divide-white/[0.06]">
            <StatPill label="List price" value={price} accent />
            {listing.beds != null && <StatPill label="Bedrooms" value={String(listing.beds)} />}
            {listing.baths != null && <StatPill label="Bathrooms" value={String(listing.baths)} />}
            {sqftDisplay && <StatPill label="Sq. ft." value={sqftDisplay} />}
            {lotSize && <StatPill label="Lot size" value={lotSize} />}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">

          {/* ── Main column ── */}
          <div className="space-y-10 lg:col-span-2">

            {/* Description */}
            {description && (
              <section>
                <SectionLabel>About this property</SectionLabel>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-[var(--muted)]">
                  {description}
                </p>
              </section>
            )}

            {/* Property details */}
            <section>
              <SectionLabel>Property details</SectionLabel>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                <Detail label="Property type" value={listing.propertyType} />
                <Detail label="Status" value={status} />
                <Detail label="Ownership" value={ownership} />
                <Detail label="Transaction" value={transaction} />
                <Detail label="MLS®" value={mlsNumber} />
                <Detail label="Postal code" value={postalCode} />
                {listDate && <Detail label="Listed" value={listDate} />}
              </div>
            </section>

            {/* Building details */}
            <section>
              <SectionLabel>Building</SectionLabel>
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                <Detail label="Bedrooms" value={listing.beds} />
                <Detail label="Bathrooms" value={listing.baths} />
                <Detail label="Sq. ft." value={sqftDisplay} />
                <Detail label="Stories" value={stories} />
                <Detail label="Year built" value={yearBuilt} />
                <Detail label="Style" value={style} />
                <Detail label="Exterior" value={exterior} />
                <Detail label="Basement" value={basement} />
                <Detail label="Heating" value={heating} />
                <Detail label="Cooling" value={cooling} />
                <Detail label="Fireplace" value={hasFireplace} />
                <Detail label="Parking" value={parking} />
              </div>
            </section>

            {/* Land details */}
            {lotSize && (
              <section>
                <SectionLabel>Land</SectionLabel>
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                  <Detail label="Lot size" value={lotSize} />
                </div>
              </section>
            )}

          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-5">

            {/* Contact card */}
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <p className="text-lg font-semibold text-[var(--foreground)]">{price}</p>
              <p className="mt-0.5 text-sm text-[var(--muted)]">
                {listing.addressLine || "Property"}
                {mlsNumber && <span className="ml-2 text-xs text-white/30">MLS® {mlsNumber}</span>}
              </p>

              <div className="mt-5 space-y-3">
                <Link
                  href={`/contact?listing=${encodeURIComponent(listing.mlsNumber ?? listing.id)}`}
                  className="block w-full rounded-xl bg-[var(--accent)] py-3 text-center text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
                >
                  Request information
                </Link>
                {session?.user ? (
                  <SaveListingButton listingId={listing.id} initialSaved={isSaved} />
                ) : (
                  <Link
                    href={`/login?callbackUrl=/listings/${encodeURIComponent(listing.mlsNumber ?? listing.id)}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                  >
                    Sign in to save
                  </Link>
                )}
              </div>

              <div className="mt-5 border-t border-white/[0.06] pt-5 text-xs text-white/30">
                Full details, pricing context, and private showings available.
                Call us at{" "}
                <a href="tel:+14164874311" className="text-white/50 hover:text-white">
                  (416) 487-4311
                </a>
              </div>
            </div>

            {/* Map */}
            {hasCoords && (
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                <div className="h-52">
                  <SingleListingMapClient lat={listing.lat!} lng={listing.lng!} />
                </div>
                <div className="px-4 py-3 text-xs text-[var(--muted)]">
                  {[listing.addressLine, listing.city, listing.province].filter(Boolean).join(", ")}
                </div>
              </div>
            )}

            {/* Key facts quick-ref */}
            <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Key facts</p>
              <dl className="space-y-2.5">
                {[
                  { label: "Type", value: listing.propertyType },
                  { label: "Status", value: status },
                  { label: "MLS®", value: mlsNumber },
                  { label: "Parking", value: parking },
                  { label: "Year built", value: yearBuilt },
                ].filter((r) => r.value != null).map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4">
                    <dt className="shrink-0 text-xs text-[var(--muted)]">{row.label}</dt>
                    <dd className="truncate text-right text-xs font-medium text-[var(--foreground)]">{String(row.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>

          </aside>
        </div>
      </div>

      {/* Listing attribution */}
      {(agents.length > 0 || brokerages.length > 0) && (
        <div className="border-t border-white/[0.04] bg-[var(--background)]">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <p className="text-xs text-white/25">
              Listed by{" "}
              {agents.length > 0 && (
                <span className="text-white/35">{agents.join(", ")}</span>
              )}
              {agents.length > 0 && brokerages.length > 0 && " · "}
              {brokerages.length > 0 && (
                <span className="text-white/35">{brokerages.join(", ")}</span>
              )}
            </p>
          </div>
        </div>
      )}

    </main>
  );
}

/* ─── sub-components ──────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="h-px w-8 bg-[var(--accent)]" />
      <h2 className="mt-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">
        {children}
      </h2>
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: string | null | undefined; accent?: boolean }) {
  if (!value) return null;
  return (
    <div className="px-5 py-4 first:pl-0">
      <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
      <p className={`mt-0.5 text-xl font-semibold tabular-nums tracking-tight ${accent ? "text-[var(--foreground)]" : "text-[var(--foreground)]"}`}>
        {value}
      </p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value == null || value === "") return null;
  return (
    <div>
      <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--foreground)]">{String(value)}</p>
    </div>
  );
}
