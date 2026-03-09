"use client";

import { useCallback, useEffect, useState } from "react";

export default function AdminFeaturedPage() {
  const [mlsNumbers, setMlsNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [newMls, setNewMls] = useState("");

  const fetchList = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/featured-listings", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setMlsNumbers(Array.isArray(data.mlsNumbers) ? data.mlsNumbers : []);
    } catch {
      setMlsNumbers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/featured-listings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mlsNumbers }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to save");
      }
      setMessage({ type: "ok", text: "Featured list updated. Homepage will show these in order." });
    } catch (e) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Failed to save",
      });
    } finally {
      setSaving(false);
    }
  }

  function add() {
    const v = newMls.trim().toUpperCase();
    if (!v || mlsNumbers.map((n) => n.toUpperCase()).includes(v)) {
      setNewMls("");
      return;
    }
    setMlsNumbers((prev) => [...prev, v]);
    setNewMls("");
  }

  function remove(index: number) {
    setMlsNumbers((prev) => prev.filter((_, i) => i !== index));
  }

  function moveUp(index: number) {
    if (index <= 0) return;
    setMlsNumbers((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    if (index >= mlsNumbers.length - 1) return;
    setMlsNumbers((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Featured listings
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Featured listings
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        These MLS numbers are shown on the homepage in this order. Add, remove, or reorder below, then save.
      </p>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Order (first = left on homepage)
        </h2>
        {mlsNumbers.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            No listings yet. Add MLS numbers below.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {mlsNumbers.map((mls, i) => (
              <li
                key={`${mls}-${i}`}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <span className="w-6 text-xs text-zinc-500 dark:text-zinc-400">
                  {i + 1}.
                </span>
                <span className="flex-1 font-mono text-sm">{mls}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="rounded p-1.5 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 disabled:opacity-40 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                    aria-label="Move up"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === mlsNumbers.length - 1}
                    className="rounded p-1.5 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 disabled:opacity-40 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                    aria-label="Move down"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                    aria-label="Remove"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={newMls}
            onChange={(e) => setNewMls(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            placeholder="e.g. C12677558"
            className="w-40 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-mono dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            type="button"
            onClick={add}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Add MLS number
          </button>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {saving ? "Saving…" : "Save order"}
        </button>
        {message && (
          <span
            className={
              message.type === "ok"
                ? "text-sm text-green-600 dark:text-green-400"
                : "text-sm text-red-600 dark:text-red-400"
            }
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
