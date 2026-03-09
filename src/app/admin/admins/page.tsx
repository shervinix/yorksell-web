"use client";

import { useCallback, useEffect, useState } from "react";

export default function AdminAdminsPage() {
  const [envAdmins, setEnvAdmins] = useState<string[]>([]);
  const [additionalAdmins, setAdditionalAdmins] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [newEmail, setNewEmail] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/admins", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setEnvAdmins(Array.isArray(data.envAdmins) ? data.envAdmins : []);
      setAdditionalAdmins(Array.isArray(data.additionalAdmins) ? data.additionalAdmins : []);
    } catch {
      setEnvAdmins([]);
      setAdditionalAdmins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ additionalAdmins }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to save");
      }
      setMessage({ type: "ok", text: "Admin list saved. New admins can log in with their existing account." });
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
    const email = newEmail.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewEmail("");
      return;
    }
    if (envAdmins.includes(email) || additionalAdmins.includes(email)) {
      setNewEmail("");
      return;
    }
    setAdditionalAdmins((prev) => [...prev, email]);
    setNewEmail("");
  }

  function remove(index: number) {
    setAdditionalAdmins((prev) => prev.filter((_, i) => i !== index));
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Admin access
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Admin access
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Grant admin access to other users by adding their login email below. They must already have an account — they will get admin when they sign in with that email.
      </p>

      {envAdmins.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Admins from environment (read-only)
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Set via <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">ADMIN_EMAILS</code>.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {envAdmins.map((email) => (
              <li
                key={email}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              >
                {email}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Additional admins (granted here)
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Add the exact email address the user signs in with. They keep admin until you remove them.
        </p>
        {additionalAdmins.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            No additional admins yet. Add an email below.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {additionalAdmins.map((email, i) => (
              <li
                key={`${email}-${i}`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <span className="text-sm">{email}</span>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                  aria-label="Remove admin"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            placeholder="email@example.com"
            className="w-56 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            type="button"
            onClick={add}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Add admin
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
          {saving ? "Saving…" : "Save changes"}
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
