"use client";

import { useCallback, useEffect, useState } from "react";

type SyncState = {
  lastRunAt: string | null;
  status: string | null;
  lastError: string | null;
  processed: number | null;
  upserted: number | null;
  errorCount: number | null;
};

type Schedule = {
  enabled: boolean;
  time: string;
  timezone: string;
  lastScheduledRunAt?: string | null;
};

const TIMEZONES = [
  { value: "America/Toronto", label: "Eastern (Toronto)" },
  { value: "America/Winnipeg", label: "Central (Winnipeg)" },
  { value: "America/Edmonton", label: "Mountain (Edmonton)" },
  { value: "America/Vancouver", label: "Pacific (Vancouver)" },
  { value: "UTC", label: "UTC" },
];

export default function AdminPage() {
  const [state, setState] = useState<SyncState | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<unknown>(null);
  const [limit, setLimit] = useState("200");
  const [pages, setPages] = useState("10");
  const [dryRun, setDryRun] = useState(false);
  const [fetchDetails, setFetchDetails] = useState(true);

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

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

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/mls-sync-schedule", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setSchedule(data);
    } finally {
      setScheduleLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

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
          fetchDetails,
        }),
      });
      const data = await res.json().catch(() => ({}));
      setTriggerResult(data);
      await fetchStatus();
    } finally {
      setTriggering(false);
    }
  }

  async function saveSchedule() {
    if (schedule == null) return;
    setScheduleSaving(true);
    setScheduleMessage(null);
    try {
      const res = await fetch("/api/admin/mls-sync-schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: schedule.enabled,
          time: schedule.time,
          timezone: schedule.timezone,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to save");
      }
      setScheduleMessage({ type: "ok", text: "Daily sync schedule saved." });
    } catch (e) {
      setScheduleMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Failed to save",
      });
    } finally {
      setScheduleSaving(false);
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
              checked={fetchDetails}
              onChange={(e) => setFetchDetails(e.target.checked)}
              className="rounded border-zinc-300"
            />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Fetch full details (address, price, photos — slower, recommended)
            </span>
          </label>
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
        {triggerResult != null && (
          <pre className="mt-4 max-h-60 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-700 dark:bg-zinc-800">
            {JSON.stringify(triggerResult, null, 2)}
          </pre>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Daily sync
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Run DDF sync automatically once per day at the set time (requires Vercel Cron and <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">CRON_SECRET</code> in production).
        </p>
        {scheduleLoading ? (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
        ) : schedule ? (
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={schedule.enabled}
                onChange={(e) =>
                  setSchedule((s) => (s ? { ...s, enabled: e.target.checked } : s))
                }
                className="rounded border-zinc-300"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Enable daily sync
              </span>
            </label>
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label htmlFor="schedule-time" className="block text-xs text-zinc-500">
                  Time
                </label>
                <input
                  id="schedule-time"
                  type="time"
                  value={schedule.time}
                  onChange={(e) =>
                    setSchedule((s) => (s ? { ...s, time: e.target.value } : s))
                  }
                  className="mt-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                />
              </div>
              <div>
                <label htmlFor="schedule-tz" className="block text-xs text-zinc-500">
                  Timezone
                </label>
                <select
                  id="schedule-tz"
                  value={schedule.timezone}
                  onChange={(e) =>
                    setSchedule((s) => (s ? { ...s, timezone: e.target.value } : s))
                  }
                  className="mt-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {schedule.lastScheduledRunAt && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Last auto-run:{" "}
                {new Date(schedule.lastScheduledRunAt).toLocaleString()}
              </p>
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={saveSchedule}
                disabled={scheduleSaving}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {scheduleSaving ? "Saving…" : "Save schedule"}
              </button>
              {scheduleMessage && (
                <span
                  className={
                    scheduleMessage.type === "ok"
                      ? "text-sm text-green-600 dark:text-green-400"
                      : "text-sm text-red-600 dark:text-red-400"
                  }
                >
                  {scheduleMessage.text}
                </span>
              )}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
