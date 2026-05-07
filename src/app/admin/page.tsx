"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SOURCE_LABELS: Record<string, string> = {
  contact_page: "Contact",
  listing_contact: "Listing",
  home_cta: "Home CTA",
  compass_page: "Compass",
  valuation_page: "Valuation",
  join_page: "Join",
};

type DashboardData = {
  stats: {
    totalLeads: number;
    newLeads: number;
    totalClients: number;
    totalListings: number;
    publishedPosts: number;
    draftPosts: number;
  };
  recentLeads: {
    id: string;
    name: string | null;
    email: string;
    source: string;
    createdAt: string;
    message: string | null;
  }[];
  syncState: {
    lastRunAt: string | null;
    status: string | null;
    lastError: string | null;
    processed: number | null;
    upserted: number | null;
  } | null;
};

function StatCard({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: number | string;
  sub?: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{sub}</p>}
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block transition hover:opacity-80">
        {inner}
      </Link>
    );
  }
  return inner;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
      </div>
    );
  }

  const { stats, recentLeads, syncState } = data ?? {
    stats: { totalLeads: 0, newLeads: 0, totalClients: 0, totalListings: 0, publishedPosts: 0, draftPosts: 0 },
    recentLeads: [],
    syncState: null,
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Leads"
          value={stats.totalLeads}
          sub={stats.newLeads > 0 ? `+${stats.newLeads} this week` : "None this week"}
          href="/admin/leads"
        />
        <StatCard
          label="Clients"
          value={stats.totalClients}
          href="/admin/clients"
        />
        <StatCard
          label="Listings"
          value={stats.totalListings.toLocaleString()}
          sub="Active MLS listings"
        />
        <StatCard
          label="Blog posts"
          value={stats.publishedPosts}
          sub={stats.draftPosts > 0 ? `${stats.draftPosts} draft${stats.draftPosts > 1 ? "s" : ""}` : "No drafts"}
          href="/admin/blog"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent leads */}
        <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Recent leads</h2>
            <Link
              href="/admin/leads"
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              View all →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">No leads yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="flex items-start justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {lead.name ?? lead.email}
                    </p>
                    <p className="truncate text-xs text-zinc-400">
                      {SOURCE_LABELS[lead.source] ?? lead.source}
                      {lead.message ? ` — ${lead.message.slice(0, 50)}${lead.message.length > 50 ? "…" : ""}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-400">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Sync health + quick links */}
        <div className="space-y-4">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">MLS sync</h2>
              <Link
                href="/admin/mls-sync"
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Manage →
              </Link>
            </div>
            {!syncState ? (
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">No sync run yet.</p>
            ) : (
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      syncState.status === "success"
                        ? "bg-green-500"
                        : syncState.status === "failed"
                        ? "bg-red-500"
                        : "bg-yellow-400"
                    }`}
                  />
                  <span className="font-medium capitalize text-zinc-800 dark:text-zinc-200">
                    {syncState.status ?? "Unknown"}
                  </span>
                </div>
                {syncState.lastRunAt && (
                  <p className="text-xs text-zinc-400">
                    Last run: {new Date(syncState.lastRunAt).toLocaleString()}
                  </p>
                )}
                {syncState.processed != null && (
                  <p className="text-xs text-zinc-400">
                    {syncState.upserted ?? 0} upserted / {syncState.processed} processed
                  </p>
                )}
                {syncState.lastError && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">{syncState.lastError}</p>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">Quick links</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/admin/clients", label: "Clients" },
                { href: "/admin/featured", label: "Featured listings" },
                { href: "/admin/blog", label: "Blog" },
                { href: "/admin/footprint", label: "Footprint" },
                { href: "/admin/admins", label: "Admins" },
                { href: "/admin/mls-sync", label: "MLS Sync" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
