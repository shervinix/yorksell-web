"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)]/70 outline-none transition focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20";

export default function JoinNetworkForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();
    if (!trimmedEmail || !trimmedName) {
      setStatus("error");
      setMessage("Please provide both name and email.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, name: trimmedName, source: "newsletter" }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "Thanks, you're on the list.");
      setEmail("");
      setName("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full min-w-0 lg:max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <input
            type="email"
            name="email"
            required
            placeholder="Your email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            className={inputClass + " sm:w-40"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "loading"}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60 sm:px-8"
        >
          {status === "loading" ? "Joining…" : "Join"}
        </button>
      </div>
      {message && (
        <p className={"mt-3 text-sm " + (status === "success" ? "text-green-500" : status === "error" ? "text-red-400" : "text-[var(--muted)]")}>
          {message}
        </p>
      )}
    </form>
  );
}
