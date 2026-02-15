import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-zinc-200">
            <p className="text-zinc-600">Loading…</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
