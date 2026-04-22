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
  "Moving to Toronto",
  "Moving from Toronto",
  "Moving to and from — I need both",
  "Not sure yet — I need guidance",
] as const;

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

  const inputClass =
    "mt-1 w-full rounded-xl border border-white/[0.08] bg-[var(--surface-elevated)] px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--muted)] outline-none focus:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/30";

  const formReady = useMemo(() => {
    return (
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      moveType.trim().length > 0 &&
      currentLocation.trim().length > 0 &&
      destination.trim().length > 0 &&
      moveDate.trim().length > 0 &&
      services.length > 0
    );
  }, [currentLocation, destination, email, fullName, moveDate, moveType, services.length]);

  function toggleService(service: string) {
    setServices((prev) => {
      if (prev.includes(service)) return prev.filter((item) => item !== service);
      return [...prev, service];
    });
  }

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
      setFullName("");
      setEmail("");
      setPhone("");
      setMoveType("");
      setCurrentLocation("");
      setDestination("");
      setMoveDate("");
      setServices([]);
      setNotes("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-[var(--foreground)]">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--muted)]">Start your move</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)] md:text-3xl">
        Tell us where you&apos;re headed. We&apos;ll take it from there.
      </h2>

      {sent ? (
        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
          <p className="font-medium text-[var(--foreground)]">Thank you. We&apos;ll be in touch within one business day.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            <button type="button" className="font-medium text-[var(--accent)] hover:underline" onClick={() => setSent(false)}>
              Send another request
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="compass-name" className="block text-sm font-medium text-[var(--foreground)]">
                Full name
              </label>
              <input
                id="compass-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="compass-email" className="block text-sm font-medium text-[var(--foreground)]">
                Email address
              </label>
              <input
                id="compass-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="compass-phone" className="block text-sm font-medium text-[var(--foreground)]">
                Phone number <span className="text-[var(--muted)]">(optional)</span>
              </label>
              <input
                id="compass-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="Best number to reach you"
              />
            </div>
            <div>
              <label htmlFor="compass-date" className="block text-sm font-medium text-[var(--foreground)]">
                Approximate move date
              </label>
              <input
                id="compass-date"
                type="date"
                required
                value={moveDate}
                onChange={(e) => setMoveDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[var(--surface)] p-4">
            <p className="text-sm font-medium text-[var(--foreground)]">I am</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {MOVE_TYPE_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-white/[0.06] bg-[var(--surface-elevated)] px-3 py-2.5 text-sm text-[var(--foreground)]"
                >
                  <input
                    type="radio"
                    name="compass-move-type"
                    className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
                    value={option}
                    checked={moveType === option}
                    onChange={(e) => setMoveType(e.target.value)}
                    required
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="compass-current-location" className="block text-sm font-medium text-[var(--foreground)]">
                Current city and country
              </label>
              <input
                id="compass-current-location"
                type="text"
                required
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className={inputClass}
                placeholder="City, Country"
              />
            </div>
            <div>
              <label htmlFor="compass-destination" className="block text-sm font-medium text-[var(--foreground)]">
                Destination city and country
              </label>
              <input
                id="compass-destination"
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={inputClass}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[var(--surface)] p-4">
            <p className="text-sm font-medium text-[var(--foreground)]">Services I&apos;m interested in</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {INTEREST_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-white/[0.06] bg-[var(--surface-elevated)] px-3 py-2.5 text-sm text-[var(--foreground)]"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
                    checked={services.includes(option)}
                    onChange={() => toggleService(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="compass-notes" className="block text-sm font-medium text-[var(--foreground)]">
              Anything else we should know <span className="text-[var(--muted)]">(optional)</span>
            </label>
            <textarea
              id="compass-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClass}
              placeholder="Share any details that would help us support your move."
            />
          </div>

          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--accent)] py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send my details"}
          </button>

          <p className="text-xs text-[var(--muted)]">
            Your information is shared only with Yorksell. We respond within one business day.
          </p>
        </form>
      )}
    </div>
  );
}
