"use client";

import { useState } from "react";

const labelClass = "block text-xs font-medium uppercase tracking-wider text-[var(--muted)]";
const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.12] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)]/60 outline-none transition focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20";

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ValuationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const metadata: Record<string, string | number | null> = { requestType: "valuation" };
      if (address.trim()) metadata.address = address.trim();
      if (city.trim()) metadata.city = city.trim();
      if (propertyType.trim()) metadata.propertyType = propertyType.trim();
      if (beds.trim()) metadata.beds = beds.trim();
      if (baths.trim()) metadata.baths = baths.trim();
      if (sqft.trim()) metadata.sqft = parseInt(sqft.replace(/\D/g, ""), 10) || null;

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          phone: phone.trim(),
          message: message.trim() || undefined,
          source: "sell_page",
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
      setName(""); setEmail(""); setPhone(""); setAddress(""); setCity("");
      setPropertyType(""); setBeds(""); setBaths(""); setSqft(""); setMessage("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="text-[var(--foreground)]">
      {sent ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
          <p className="font-medium text-[var(--foreground)]">Thanks! We&apos;ll prepare a valuation and be in touch soon.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            <button type="button" onClick={() => setSent(false)} className="font-medium text-[var(--accent)] hover:underline">
              Request another valuation
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="val-name" className={labelClass}>Name</label>
              <input id="val-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="val-email" className={labelClass}>Email</label>
              <input id="val-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label htmlFor="val-phone" className={labelClass}>Phone</label>
            <input id="val-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="Best number to reach you" />
          </div>
          <div>
            <label htmlFor="val-address" className={labelClass}>Property address</label>
            <input id="val-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} placeholder="Street address" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="val-city" className={labelClass}>City</label>
              <input id="val-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="e.g. Toronto, Markham" />
            </div>
            <div>
              <label htmlFor="val-type" className={labelClass}>Property type</label>
              <select id="val-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={inputClass}>
                <option value="">Select…</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Detached">Detached</option>
                <option value="Semi-Detached">Semi-Detached</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="val-beds" className={labelClass}>Beds</label>
              <input id="val-beds" type="text" value={beds} onChange={(e) => setBeds(e.target.value)} className={inputClass} placeholder="e.g. 3" />
            </div>
            <div>
              <label htmlFor="val-baths" className={labelClass}>Baths</label>
              <input id="val-baths" type="text" value={baths} onChange={(e) => setBaths(e.target.value)} className={inputClass} placeholder="e.g. 2" />
            </div>
            <div>
              <label htmlFor="val-sqft" className={labelClass}>Sq ft</label>
              <input id="val-sqft" type="text" value={sqft} onChange={(e) => setSqft(e.target.value)} className={inputClass} placeholder="Optional" />
            </div>
          </div>
          <div>
            <label htmlFor="val-message" className={labelClass}>Anything we should know?</label>
            <textarea id="val-message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} placeholder="Timeline, renovations, or other details..." />
          </div>
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
          )}
          <button type="submit" disabled={loading} className="inline-flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60">
            {loading ? "Sending…" : <><span>Get my free valuation</span><ArrowIcon /></>}
          </button>
        </form>
      )}
    </div>
  );
}
