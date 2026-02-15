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
    "mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-black";

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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-zinc-200">
        <h1 className="text-2xl font-semibold text-zinc-900">
          {isAdminLogin ? "Yorksell Admin" : "Log in"}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {isAdminLogin
            ? "Sign in to access the admin panel. Manage clients, MLS sync, and more."
            : "Access your Yorksell member dashboard."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-zinc-800">Email</label>
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
            <label className="text-sm font-medium text-zinc-800">Password</label>
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
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black py-2.5 text-white font-medium disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {!isAdminLogin && (
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="w-full rounded-xl border py-2.5 text-zinc-900 font-medium"
            >
              Create an account
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
