import Link from "next/link";

type Props = {
  searchParams?: { q?: string };
};

type Listing = {
  id: string;
  address: string;
  city: string;
  price: number;
  beds?: number;
  baths?: number;
  url?: string;
};

export default async function SearchPage({ searchParams }: Props) {
  const q = (searchParams?.q ?? "").trim();

  let results: Listing[] = [];
  let error: string | null = null;

  if (q) {
    try {
      const res = await fetch(
        `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/mls/search?q=${encodeURIComponent(q)}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Search failed (${res.status})`);
      }

      results = await res.json();
    } catch (e: any) {
      error = e?.message ?? "Search failed.";
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">MLS Search</h1>
            <p className="mt-2 text-zinc-600">
              Showing results for: <span className="font-medium">{q || "—"}</span>
            </p>
          </div>

          <Link
            href="/"
            className="text-sm font-medium text-zinc-700 hover:text-black"
          >
            ← Back home
          </Link>
        </div>

        <form action="/search" method="GET" className="mt-8 flex gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search MLS: address, neighbourhood, city..."
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="rounded-md bg-black px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800 transition"
          >
            Search
          </button>
        </form>

        {error && (
          <div className="mt-8 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!q && (
          <div className="mt-10 rounded-xl border border-zinc-200 p-6 text-zinc-600">
            Enter a search term above to begin.
          </div>
        )}

        {q && !error && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold">
              Results ({results.length})
            </h2>

            <div className="mt-4 grid gap-4">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-zinc-200 p-5 hover:border-zinc-300 transition"
                >
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
                      {r.url ? (
                        <a
                          href={r.url}
                          className="text-sm font-medium text-zinc-700 hover:text-black"
                        >
                          View →
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}

              {results.length === 0 && (
                <div className="rounded-xl border border-zinc-200 p-6 text-zinc-600">
                  No results returned yet. (If you haven’t connected CREA DDF, this is expected.)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}