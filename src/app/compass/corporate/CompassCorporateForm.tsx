"use client";

import { useMemo, useState } from "react";

const VOLUME_OPTIONS = [
  "1–3 relocations per year",
  "4–10 relocations per year",
  "11–25 relocations per year",
  "25+ relocations per year",
  "Not sure yet",
] as const;

const CORRIDOR_OPTIONS = [
  "US to Toronto",
  "Toronto to US",
  "International to Toronto",
  "Toronto to international",
  "Within Canada (other cities to Toronto)",
  "Mixed / multiple corridors",
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

export default function CompassCorporateForm() {
  const [contactName, setContactName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [volume, setVolume] = useState("");
  const [corridor, setCorridor] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formReady = useMemo(
    () =>
      contactName.trim().length > 0 &&
      company.trim().length > 0 &&
      email.trim().length > 0 &&
      volume.trim().length > 0,
    [contactName, company, email, volume]
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
        company: company.trim(),
        annualRelocationVolume: volume.trim(),
      };
      if (title.trim()) metadata.jobTitle = title.trim();
      if (corridor.trim()) metadata.primaryCorridor = corridor.trim();
      if (phone.trim()) metadata.phone = phone.trim();
      if (notes.trim()) metadata.notes = notes.trim();

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          message: notes.trim() || undefined,
          source: "compass_corporate",
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
        <p className="text-lg font-semibold text-[var(--foreground)]">Enquiry received.</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          A member of our team will be in touch within one business day to discuss your company&apos;s relocation needs.
        </p>
        <button
          type="button"
          className="mt-6 text-sm font-medium text-[var(--accent)] hover:underline"
          onClick={() => setSent(false)}
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="text-[var(--foreground)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Corporate enquiry</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
        Tell us about your program.
      </h2>
      <p className="mt-2 text-[var(--muted)]">
        Share your relocation needs and we&apos;ll put together a program proposal within one business day.
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-10">

        {/* Step 1 — Contact */}
        <div>
          <StepHeader number="01" title="Your details" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="corp-name" className={labelClass}>Full name</label>
              <input
                id="corp-name"
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className={inputClass}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="corp-title" className={labelClass}>
                Job title <span className="normal-case font-normal text-[var(--muted)]">(optional)</span>
              </label>
              <input
                id="corp-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="e.g. Head of HR, Mobility Manager"
              />
            </div>
            <div>
              <label htmlFor="corp-company" className={labelClass}>Company name</label>
              <input
                id="corp-company"
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClass}
                placeholder="Your company"
              />
            </div>
            <div>
              <label htmlFor="corp-email" className={labelClass}>Work email</label>
              <input
                id="corp-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@company.com"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="corp-phone" className={labelClass}>
                Phone <span className="normal-case font-normal text-[var(--muted)]">(optional)</span>
              </label>
              <input
                id="corp-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        {/* Step 2 — Volume */}
        <div>
          <StepHeader number="02" title="Relocation volume" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {VOLUME_OPTIONS.map((option) => {
              const selected = volume === option;
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
                    name="corp-volume"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                    value={option}
                    checked={selected}
                    onChange={(e) => setVolume(e.target.value)}
                    required
                  />
                  <span className="text-sm font-medium text-[var(--foreground)]">{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 3 — Corridor & notes */}
        <div>
          <StepHeader number="03" title="Program details" />
          <div className="space-y-4">
            <div>
              <label htmlFor="corp-corridor" className={labelClass}>
                Primary relocation corridor <span className="normal-case font-normal text-[var(--muted)]">(optional)</span>
              </label>
              <select
                id="corp-corridor"
                value={corridor}
                onChange={(e) => setCorridor(e.target.value)}
                className={inputClass}
              >
                <option value="">Select the most common corridor</option>
                {CORRIDOR_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="corp-notes" className={labelClass}>
                Tell us about your relocation program <span className="normal-case font-normal text-[var(--muted)]">(optional)</span>
              </label>
              <textarea
                id="corp-notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={inputClass}
                placeholder="Current process, pain points, timeline, any specific requirements for your employees..."
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
          {loading ? "Sending…" : <><span>Request a program proposal</span><ArrowIcon /></>}
        </button>

        <p className="text-center text-xs text-[var(--muted)]">
          Your information is shared only with Yorksell. We respond within one business day.
        </p>
      </form>
    </div>
  );
}
