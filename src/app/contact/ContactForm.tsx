"use client";

import { useState } from "react";

type Prefill = { name: string; email: string; phone: string };
type ContactFormProps = {
  initialListing?: string | null;
  prefill?: Prefill;
};

const labelClass = "block text-xs font-medium uppercase tracking-wider text-[var(--muted)]";
const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.12] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)]/60 outline-none transition focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20";

const MAX_MESSAGE = 2000;

function RequiredStar() {
  return <span className="ml-0.5 text-[var(--accent)]" aria-hidden>*</span>;
}

export default function ContactForm({ initialListing = null, prefill }: ContactFormProps) {
  const listingParam = initialListing ?? "";

  const [name, setName] = useState(prefill?.name ?? "");
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [phone, setPhone] = useState(prefill?.phone ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
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
      setSentEmail(email.trim());
      setSent(true);
      setName(prefill?.name ?? "");
      setEmail(prefill?.email ?? "");
      setPhone(prefill?.phone ?? "");
      setMessage("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)]">Message sent!</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          We&apos;ll reply to <span className="font-medium text-[var(--foreground)]">{sentEmail}</span> within one business day.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-[var(--surface)] px-4 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-[var(--muted)]">Typical response: same business day</span>
        </div>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
        Send a message
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Share your timeline or question and we&apos;ll get back to you.
        <span className="ml-2 text-[var(--muted)]/60">Fields marked <span className="text-[var(--accent)]">*</span> are required.</span>
      </p>

      {listingParam && (
        <p className="mt-5 rounded-xl border border-white/[0.08] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
          Inquiring about listing <strong className="text-[var(--foreground)]">{listingParam}</strong>
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-7 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className={labelClass}>Name</label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Your name"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email<RequiredStar />
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone<RequiredStar />
          </label>
          <input
            id="contact-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            placeholder="(416) 555-0000"
            autoComplete="tel"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="contact-message" className={labelClass}>Message</label>
            <span className={`text-xs tabular-nums transition ${message.length > MAX_MESSAGE * 0.9 ? "text-amber-400" : "text-[var(--muted)]/50"}`}>
              {message.length} / {MAX_MESSAGE.toLocaleString()}
            </span>
          </div>
          <textarea
            id="contact-message"
            rows={6}
            value={message}
            onChange={(e) => {
              if (e.target.value.length <= MAX_MESSAGE) setMessage(e.target.value);
            }}
            className={inputClass}
            placeholder="Your timeline, budget, preferred neighbourhoods, or any questions…"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0l6.353 11zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sending…
            </>
          ) : (
            <>
              Send message
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden>
                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>

        <p className="text-center text-xs text-[var(--muted)]/60">
          By submitting you agree to be contacted by Yorksell Real Estate Group.
        </p>
      </form>
    </div>
  );
}
