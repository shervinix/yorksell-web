"use client";

import { useState } from "react";

export default function BuyerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [areas, setAreas] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const metadata: Record<string, string | number | null> = {};
      if (budgetMin.trim()) metadata.budgetMin = parseInt(budgetMin.replace(/\D/g, ""), 10) || null;
      if (budgetMax.trim()) metadata.budgetMax = parseInt(budgetMax.replace(/\D/g, ""), 10) || null;
      if (areas.trim()) metadata.areas = areas.trim();
      if (beds.trim()) metadata.beds = beds.trim();
      if (baths.trim()) metadata.baths = baths.trim();
      if (timeline.trim()) metadata.timeline = timeline.trim();

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          phone: phone.trim(),
          message: message.trim() || undefined,
          source: "buy_page",
          metadata: Object.keys(metadata).length ? metadata : undefined,
        }),
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
      setBudgetMin("");
      setBudgetMax("");
      setAreas("");
      setBeds("");
      setBaths("");
      setTimeline("");
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
    <div className="text-[var(--foreground)]">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)] md:text-2xl">
        Tell us what you&apos;re looking for
      </h2>
      <p className="mt-2 text-[var(--muted)]">
        Share your criteria and we&apos;ll help you find the right property.
      </p>

      {sent ? (
        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
          <p className="font-medium text-[var(--foreground)]">Thanks! We&apos;ll reach out soon to start your search.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            <button type="button" onClick={() => setSent(false)} className="font-medium text-[var(--accent)] hover:underline">
              Submit another request
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="buy-name" className="block text-sm font-medium text-[var(--foreground)]">
                Name
              </label>
              <input
                id="buy-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="buy-email" className="block text-sm font-medium text-[var(--foreground)]">
                Email <span className="text-[var(--muted)]">(required)</span>
              </label>
              <input
                id="buy-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="buy-phone" className="block text-sm font-medium text-[var(--foreground)]">
              Phone <span className="text-[var(--muted)]">(required)</span>
            </label>
            <input
              id="buy-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="Best number to reach you"
            />
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[var(--surface)] p-4">
            <p className="text-sm font-medium text-[var(--foreground)]">What you&apos;re looking for</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="buy-budget-min" className="block text-xs font-medium text-[var(--muted)]">
                  Budget (min)
                </label>
                <input
                  id="buy-budget-min"
                  type="text"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 500000"
                />
              </div>
              <div>
                <label htmlFor="buy-budget-max" className="block text-xs font-medium text-[var(--muted)]">
                  Budget (max)
                </label>
                <input
                  id="buy-budget-max"
                  type="text"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 800000"
                />
              </div>
            </div>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="buy-areas" className="block text-xs font-medium text-[var(--muted)]">
                  Areas of interest
                </label>
                <input
                  id="buy-areas"
                  type="text"
                  value={areas}
                  onChange={(e) => setAreas(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. North York, Markham"
                />
              </div>
              <div>
                <label htmlFor="buy-beds" className="block text-xs font-medium text-[var(--muted)]">
                  Beds
                </label>
                <input
                  id="buy-beds"
                  type="text"
                  value={beds}
                  onChange={(e) => setBeds(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 2+"
                />
              </div>
              <div>
                <label htmlFor="buy-baths" className="block text-xs font-medium text-[var(--muted)]">
                  Baths
                </label>
                <input
                  id="buy-baths"
                  type="text"
                  value={baths}
                  onChange={(e) => setBaths(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 2"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="buy-timeline" className="block text-xs font-medium text-[var(--muted)]">
                Timeline
              </label>
              <input
                id="buy-timeline"
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className={inputClass}
                placeholder="e.g. Next 3 months, flexible"
              />
            </div>
          </div>

          <div>
            <label htmlFor="buy-message" className="block text-sm font-medium text-[var(--foreground)]">
              Additional details
            </label>
            <textarea
              id="buy-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClass}
              placeholder="Must-haves, deal-breakers, or anything else we should know..."
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
            className="w-full rounded-xl bg-[var(--accent)] py-3.5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-60 transition"
          >
            {loading ? "Sending…" : "Get started — we&apos;ll be in touch"}
          </button>
        </form>
      )}
    </div>
  );
}
