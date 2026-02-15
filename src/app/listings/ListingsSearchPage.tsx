"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ListingListItem } from "@/app/api/listings/route";
import ListingsMapClient from "./ListingsMapClient";

const PAGE_SIZE = 24;
const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80";

const PROPERTY_TYPES = [
  { value: "", label: "Any" },
  { value: "House", label: "House" },
  { value: "Condo", label: "Condo" },
  { value: "Townhouse", label: "Townhouse" },
  { value: "Multi-Family", label: "Multi-Family" },
  { value: "Land", label: "Land" },
  { value: "Other", label: "Other" },
];

function formatPrice(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
    return "Contact";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatBedsBaths(
  beds: number | null | undefined,
  baths: number | null | undefined
) {
  const parts: string[] = [];
  if (typeof beds === "number" && Number.isFinite(beds))
    parts.push(`${beds} Bed`);
  if (typeof baths === "number" && Number.isFinite(baths))
    parts.push(`${baths} Bath`);
  return parts.length ? parts.join(" • ") : "";
}

type QueryParam = string | number | undefined | string[];

function buildQueryString(params: Record<string, QueryParam>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      v.filter((x) => x !== undefined && x !== "" && String(x).trim() !== "").forEach((x) => q.append(k, String(x)));
    } else if (v !== "" && String(v).trim() !== "") {
      q.set(k, String(v));
    }
  }
  return q.toString();
}

export default function ListingsSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const beds = searchParams.getAll("beds");
  const baths = searchParams.getAll("baths");
  const dens = searchParams.getAll("dens");
  const city = searchParams.get("city") ?? "";
  const propertyType = searchParams.get("propertyType") ?? "";
  const sort = searchParams.get("sort") ?? "updated_desc";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const view = (searchParams.get("view") ?? "list") === "map" ? "map" : "list";

  const [listings, setListings] = useState<ListingListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bedBathOpen, setBedBathOpen] = useState(false);
  const bedBathRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bedBathOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (bedBathRef.current && !bedBathRef.current.contains(e.target as Node)) {
        setBedBathOpen(false);
      }
    };
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [bedBathOpen]);

  // Serialize array params so useMemo/useEffect don't see new refs every render (avoids infinite refetch loop)
  const bedsKey = beds.slice().sort().join(",");
  const bathsKey = baths.slice().sort().join(",");
  const densKey = dens.slice().sort().join(",");

  const apiParams = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("limit", String(PAGE_SIZE));
    p.set("sort", sort);
    if (q.trim()) p.set("q", q.trim());
    if (minPrice.trim()) p.set("minPrice", minPrice.trim());
    if (maxPrice.trim()) p.set("maxPrice", maxPrice.trim());
    beds.forEach((b) => p.append("beds", b));
    baths.forEach((b) => p.append("baths", b));
    dens.forEach((d) => p.append("dens", d));
    if (city.trim()) p.set("city", city.trim());
    if (propertyType.trim()) p.set("propertyType", propertyType.trim());
    return p;
  }, [q, minPrice, maxPrice, bedsKey, bathsKey, densKey, city, propertyType, sort, page]);

  const fetchKey = apiParams.toString();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = `/api/listings?${fetchKey}`;
    fetch(url, { method: "GET" })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: { listings: ListingListItem[]; total: number }) => {
        if (!cancelled) {
          setListings(data.listings ?? []);
          setTotal(data.total ?? 0);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load listings");
          setListings([]);
          setTotal(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchKey]);

  const updateUrl = useCallback(
    (overrides: Record<string, QueryParam>) => {
      const next = {
        q: overrides.q !== undefined ? overrides.q : q,
        minPrice: overrides.minPrice !== undefined ? overrides.minPrice : minPrice,
        maxPrice: overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice,
        beds: overrides.beds !== undefined ? overrides.beds : beds,
        baths: overrides.baths !== undefined ? overrides.baths : baths,
        dens: overrides.dens !== undefined ? overrides.dens : dens,
        city: overrides.city !== undefined ? overrides.city : city,
        propertyType:
          overrides.propertyType !== undefined
            ? overrides.propertyType
            : propertyType,
        sort: overrides.sort !== undefined ? overrides.sort : sort,
        page: overrides.page !== undefined ? overrides.page : page,
        view: overrides.view !== undefined ? overrides.view : view,
      };
      const query = buildQueryString(next);
      router.replace(query ? `/listings?${query}` : "/listings", {
        scroll: false,
      });
    },
    [q, minPrice, maxPrice, beds, baths, dens, city, propertyType, sort, page, view, router]
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-14">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            MLS Search
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Toronto & GTA. Search by address, city, neighbourhood, or MLS#.
          </p>
          <Link
            href="/listings/ours"
            className="mt-3 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
          >
            View our listings →
          </Link>
        </div>

        {/* Search bar */}
        <form
          className="mb-6"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const qInput = form.querySelector<HTMLInputElement>('input[name="q"]');
            const val = qInput?.value?.trim() ?? "";
            updateUrl({ q: val, page: 1 });
          }}
        >
          <div className="flex gap-3">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Address, city, neighbourhood, or MLS#"
              className="flex-1 rounded-xl border border-white/[0.08] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              aria-label="Search listings"
            />
            <button
              type="submit"
              className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters */}
        <form
          method="get"
          className="mb-8 rounded-2xl border border-white/[0.06] bg-[var(--surface)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);
            updateUrl({
              q: (data.get("q") as string) ?? q,
              minPrice: (data.get("minPrice") as string) ?? "",
              maxPrice: (data.get("maxPrice") as string) ?? "",
              beds: data.getAll("beds") as string[],
              baths: data.getAll("baths") as string[],
              dens: data.getAll("dens") as string[],
              city: (data.get("city") as string) ?? "",
              propertyType: (data.get("propertyType") as string) ?? "",
              sort: (data.get("sort") as string) ?? sort,
              page: 1,
            });
          }}
        >
          <input type="hidden" name="q" value={q} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div>
              <label
                htmlFor="city"
                className="block text-xs font-medium text-[var(--muted)]"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={city}
                placeholder="e.g. Toronto"
                className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted)]"
              />
            </div>
            <div>
              <label
                htmlFor="minPrice"
                className="block text-xs font-medium text-[var(--muted)]"
              >
                Min price
              </label>
              <input
                id="minPrice"
                name="minPrice"
                type="number"
                min={0}
                step={10000}
                defaultValue={minPrice || undefined}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)]"
              />
            </div>
            <div>
              <label
                htmlFor="maxPrice"
                className="block text-xs font-medium text-[var(--muted)]"
              >
                Max price
              </label>
              <input
                id="maxPrice"
                name="maxPrice"
                type="number"
                min={0}
                step={10000}
                defaultValue={maxPrice || undefined}
                placeholder="Any"
                className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)]"
              />
            </div>
            <div className="relative" ref={bedBathRef}>
              <label className="block text-xs font-medium text-[var(--muted)]">Bed & Bath</label>
              <button
                type="button"
                onClick={() => setBedBathOpen((o) => !o)}
                className="mt-1 flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-left text-sm text-[var(--foreground)]"
                aria-expanded={bedBathOpen}
                aria-haspopup="listbox"
              >
                <span>
                  {beds.length + baths.length + dens.length === 0
                    ? "Any"
                    : [beds.length && "Bed", baths.length && "Bath", dens.length && "Dens"].filter(Boolean).join(", ")}
                </span>
                <svg
                  className={`h-4 w-4 shrink-0 text-[var(--muted)] transition-transform ${bedBathOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {bedBathOpen && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] p-3 shadow-lg">
                  {/* Line 1: Bedrooms */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-[var(--muted)] w-20 shrink-0">Bedrooms</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["1", "2", "3", "4", "5"].map((n) => {
                        const selected = beds.includes(n);
                        return (
                          <button
                            key={n}
                            type="button"
                            name="beds"
                            value={n}
                            onClick={() => {
                              const next = selected ? beds.filter((b) => b !== n) : [...beds, n];
                              updateUrl({ beds: next, page: 1 });
                            }}
                            className={`min-w-[2rem] rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
                              selected
                                ? "bg-[var(--accent)] text-white"
                                : "bg-[var(--surface)] text-[var(--foreground)] border border-white/[0.12] hover:border-white/20"
                            }`}
                          >
                            {n === "5" ? "5+" : n}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Line 2: Bedrooms + */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
                    <span className="text-xs font-medium text-[var(--muted)] w-20 shrink-0">Bedrooms +</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["1", "2", "3", "4", "5"].map((n) => {
                        const selected = dens.includes(n);
                        return (
                          <button
                            key={`den-${n}`}
                            type="button"
                            name="dens"
                            value={n}
                            onClick={() => {
                              const next = selected ? dens.filter((d) => d !== n) : [...dens, n];
                              updateUrl({ dens: next, page: 1 });
                            }}
                            className={`min-w-[2rem] rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
                              selected
                                ? "bg-[var(--accent)] text-white"
                                : "bg-[var(--surface)] text-[var(--foreground)] border border-white/[0.12] hover:border-white/20"
                            }`}
                          >
                            {n === "5" ? "5+" : n}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Line 3: Bathrooms */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
                    <span className="text-xs font-medium text-[var(--muted)] w-20 shrink-0">Bathrooms</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["1", "2", "3", "4", "5"].map((b) => {
                        const selected = baths.includes(b);
                        return (
                          <button
                            key={b}
                            type="button"
                            name="baths"
                            value={b}
                            onClick={() => {
                              const next = selected ? baths.filter((x) => x !== b) : [...baths, b];
                              updateUrl({ baths: next, page: 1 });
                            }}
                            className={`min-w-[2rem] rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${
                              selected
                                ? "bg-[var(--accent)] text-white"
                                : "bg-[var(--surface)] text-[var(--foreground)] border border-white/[0.12] hover:border-white/20"
                            }`}
                          >
                            {b === "5" ? "5+" : b}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {/* Hidden inputs for form submit (Apply filters) */}
              {beds.map((b) => (
                <input type="hidden" name="beds" value={b} key={`beds-${b}`} />
              ))}
              {baths.map((b) => (
                <input type="hidden" name="baths" value={b} key={`baths-${b}`} />
              ))}
              {dens.map((d) => (
                <input type="hidden" name="dens" value={d} key={`dens-${d}`} />
              ))}
            </div>
            <div>
              <label
                htmlFor="propertyType"
                className="block text-xs font-medium text-[var(--muted)]"
              >
                Property type
              </label>
              <select
                id="propertyType"
                name="propertyType"
                defaultValue={propertyType || ""}
                className="select-arrow mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)]"
              >
                {PROPERTY_TYPES.map((opt) => (
                  <option key={opt.value || "any"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div>
              <label
                htmlFor="sort"
                className="sr-only"
              >
                Sort by
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="select-arrow rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)]"
              >
                <option value="updated_desc">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
            >
              Apply filters
            </button>
            <Link
              href="/listings"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
            >
              Clear
            </Link>
          </div>
        </form>

        {/* View toggle + count */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            {loading ? "Loading…" : `${total} ${total === 1 ? "listing" : "listings"}`}
          </p>
          <div className="flex rounded-xl border border-white/[0.08] bg-[var(--surface)] p-1">
            <button
              type="button"
              onClick={() => updateUrl({ view: "list" })}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                view === "list"
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--foreground)] hover:bg-white/5"
              }`}
            >
              List
            </button>
            <button
              type="button"
              onClick={() => updateUrl({ view: "map" })}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                view === "map"
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--foreground)] hover:bg-white/5"
              }`}
            >
              Map
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {view === "map" ? (
          <ListingsMapClient listings={listings} showFitBounds={listings.length > 0} />
        ) : (
          <>
            {listings.length === 0 && !loading ? (
              <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface)] p-12 text-center text-[var(--muted)]">
                No listings match your search or filters.
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.map((listing) => {
                    const title =
                      (listing.addressLine && listing.addressLine.trim()) ||
                      (listing.propertyType && listing.propertyType.trim()) ||
                      "Listing";
                    const location = [listing.city, listing.province]
                      .filter(Boolean)
                      .join(", ") || "";
                    const image =
                      (listing.photoUrl && listing.photoUrl.trim()) ||
                      PLACEHOLDER_IMAGE;

                    return (
                      <article
                        key={listing.id}
                        className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                      >
                        <Link href={listing.url} className="block">
                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <img
                              src={image}
                              alt=""
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute right-3 top-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                              {formatPrice(listing.price)}
                            </div>
                          </div>
                          <div className="p-5">
                            <h2 className="font-semibold text-[var(--foreground)]">
                              {title}
                            </h2>
                            <p className="mt-1 text-sm text-[var(--muted)]">
                              {formatBedsBaths(listing.beds, listing.baths)}
                            </p>
                            {location && (
                              <p className="mt-0.5 text-xs text-[var(--muted)]">
                                {location}
                              </p>
                            )}
                            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
                              View details <span aria-hidden>→</span>
                            </span>
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <nav
                    className="mt-10 flex items-center justify-center gap-2"
                    aria-label="Pagination"
                  >
                    {page > 1 && (
                      <button
                        type="button"
                        onClick={() => updateUrl({ page: page - 1 })}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                      >
                        Previous
                      </button>
                    )}
                    <span className="px-4 py-2 text-sm text-[var(--muted)]">
                      Page {page} of {totalPages}
                    </span>
                    {page < totalPages && (
                      <button
                        type="button"
                        onClick={() => updateUrl({ page: page + 1 })}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
                      >
                        Next
                      </button>
                    )}
                  </nav>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
