"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteAccountSection() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onConfirm() {
    if (!password.trim()) {
      setError("Enter your password to confirm.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to delete account.");
        setLoading(false);
        return;
      }
      setOpen(false);
      await signOut({ redirect: false });
      router.push("/");
      router.refresh();
    } catch {
      setError("Failed to delete account.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--muted)] outline-none focus:ring-2 focus:ring-red-500/50";

  return (
    <>
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-red-400">
          Danger zone
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Once you delete your account, there is no going back. All your data will be permanently removed.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex h-11 items-center justify-center rounded-xl border border-red-500/30 px-5 text-sm font-medium text-red-400 hover:bg-red-500/10"
        >
          Delete account
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !loading && setOpen(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] p-6 shadow-xl">
            <h2 id="delete-account-title" className="text-lg font-semibold text-[var(--foreground)]">
              Delete account
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              This action cannot be undone. Enter your password to confirm.
            </p>
            <div className="mt-4">
              <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                Password
              </label>
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                disabled={loading}
              />
            </div>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => !loading && setOpen(false)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-white/5 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {loading ? "Deleting…" : "Delete my account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
