"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Signup failed.");
        setLoading(false);
        return;
      }

      setSuccess("Account created. Redirecting to login...");
      setLoading(false);
      setTimeout(() => router.push("/login"), 600);
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]/50";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-[var(--foreground)]">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Create your account</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Members get access to saved properties and private insights.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">Name</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Shervin"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">Email</label>
            <input
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yorksell.com"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">Password</label>
            <input
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              type="password"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--accent)] py-2.5 font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full rounded-xl border border-white/10 bg-transparent py-2.5 font-medium text-[var(--foreground)] transition hover:bg-white/5"
          >
            Already have an account? Log in
          </button>
        </form>
      </div>
    </div>
  );
}