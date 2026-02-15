"use client";

import { useState } from "react";

export default function ListWithUsForm() {
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
      const metadata: Record<string, string | number | null> = { requestType: "listing" };
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
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCity("");
      setPropertyType("");
      setBeds("");
      setBaths("");
      setSqft("");
      setYearBuilt("");
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
        List with us
      </h2>
      <p className="mt-2 text-[var(--muted)]">
        Tell us about your property and we&apos;ll get in touch to discuss next steps.
      </p>

      {sent ? (
        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
          <p className="font-medium text-[var(--foreground)]">Thanks! We&apos;ll reach out soon to discuss listing your property.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            <button type="button" onClick={() => setSent(false)} className="font-medium text-[var(--accent)] hover:underline">
              Submit another property
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="list-name" className="block text-sm font-medium text-[var(--foreground)]">
                Name
              </label>
              <input
                id="list-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="list-email" className="block text-sm font-medium text-[var(--foreground)]">
                Email <span className="text-[var(--muted)]">(required)</span>
              </label>
              <input
                id="list-email"
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
            <label htmlFor="list-phone" className="block text-sm font-medium text-[var(--foreground)]">
              Phone <span className="text-[var(--muted)]">(required)</span>
            </label>
            <input
              id="list-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="Best number to reach you"
            />
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[var(--surface)] p-4">
            <p className="text-sm font-medium text-[var(--foreground)]">Property details</p>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="list-address" className="block text-xs font-medium text-[var(--muted)]">
                  Address
                </label>
                <input
                  id="list-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputClass}
                  placeholder="Street address"
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="list-city" className="block text-xs font-medium text-[var(--muted)]">
                    City
                  </label>
                  <input
                    id="list-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Toronto, North York"
                  />
                </div>
                <div>
                  <label htmlFor="list-type" className="block text-xs font-medium text-[var(--muted)]">
                    Property type
                  </label>
                  <select
                    id="list-type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select...</option>
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
                  <label htmlFor="list-beds" className="block text-xs font-medium text-[var(--muted)]">
                    Beds
                  </label>
                  <input
                    id="list-beds"
                    type="text"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 3"
                  />
                </div>
                <div>
                  <label htmlFor="list-baths" className="block text-xs font-medium text-[var(--muted)]">
                    Baths
                  </label>
                  <input
                    id="list-baths"
                    type="text"
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 2"
                  />
                </div>
                <div>
                  <label htmlFor="list-sqft" className="block text-xs font-medium text-[var(--muted)]">
                    Sq ft
                  </label>
                  <input
                    id="list-sqft"
                    type="text"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    className={inputClass}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label htmlFor="list-year" className="block text-xs font-medium text-[var(--muted)]">
                    Year built
                  </label>
                  <input
                    id="list-year"
                    type="text"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                    className={inputClass}
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="list-message" className="block text-sm font-medium text-[var(--foreground)]">
              Additional details
            </label>
            <textarea
              id="list-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClass}
              placeholder="Timeline to sell, renovations, special features, or anything else we should know..."
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
            {loading ? "Sending…" : "Get in touch — let&apos;s list your property"}
          </button>
        </form>
      )}
    </div>
  );
}
