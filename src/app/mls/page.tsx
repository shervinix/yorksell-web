"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Listing = {
  id: string;
  address: string;
  city: string;
  price: number;
  beds?: number;
  baths?: number;
  url?: string;
};

export default function MlsPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canSearch = useMemo(() => q.trim().length >= 2, [q]);

  async function runSearch() {
    const term = q.trim();
    if (!term) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/mls/search?q=${encodeURIComponent(term)}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as Listing[];
      setResults(data);
    } catch (e: any) {
      setError(e?.message ?? "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">MLS Search</h1>
            <p className="mt-2 text-zinc-600">
              Search by address, neighbourhood, or city.
            </p>
          </div>
          <Link href="/" className="text-sm font-medium text-zinc-700 hover:text-black">
            ← Back home
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try: 'King', 'Toronto', 'Leslieville'..."
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={runSearch}
              disabled={!canSearch || loading}
              className="rounded-md bg-black px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 transition"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          <p className="mt-2 text-xs text-zinc-500">
            Powered by CREA DDF (connection comes next). UI is ready now.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">Results</h2>
            <span className="text-sm text-zinc-500">{results.length} found</span>
          </div>

          <div className="mt-4 grid gap-4">
            {results.map((r) => (
              <div key={r.id} className="rounded-xl border border-zinc-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">
                      {r.address}, {r.city}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">
                      {typeof r.beds === "number" ? `${r.beds} bed` : "—"} ·{" "}
                      {typeof r.baths === "number" ? `${r.baths} bath` : "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      ${r.price.toLocaleString()}
                    </div>
                    <Link
                      href={r.url ?? `/listings/${encodeURIComponent(r.id)}`}
                      className="text-sm font-medium text-zinc-700 hover:text-black"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {!loading && results.length === 0 && (
              <div className="rounded-xl border border-zinc-200 p-6 text-zinc-600">
                No results yet. Search above to begin.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}