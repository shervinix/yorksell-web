"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const SOURCE_LABELS: Record<string, string> = {
  contact_page: "Contact",
  listing_contact: "Listing",
  home_cta: "Home CTA",
  compass_page: "Compass",
  valuation_page: "Valuation",
  join_page: "Join",
};

const SOURCE_COLORS: Record<string, string> = {
  contact_page: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  listing_contact: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  home_cta: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  compass_page: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  valuation_page: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  join_page: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
};

type Lead = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  source: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  listing: { mlsNumber: string | null; addressLine: string | null; city: string | null } | null;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const [q, setQ] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        ...(source && { source }),
        ...(q && { q }),
      });
      const res = await fetch(`/api/admin/leads?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setLeads(data.leads ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, source, q]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Leads</h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{total} total</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email…"
          className="w-64 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <select
          value={source}
          onChange={(e) => { setSource(e.target.value); setPage(1); }}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="">All sources</option>
          {Object.entries(SOURCE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Search
        </button>
      </form>

      <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
        ) : leads.length === 0 ? (
          <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">No leads found.</p>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {leads.map((lead) => (
              <li key={lead.id}>
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                  className="w-full px-5 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {lead.name ?? "(no name)"}
                        </span>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">{lead.email}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            SOURCE_COLORS[lead.source] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {SOURCE_LABELS[lead.source] ?? lead.source}
                        </span>
                      </div>
                      {lead.message && (
                        <p className="mt-1 truncate text-sm text-zinc-400 max-w-xl">
                          {lead.message}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-zinc-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>

                {expandedId === lead.id && (
                  <div className="border-t border-zinc-100 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                    <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2 text-sm">
                      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Email</dt>
                      <dd className="text-zinc-700 dark:text-zinc-300">
                        <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                      </dd>
                      {lead.phone && (
                        <>
                          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Phone</dt>
                          <dd className="text-zinc-700 dark:text-zinc-300">{lead.phone}</dd>
                        </>
                      )}
                      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Submitted</dt>
                      <dd className="text-zinc-700 dark:text-zinc-300">
                        {new Date(lead.createdAt).toLocaleString()}
                      </dd>
                      {lead.listing && (
                        <>
                          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Listing</dt>
                          <dd className="text-zinc-700 dark:text-zinc-300">
                            {lead.listing.mlsNumber}
                            {lead.listing.addressLine ? ` — ${lead.listing.addressLine}` : ""}
                            {lead.listing.city ? `, ${lead.listing.city}` : ""}
                          </dd>
                        </>
                      )}
                      {lead.message && (
                        <>
                          <dt className="col-span-2 mt-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Message
                          </dt>
                          <dd className="col-span-2 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                            {lead.message}
                          </dd>
                        </>
                      )}
                      {lead.metadata && Object.keys(lead.metadata).length > 0 && (
                        <>
                          <dt className="col-span-2 mt-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                            Details
                          </dt>
                          {Object.entries(lead.metadata).map(([k, v]) => (
                            <>
                              <dt key={k + "_k"} className="text-xs text-zinc-400 capitalize">
                                {k.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                              </dt>
                              <dd key={k + "_v"} className="text-zinc-700 dark:text-zinc-300">
                                {String(v)}
                              </dd>
                            </>
                          ))}
                        </>
                      )}
                    </dl>
                    {lead.email && (
                      <div className="mt-4">
                        <Link
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        >
                          Reply by email
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page >= pages}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
