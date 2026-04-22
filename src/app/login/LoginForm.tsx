"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function safeCallbackUrl(raw: string | null): string {
  if (!raw || typeof raw !== "string") return "/members";
  const s = raw.trim();
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  return "/members";
}

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = safeCallbackUrl(params.get("callbackUrl"));
  const isAdminLogin = callbackUrl === "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "mt-1 w-full rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] placeholder-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]/50";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-[var(--foreground)]">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          {isAdminLogin ? "Yorksell Admin" : "Log in"}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {isAdminLogin
            ? "Sign in to access the admin panel. Manage clients, MLS sync, and more."
            : "Access your Yorksell member dashboard."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">Email</label>
            <input
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@yorksell.dev"
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
              placeholder="Your password"
              type="password"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--accent)] py-2.5 font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {!isAdminLogin && (
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="w-full rounded-xl border border-white/10 bg-transparent py-2.5 font-medium text-[var(--foreground)] transition hover:bg-white/5"
            >
              Create an account
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
