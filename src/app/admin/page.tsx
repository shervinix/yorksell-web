"use client";

import { useEffect, useState } from "react";

type SyncState = {
  lastRunAt: string | null;
  status: string | null;
  lastError: string | null;
  processed: number | null;
  upserted: number | null;
  errorCount: number | null;
};

export default function AdminPage() {
  const [state, setState] = useState<SyncState | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<unknown>(null);
  const [limit, setLimit] = useState("200");
  const [pages, setPages] = useState("10");
  const [dryRun, setDryRun] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/admin/sync-status", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setState(data.state);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  async function runSync() {
    setTriggering(true);
    setTriggerResult(null);
    try {
      const res = await fetch("/api/admin/sync-trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          limit: Number(limit) || 200,
          pages: Number(pages) || 10,
          dryRun,
        }),
      });
      const data = await res.json().catch(() => ({}));
      setTriggerResult(data);
      await fetchStatus();
    } finally {
      setTriggering(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        MLS Sync
      </h1>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Last run
        </h2>
        {loading ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Loading…
          </p>
        ) : !state ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            No sync has run yet.
          </p>
        ) : (
          <dl className="mt-3 grid gap-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-zinc-500 dark:text-zinc-400">Status</dt>
              <dd className="font-medium">{state.status ?? "—"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-zinc-500 dark:text-zinc-400">Last run</dt>
              <dd>
                {state.lastRunAt
                  ? new Date(state.lastRunAt).toLocaleString()
                  : "—"}
              </dd>
            </div>
            {state.processed != null && (
              <div className="flex gap-2">
                <dt className="text-zinc-500 dark:text-zinc-400">Processed</dt>
                <dd>{state.processed}</dd>
              </div>
            )}
            {state.upserted != null && (
              <div className="flex gap-2">
                <dt className="text-zinc-500 dark:text-zinc-400">Upserted</dt>
                <dd>{state.upserted}</dd>
              </div>
            )}
            {state.errorCount != null && state.errorCount > 0 && (
              <div className="flex gap-2">
                <dt className="text-zinc-500 dark:text-zinc-400">Errors</dt>
                <dd className="text-red-600 dark:text-red-400">{state.errorCount}</dd>
              </div>
            )}
            {state.lastError && (
              <div className="flex gap-2">
                <dt className="text-zinc-500 dark:text-zinc-400">Last error</dt>
                <dd className="text-red-600 dark:text-red-400">{state.lastError}</dd>
              </div>
            )}
          </dl>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Run sync now
        </h2>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="limit" className="block text-xs text-zinc-500">
              Limit
            </label>
            <input
              id="limit"
              type="number"
              min={1}
              max={5000}
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="mt-1 w-24 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          <div>
            <label htmlFor="pages" className="block text-xs text-zinc-500">
              Pages
            </label>
            <input
              id="pages"
              type="number"
              min={1}
              max={50}
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="mt-1 w-20 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
              className="rounded border-zinc-300"
            />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Dry run (no DB writes)
            </span>
          </label>
          <button
            type="button"
            onClick={runSync}
            disabled={triggering}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {triggering ? "Running…" : "Run sync"}
          </button>
        </div>
        {triggerResult && (
          <pre className="mt-4 max-h-60 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-700 dark:bg-zinc-800">
            {JSON.stringify(triggerResult, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}
