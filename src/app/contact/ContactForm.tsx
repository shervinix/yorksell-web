"use client";

import Link from "next/link";
import { useState } from "react";

type ContactFormProps = { initialListing?: string | null };

export default function ContactForm({ initialListing = null }: ContactFormProps) {
  const listingParam = initialListing ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const body: Record<string, string> = {
        email: email.trim(),
        source: listingParam ? "listing_contact" : "contact_page",
      };
      if (name.trim()) body.name = name.trim();
      if (phone.trim()) body.phone = phone.trim();
      if (message.trim()) body.message = message.trim();
      if (listingParam) body.mlsNumber = listingParam;

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]/50";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 md:py-14">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]">
          ← Back to home
        </Link>
        <div className="mt-8">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Contact
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Share your timeline or question and we&apos;ll get back to you.
          </p>
        </div>

        {listingParam && (
          <p className="mt-4 rounded-xl border border-white/[0.06] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
            Inquiring about listing <strong className="text-[var(--foreground)]">{listingParam}</strong>
          </p>
        )}

        {sent ? (
          <div className="mt-8 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
            <p className="font-medium text-[var(--foreground)]">Thank you. We&apos;ll be in touch soon.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              <button type="button" onClick={() => setSent(false)} className="font-medium text-[var(--accent)] hover:underline">
                Send another message
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--foreground)]">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
                Email <span className="text-[var(--muted)]">(required)</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-[var(--foreground)]">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="Optional"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--foreground)]">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={inputClass}
                placeholder="Your timeline, budget, or question..."
              />
            </div>
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
