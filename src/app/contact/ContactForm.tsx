"use client";

import { useState } from "react";

type ContactFormProps = { initialListing?: string | null };

const labelClass = "block text-xs font-medium uppercase tracking-wider text-[var(--muted)]";
const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.12] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)]/60 outline-none transition focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20";

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
      body.phone = phone.trim();
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
      setName(""); setEmail(""); setPhone(""); setMessage("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-[var(--foreground)]">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
        Send a message
      </h2>
      <p className="mt-2 text-[var(--muted)]">
        Share your timeline or question and we&apos;ll get back to you.
      </p>

      {listingParam && (
        <p className="mt-6 rounded-xl border border-white/[0.08] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
          Inquiring about listing <strong className="text-[var(--foreground)]">{listingParam}</strong>
        </p>
      )}

      {sent ? (
        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
          <p className="font-medium text-[var(--foreground)]">Thank you. We&apos;ll be in touch soon.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            <button type="button" onClick={() => setSent(false)} className="font-medium text-[var(--accent)] hover:underline">
              Send another message
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className={labelClass}>Name</label>
              <input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>Email</label>
              <input id="contact-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label htmlFor="contact-phone" className={labelClass}>Phone</label>
            <input id="contact-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="Best number to reach you" />
          </div>
          <div>
            <label htmlFor="contact-message" className={labelClass}>Message</label>
            <textarea id="contact-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} placeholder="Your timeline, budget, or question..." />
          </div>
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
          )}
          <button type="submit" disabled={loading} className="inline-flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60">
            {loading ? "Sending…" : <><span>Send message</span><ArrowIcon /></>}
          </button>
        </form>
      )}
    </div>
  );
}
