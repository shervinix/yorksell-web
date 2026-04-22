import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-[var(--foreground)]">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
            <p className="text-[var(--muted)]">Loading…</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
