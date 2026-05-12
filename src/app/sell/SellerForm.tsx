"use client";

import { useState } from "react";

const labelClass = "block text-xs font-medium uppercase tracking-wider text-[var(--muted)]";
const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.12] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)]/60 outline-none transition focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20";

const INTENT_OPTIONS = [
  { value: "valuation", label: "Free valuation" },
  { value: "listing", label: "Ready to list" },
  { value: "unsure", label: "Not sure yet" },
] as const;

const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
    <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function SellerForm() {
  const [intent, setIntent] = useState<"valuation" | "listing" | "unsure">("valuation");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [sqft, setSqft] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const metadata: Record<string, string | number | null> = { requestType: intent };
      if (address.trim()) metadata.address = address.trim();
      if (city.trim()) metadata.city = city.trim();
      if (propertyType.trim()) metadata.propertyType = propertyType.trim();
      if (beds.trim()) metadata.beds = beds.trim();
      if (baths.trim()) metadata.baths = baths.trim();
      if (sqft.trim()) metadata.sqft = parseInt(sqft.replace(/\D/g, ""), 10) || null;
      if (yearBuilt.trim()) metadata.yearBuilt = parseInt(yearBuilt.replace(/\D/g, ""), 10) || null;

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
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const submitLabel =
    intent === "valuation"
      ? "Get my free valuation"
      : intent === "listing"
      ? "Get in touch"
      : "Send my details";

  if (sent) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <p className="mt-4 font-semibold text-[var(--foreground)]">
          {intent === "valuation" ? "We'll prepare your valuation and be in touch soon." : "Thanks. We'll be in touch shortly."}
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          <button type="button" onClick={() => { setSent(false); setName(""); setEmail(""); setPhone(""); setAddress(""); setCity(""); setPropertyType(""); setBeds(""); setBaths(""); setSqft(""); setYearBuilt(""); setMessage(""); }} className="font-medium text-[var(--accent)] hover:underline">
            Submit another enquiry
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">

      {/* Intent */}
      <div>
        <p className={labelClass}>What are you looking for?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {INTENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setIntent(opt.value)}
              className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                intent === opt.value
                  ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--foreground)]"
                  : "border-white/[0.12] bg-[var(--surface)] text-[var(--muted)] hover:border-white/25"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sel-name" className={labelClass}>Name</label>
          <input id="sel-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="sel-email" className={labelClass}>Email</label>
          <input id="sel-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label htmlFor="sel-phone" className={labelClass}>Phone</label>
        <input id="sel-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="Best number to reach you" />
      </div>

      {/* Property details */}
      <div className="rounded-xl border border-white/[0.1] bg-[var(--surface)] p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Property details</p>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="sel-address" className={labelClass}>Address</label>
            <input id="sel-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} placeholder="Street address" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="sel-city" className={labelClass}>City</label>
              <input id="sel-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="e.g. Toronto, Markham" />
            </div>
            <div>
              <label htmlFor="sel-type" className={labelClass}>Property type</label>
              <select id="sel-type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={inputClass}>
                <option value="">Select…</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Detached">Detached</option>
                <option value="Semi-Detached">Semi-Detached</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label htmlFor="sel-beds" className={labelClass}>Beds</label>
              <input id="sel-beds" type="text" value={beds} onChange={(e) => setBeds(e.target.value)} className={inputClass} placeholder="e.g. 3" />
            </div>
            <div>
              <label htmlFor="sel-baths" className={labelClass}>Baths</label>
              <input id="sel-baths" type="text" value={baths} onChange={(e) => setBaths(e.target.value)} className={inputClass} placeholder="e.g. 2" />
            </div>
            <div>
              <label htmlFor="sel-sqft" className={labelClass}>Sq ft</label>
              <input id="sel-sqft" type="text" value={sqft} onChange={(e) => setSqft(e.target.value)} className={inputClass} placeholder="Optional" />
            </div>
            <div>
              <label htmlFor="sel-year" className={labelClass}>Year built</label>
              <input id="sel-year" type="text" value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} className={inputClass} placeholder="Optional" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="sel-message" className={labelClass}>Anything else we should know?</label>
        <textarea id="sel-message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} placeholder="Timeline, renovations, special features, or other details..." />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
      )}

      <button type="submit" disabled={loading} className="inline-flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60">
        {loading ? "Sending…" : <><span>{submitLabel}</span><ArrowIcon /></>}
      </button>
    </form>
  );
}
