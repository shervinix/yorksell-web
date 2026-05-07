"use client";

import { useMemo, useState } from "react";

const INTEREST_OPTIONS = [
  "Physical move",
  "Legal and financial",
  "Cross-border (immigration, tax, banking)",
  "Home setup",
  "Lifestyle and wellness",
  "Family and community (schools, childcare)",
  "Not sure — help me figure it out",
] as const;

const MOVE_TYPE_OPTIONS = [
  { label: "Moving to Toronto", desc: "Arriving from another city or country" },
  { label: "Moving from Toronto", desc: "Relocating out of the GTA" },
  { label: "Moving to and from — I need both", desc: "Managing both sides of the move" },
  { label: "Not sure yet — I need guidance", desc: "Let us help you figure it out" },
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

export default function CompassIntakeForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [moveType, setMoveType] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formReady = useMemo(() => (
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    moveType.trim().length > 0 &&
    currentLocation.trim().length > 0 &&
    destination.trim().length > 0 &&
    moveDate.trim().length > 0 &&
    services.length > 0
  ), [currentLocation, destination, email, fullName, moveDate, moveType, services.length]);

  function toggleService(service: string) {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((i) => i !== service) : [...prev, service]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!formReady) { setError("Please complete all required fields."); return; }
    setLoading(true);
    try {
      const metadata: Record<string, string> = {
        moveType: moveType.trim(),
        currentCityCountry: currentLocation.trim(),
        destinationCityCountry: destination.trim(),
        approximateMoveDate: moveDate,
        servicesInterested: services.join(" | "),
      };
      if (phone.trim()) metadata.phoneNumber = phone.trim();
      if (notes.trim()) metadata.additionalContext = notes.trim();

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          message: notes.trim() || undefined,
          source: "compass_page",
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
      setFullName(""); setEmail(""); setPhone(""); setMoveType(""); setCurrentLocation("");
      setDestination(""); setMoveDate(""); setServices([]); setNotes("");
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
        <p className="text-lg font-semibold text-[var(--foreground)]">We&apos;ve received your details.</p>
        <p className="mt-2 text-sm text-[var(--muted)]">We&apos;ll be in touch within one business day to discuss your move.</p>
        <button type="button" className="mt-6 text-sm font-medium text-[var(--accent)] hover:underline" onClick={() => setSent(false)}>
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="text-[var(--foreground)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Start your move</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
        Tell us where you&apos;re headed.
      </h2>
      <p className="mt-2 text-[var(--muted)]">We&apos;ll take it from there — every detail of the move, managed.</p>

      <form onSubmit={onSubmit} className="mt-10 space-y-10">

        {/* Step 1 — Contact */}
        <div>
          <StepHeader number="01" title="Your details" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="compass-name" className={labelClass}>Full name</label>
              <input id="compass-name" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Your full name" />
            </div>
            <div>
              <label htmlFor="compass-email" className={labelClass}>Email address</label>
              <input id="compass-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="compass-phone" className={labelClass}>Phone <span className="normal-case font-normal text-[var(--muted)]">(optional)</span></label>
              <input id="compass-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="Best number to reach you" />
            </div>
            <div>
              <label htmlFor="compass-date" className={labelClass}>Approximate move date</label>
              <input id="compass-date" type="date" required value={moveDate} onChange={(e) => setMoveDate(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Step 2 — Move details */}
        <div>
          <StepHeader number="02" title="Your move" />
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {MOVE_TYPE_OPTIONS.map(({ label, desc }) => {
                const selected = moveType === label;
                return (
                  <label
                    key={label}
                    className={
                      "flex cursor-pointer gap-3 rounded-xl border p-4 transition " +
                      (selected
                        ? "border-[var(--accent)]/50 bg-[var(--accent)]/10"
                        : "border-white/[0.08] bg-[var(--surface-elevated)] hover:border-white/[0.18]")
                    }
                  >
                    <input
                      type="radio"
                      name="compass-move-type"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
                      value={label}
                      checked={selected}
                      onChange={(e) => setMoveType(e.target.value)}
                      required
                    />
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">{desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="compass-current-location" className={labelClass}>Current city &amp; country</label>
                <input id="compass-current-location" type="text" required value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} className={inputClass} placeholder="e.g. New York, USA" />
              </div>
              <div>
                <label htmlFor="compass-destination" className={labelClass}>Destination city &amp; country</label>
                <input id="compass-destination" type="text" required value={destination} onChange={(e) => setDestination(e.target.value)} className={inputClass} placeholder="e.g. Toronto, Canada" />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 — Services */}
        <div>
          <StepHeader number="03" title="Services needed" />
          <div className="grid gap-2 sm:grid-cols-2">
            {INTEREST_OPTIONS.map((option) => {
              const selected = services.includes(option);
              return (
                <label
                  key={option}
                  className={
                    "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition " +
                    (selected
                      ? "border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--foreground)]"
                      : "border-white/[0.08] bg-[var(--surface-elevated)] text-[var(--muted)] hover:border-white/[0.18] hover:text-[var(--foreground)]")
                  }
                >
                  <span className={
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition " +
                    (selected ? "border-[var(--accent)] bg-[var(--accent)]" : "border-white/20 bg-transparent")
                  }>
                    {selected && (
                      <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3" aria-hidden>
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <input type="checkbox" className="sr-only" checked={selected} onChange={() => toggleService(option)} />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="compass-notes" className={labelClass}>
            Anything else we should know <span className="normal-case font-normal text-[var(--muted)]">(optional)</span>
          </label>
          <textarea id="compass-notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} placeholder="Share any context that would help us support your move — special requirements, timeline constraints, family needs..." />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
        >
          {loading ? "Sending…" : <><span>Send my details</span><ArrowIcon /></>}
        </button>

        <p className="text-center text-xs text-[var(--muted)]">
          Your information is shared only with Yorksell. We respond within one business day.
        </p>
      </form>
    </div>
  );
}
