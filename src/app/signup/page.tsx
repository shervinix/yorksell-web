"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

const labelClass = "block text-xs font-medium uppercase tracking-wider text-[var(--muted)]";
const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)]/60 outline-none transition focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500"];
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-white/[0.08]"}`}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]">{labels[score - 1] ?? ""}</p>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // Auto-login after successful signup — skip the /login redirect.
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/members",
      });

      if (!signInRes || signInRes.error) {
        // Account was created but auto-login failed — fall back to login page.
        router.push("/login?callbackUrl=/members");
        return;
      }

      router.push("/members");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-[var(--foreground)]">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[var(--surface-elevated)] p-8 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Link href="/" aria-label="Yorksell home">
            <img src="/logo.png" alt="Yorksell Real Estate Group" className="h-20 w-auto object-contain" />
          </Link>
        </div>

        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Create your account</h1>
        <p className="mt-1.5 text-sm text-[var(--muted)]">
          Members get access to saved properties, inquiries, and private updates.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className={labelClass}>
              Name <span className="normal-case tracking-normal opacity-50">(optional)</span>
            </label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                className={inputClass + " pr-11"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                type={showPw ? "text" : "password"}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                aria-label={showPw ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          <div>
            <label className={labelClass}>Confirm password</label>
            <div className="relative">
              <input
                className={inputClass + " pr-11"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                type={showConfirm ? "text" : "password"}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            {confirm && password !== confirm && (
              <p className="mt-1 text-xs text-red-400">Passwords don&apos;t match</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex w-full h-11 items-center justify-center rounded-xl border border-white/[0.12] bg-transparent px-5 text-sm font-medium text-[var(--foreground)] transition hover:bg-white/[0.05]"
          >
            Already have an account? Log in
          </button>
        </form>
      </div>
    </div>
  );
}
