"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ListingListItem } from "@/app/api/listings/route";
import { formatPrice, formatBedsBaths, toListingCardFromResult, type ListingCard } from "@/lib/listings";
import { ListingCard as ListingCardComponent } from "./ListingCard";
import { ListingsSkeleton } from "./ListingsSkeleton";
import ListingsMapClient from "./ListingsMapClient";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2600&q=80";

const PAGE_SIZE = 24;
const MAX_PAGE_BUTTONS = 7;

const PROPERTY_TYPES = [
  { value: "", label: "Any type" },
  { value: "House", label: "House" },
  { value: "Condo", label: "Condo" },
  { value: "Townhouse", label: "Townhouse" },
  { value: "Multi-Family", label: "Multi-Family" },
  { value: "Land", label: "Land" },
  { value: "Other", label: "Other" },
];

const SORT_OPTIONS = [
  { value: "price_desc", label: "Price: high to low" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "updated_desc", label: "Newest first" },
];

type QueryParam = string | number | undefined | string[];

function buildQueryString(params: Record<string, QueryParam>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      v.filter((x) => x !== undefined && x !== "" && String(x).trim() !== "").forEach((x) =>
        q.append(k, String(x))
      );
    } else if (v !== "" && String(v).trim() !== "") {
      q.set(k, String(v));
    }
  }
  return q.toString();
}

function pageRange(current: number, total: number): (number | "...")[] {
  if (total <= MAX_PAGE_BUTTONS) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  const left = Math.max(2, current - 2);
  const right = Math.min(total - 1, current + 2);
  pages.push(1);
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

export default function ListingsSearchPage({
  initialFeatured = [],
}: {
  initialFeatured?: ListingCard[];
}) {
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
  const [filtersOpen, setFiltersOpen] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, minPrice, maxPrice, bedsKey, bathsKey, densKey, city, propertyType, sort, page]);

  const fetchKey = apiParams.toString();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/listings?${fetchKey}`)
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
    return () => { cancelled = true; };
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
        propertyType: overrides.propertyType !== undefined ? overrides.propertyType : propertyType,
        sort: overrides.sort !== undefined ? overrides.sort : sort,
        page: overrides.page !== undefined ? overrides.page : page,
        view: overrides.view !== undefined ? overrides.view : view,
      };
      const query = buildQueryString(next);
      router.replace(query ? `/listings?${query}` : "/listings", { scroll: false });
    },
    [q, minPrice, maxPrice, beds, baths, dens, city, propertyType, sort, page, view, router]
  );

  const clearAll = useCallback(() => {
    router.replace("/listings", { scroll: false });
  }, [router]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Count active filters (excluding sort, page, view, q)
  const activeFilterCount = [
    minPrice,
    maxPrice,
    city,
    propertyType,
    ...beds,
    ...baths,
    ...dens,
  ].filter(Boolean).length;

  // Active filter chips
  const filterChips: { label: string; onRemove: () => void }[] = [];
  if (q) filterChips.push({ label: `"${q}"`, onRemove: () => updateUrl({ q: "", page: 1 }) });
  if (city) filterChips.push({ label: city, onRemove: () => updateUrl({ city: "", page: 1 }) });
  if (propertyType) filterChips.push({ label: propertyType, onRemove: () => updateUrl({ propertyType: "", page: 1 }) });
  if (minPrice) filterChips.push({ label: `From ${formatPrice(Number(minPrice))}`, onRemove: () => updateUrl({ minPrice: "", page: 1 }) });
  if (maxPrice) filterChips.push({ label: `Up to ${formatPrice(Number(maxPrice))}`, onRemove: () => updateUrl({ maxPrice: "", page: 1 }) });
  beds.forEach((b) => filterChips.push({ label: `${b} Bed`, onRemove: () => updateUrl({ beds: beds.filter((x) => x !== b), page: 1 }) }));
  baths.forEach((b) => filterChips.push({ label: `${b} Bath`, onRemove: () => updateUrl({ baths: baths.filter((x) => x !== b), page: 1 }) }));
  dens.forEach((d) => filterChips.push({ label: `${d}+ Den`, onRemove: () => updateUrl({ dens: dens.filter((x) => x !== d), page: 1 }) }));

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">

      {/* Hero */}
      <header className="relative -mt-[6.5rem] min-h-[36vh] overflow-hidden pt-[6.5rem]">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-1 flex-col justify-end px-4 pb-12 pt-4 sm:px-6 md:pb-16 md:pt-6">
          <h1 className="hero-enter-1 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
            Listings
          </h1>
          <p className="hero-enter-2 mt-3 max-w-xl text-lg text-white/85">
            Active, sold, and featured listings across Toronto and the GTA.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">

        {/* Featured listings */}
        {initialFeatured.length > 0 && (
          <section className="mb-10">
            <div className="mb-5">
              <div className="h-px w-8 bg-[var(--accent)]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]">Featured listings</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {initialFeatured.map((l) => (
                <ListingCardComponent key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}

        {/* Search bar */}
        <form
          className="mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const qInput = form.querySelector<HTMLInputElement>('input[name="q"]');
            updateUrl({ q: qInput?.value?.trim() ?? "", page: 1 });
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

        {/* Toolbar: count + filters button + sort + view toggle */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted)]">
            {loading ? "Loading…" : `${total.toLocaleString()} ${total === 1 ? "listing" : "listings"}`}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filters button with active count */}
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
              aria-expanded={filtersOpen}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 6H20M6 12H18M10 18H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-xs font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort — always visible */}
            <select
              value={sort}
              onChange={(e) => updateUrl({ sort: e.target.value, page: 1 })}
              className="rounded-xl border border-white/[0.08] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]"
              aria-label="Sort listings"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* View toggle */}
            <div className="flex rounded-xl border border-white/[0.08] bg-[var(--surface)] p-1">
              <button
                type="button"
                onClick={() => updateUrl({ view: "list" })}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${view === "list" ? "bg-[var(--accent)] text-white" : "text-[var(--foreground)] hover:bg-white/5"}`}
                aria-label="List view"
              >
                List
              </button>
              <button
                type="button"
                onClick={() => updateUrl({ view: "map" })}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${view === "map" ? "bg-[var(--accent)] text-white" : "text-[var(--foreground)] hover:bg-white/5"}`}
                aria-label="Map view"
              >
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {filterChips.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {filterChips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.05] px-3 py-1 text-xs font-medium text-[var(--foreground)] transition hover:bg-white/[0.08]"
              >
                {chip.label}
                <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3 shrink-0 text-white/40" aria-hidden>
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-[var(--muted)] underline underline-offset-2 hover:text-[var(--foreground)]"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Filters panel */}
        {filtersOpen && (
          <form
            method="get"
            className="mb-6 rounded-2xl border border-white/[0.06] bg-[var(--surface)] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
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
                page: 1,
              });
              setFiltersOpen(false);
            }}
          >
            <input type="hidden" name="q" value={q} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label htmlFor="city" className="block text-xs font-medium text-[var(--muted)]">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  defaultValue={city}
                  placeholder="e.g. Toronto"
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              <div>
                <label htmlFor="minPrice" className="block text-xs font-medium text-[var(--muted)]">Min price</label>
                <input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  min={0}
                  step={10000}
                  defaultValue={minPrice || undefined}
                  placeholder="No min"
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-xs font-medium text-[var(--muted)]">Max price</label>
                <input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  min={0}
                  step={10000}
                  defaultValue={maxPrice || undefined}
                  placeholder="No max"
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>
              <div className="relative" ref={bedBathRef}>
                <label className="block text-xs font-medium text-[var(--muted)]">Bed & Bath</label>
                <button
                  type="button"
                  onClick={() => setBedBathOpen((o) => !o)}
                  className="mt-1 flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-left text-sm text-[var(--foreground)]"
                  aria-expanded={bedBathOpen}
                >
                  <span>
                    {beds.length + baths.length + dens.length === 0
                      ? "Any"
                      : [
                          beds.length && `${beds.join(",")} Bed`,
                          baths.length && `${baths.join(",")} Bath`,
                          dens.length && `${dens.join(",")}+ Den`,
                        ].filter(Boolean).join(", ")}
                  </span>
                  <svg className={`h-4 w-4 shrink-0 text-[var(--muted)] transition-transform ${bedBathOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {bedBathOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] p-3 shadow-lg">
                    {[
                      { label: "Bedrooms", values: beds, key: "beds" as const },
                      { label: "Bedrooms + Den", values: dens, key: "dens" as const },
                      { label: "Bathrooms", values: baths, key: "baths" as const },
                    ].map(({ label, values, key }, idx) => (
                      <div key={key} className={`flex flex-wrap items-center gap-2 ${idx > 0 ? "mt-3 border-t border-white/[0.06] pt-3" : ""}`}>
                        <span className="w-28 shrink-0 text-xs font-medium text-[var(--muted)]">{label}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {["1", "2", "3", "4", "5"].map((n) => {
                            const selected = values.includes(n);
                            return (
                              <button
                                key={n}
                                type="button"
                                onClick={() => {
                                  const next = selected ? values.filter((x) => x !== n) : [...values, n];
                                  updateUrl({ [key]: next, page: 1 });
                                }}
                                className={`min-w-[2rem] rounded-lg px-2.5 py-1.5 text-sm font-medium transition ${selected ? "bg-[var(--accent)] text-white" : "border border-white/[0.12] bg-[var(--surface)] text-[var(--foreground)] hover:border-white/20"}`}
                              >
                                {n === "5" ? "5+" : n}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {beds.map((b) => <input type="hidden" name="beds" value={b} key={`beds-${b}`} />)}
                {baths.map((b) => <input type="hidden" name="baths" value={b} key={`baths-${b}`} />)}
                {dens.map((d) => <input type="hidden" name="dens" value={d} key={`dens-${d}`} />)}
              </div>
              <div>
                <label htmlFor="propertyType" className="block text-xs font-medium text-[var(--muted)]">Property type</label>
                <select
                  id="propertyType"
                  name="propertyType"
                  defaultValue={propertyType || ""}
                  className="mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)]"
                >
                  {PROPERTY_TYPES.map((opt) => (
                    <option key={opt.value || "any"} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
              >
                Apply filters
              </button>
              <button
                type="button"
                onClick={() => { clearAll(); setFiltersOpen(false); }}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-white/5"
              >
                Clear all
              </button>
            </div>
          </form>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Results */}
        {view === "map" ? (
          <ListingsMapClient listings={listings} showFitBounds={listings.length > 0} />
        ) : (
          <>
            {loading ? (
              <ListingsSkeleton count={PAGE_SIZE} />
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-[var(--surface)] py-20 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-elevated)] text-white/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <p className="text-base font-medium text-[var(--foreground)]">No listings found</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Try adjusting your filters or search.</p>
                {filterChips.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-5 inline-flex h-10 items-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.map((listing) => (
                    <ListingCardComponent
                      key={listing.id}
                      listing={toListingCardFromResult(listing)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    className="mt-10 flex items-center justify-center gap-1.5"
                    aria-label="Pagination"
                  >
                    <button
                      type="button"
                      onClick={() => updateUrl({ page: page - 1 })}
                      disabled={page <= 1}
                      className="inline-flex h-9 items-center gap-1 rounded-xl border border-white/10 px-3 text-sm font-medium text-[var(--foreground)] hover:bg-white/5 disabled:pointer-events-none disabled:opacity-30"
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 3L5 8l5 5" />
                      </svg>
                      Prev
                    </button>

                    {pageRange(page, totalPages).map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-white/30">…</span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => updateUrl({ page: p })}
                          aria-current={p === page ? "page" : undefined}
                          className={`inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl text-sm font-medium transition ${
                            p === page
                              ? "bg-[var(--accent)] text-white"
                              : "border border-white/10 text-[var(--foreground)] hover:bg-white/5"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      onClick={() => updateUrl({ page: page + 1 })}
                      disabled={page >= totalPages}
                      className="inline-flex h-9 items-center gap-1 rounded-xl border border-white/10 px-3 text-sm font-medium text-[var(--foreground)] hover:bg-white/5 disabled:pointer-events-none disabled:opacity-30"
                    >
                      Next
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l5 5-5 5" />
                      </svg>
                    </button>
                  </nav>
                )}
              </>
            )}
          </>
        )}

        {/* Legal attribution */}
        <p className="mt-10 text-center text-xs text-white/25">
          Listings provided by Yorksell Real Estate Group & Royal LePage Real Estate Services Ltd.
        </p>
      </div>
    </main>
  );
}
