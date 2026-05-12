"use client";

import { useMemo, useState } from "react";

const MARKET_OPTIONS = [
  "US – Northeast (NY, MA, CT, NJ)",
  "US – West Coast (CA, WA, OR)",
  "US – Southeast (FL, GA, NC)",
  "US – Other",
  "British Columbia",
  "Alberta",
  "Quebec",
  "Other Canadian province",
  "International",
] as const;

const labelClass = "block text-xs font-medium uppercase tracking-wider text-[var(--muted)]";
const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.12] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)]/60 outline-none transition focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20";

function StepHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-xs font-semibold text-[var(--accent)]">
        {number}
      </span>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">{title}</h3>
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CompassPartnerForm() {
  const [fullName, setFullName] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [market, setMarket] = useState("");
  const [volume, setVolume] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formReady = useMemo(
    () =>
      fullName.trim().length > 0 &&
      brokerage.trim().length > 0 &&
      email.trim().length > 0 &&
      market.trim().length > 0,
    [fullName, brokerage, email, market]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!formReady) {
      setError("Please complete all required fields.");
      return;
    }
    setLoading(true);
    try {
      const metadata: Record<string, string> = {
        brokerage: brokerage.trim(),
        primaryMarket: market.trim(),
      };
      if (volume.trim()) metadata.estimatedAnnualReferrals = volume.trim();
      if (phone.trim()) metadata.phone = phone.trim();
      if (notes.trim()) metadata.notes = notes.trim();

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          message: notes.trim() || undefined,
          source: "compass_partner",
          metadata,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] p-10 text-center shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/15">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[var(--accent)]" aria-hidden>
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-[var(--foreground)]">Application received.</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          We&apos;ll review your details and be in touch within one business day to discuss the program and referral structure.
        </p>
        <button
          type="button"
          className="mt-6 text-sm font-medium text-[var(--accent)] hover:underline"
          onClick={() => setSent(false)}
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="text-[var(--foreground)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Partner application</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
        Apply to join the program.
      </h2>
      <p className="mt-2 text-[var(--muted)]">
        Tell us about your practice and we&apos;ll follow up within one business day to confirm your partner status and referral structure.
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-10">

        {/* Step 1 — Your details */}
        <div>
          <StepHeader number="01" title="Your details" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="partner-name" className={labelClass}>Full name</label>
              <input
                id="partner-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="partner-brokerage" className={labelClass}>Brokerage</label>
              <input
                id="partner-brokerage"
                type="text"
                required
                value={brokerage}
                onChange={(e) => setBrokerage(e.target.value)}
                className={inputClass}
                placeholder="Your brokerage name"
              />
            </div>
            <div>
              <label htmlFor="partner-email" className={labelClass}>Email address</label>
              <input
                id="partner-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@brokerage.com"
              />
            </div>
            <div>
              <label htmlFor="partner-phone" className={labelClass}>
                Phone <span className="normal-case font-normal text-[var(--muted)]">(optional)</span>
              </label>
              <input
                id="partner-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        {/* Step 2 — Your market */}
        <div>
          <StepHeader number="02" title="Your market" />
          <div className="grid gap-3 sm:grid-cols-2">
            {MARKET_OPTIONS.map((option) => {
              const selected = market === option;
              return (
                <label
                  key={option}
                  className={
                    "flex cursor-pointer gap-3 rounded-xl border p-4 transition " +
                    (selected
                      ? "border-[var(--accent)]/50 bg-[var(--accent)]/10"
                      : "border-white/[0.08] bg-[var(--surface-elevated)] hover:border-white/[0.18]")
                  }
                >
                  <input
                    type="radio"
                    name="partner-market"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                    value={option}
                    checked={selected}
                    onChange={(e) => setMarket(e.target.value)}
                    required
                  />
                  <span className="text-sm font-medium text-[var(--foreground)]">{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 3 — Volume & notes */}
        <div>
          <StepHeader number="03" title="Your practice" />
          <div className="space-y-4">
            <div>
              <label htmlFor="partner-volume" className={labelClass}>
                Estimated referrals per year <span className="normal-case font-normal text-[var(--muted)]">(optional)</span>
              </label>
              <input
                id="partner-volume"
                type="text"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className={inputClass}
                placeholder="e.g. 2–5 clients per year moving to/from Toronto"
              />
            </div>
            <div>
              <label htmlFor="partner-notes" className={labelClass}>
                Anything else we should know <span className="normal-case font-normal text-[var(--muted)]">(optional)</span>
              </label>
              <textarea
                id="partner-notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={inputClass}
                placeholder="Tell us about your typical relocating client, your current referral process, or any questions about the program..."
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !formReady}
          className="inline-flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
        >
          {loading ? "Sending…" : <><span>Apply to partner</span><ArrowIcon /></>}
        </button>

        <p className="text-center text-xs text-[var(--muted)]">
          Your information is shared only with Yorksell. We respond within one business day.
        </p>
      </form>
    </div>
  );
}
