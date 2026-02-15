"use client";

import { useState } from "react";

export default function PropertyManagementForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [unitCount, setUnitCount] = useState("");
  const [status, setStatus] = useState("");
  const [interestedTier, setInterestedTier] = useState("");
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
      if (propertyAddress.trim()) metadata.propertyAddress = propertyAddress.trim();
      if (propertyType.trim()) metadata.propertyType = propertyType.trim();
      if (unitCount.trim()) metadata.unitCount = unitCount.trim();
      if (status.trim()) metadata.status = status.trim();
      if (interestedTier.trim()) metadata.interestedTier = interestedTier.trim();

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          phone: phone.trim(),
          message: message.trim() || undefined,
          source: "property_management_page",
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
      setPropertyAddress("");
      setPropertyType("");
      setUnitCount("");
      setStatus("");
      setInterestedTier("");
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
        Get a free consultation
      </h2>
      <p className="mt-2 text-[var(--muted)]">
        Share your property details and we&apos;ll get in touch to discuss how we can help.
      </p>

      {sent ? (
        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
          <p className="font-medium text-[var(--foreground)]">Thanks! We&apos;ll reach out soon to discuss your property.</p>
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
              <label htmlFor="pm-name" className="block text-sm font-medium text-[var(--foreground)]">
                Name
              </label>
              <input
                id="pm-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="pm-email" className="block text-sm font-medium text-[var(--foreground)]">
                Email <span className="text-[var(--muted)]">(required)</span>
              </label>
              <input
                id="pm-email"
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
            <label htmlFor="pm-phone" className="block text-sm font-medium text-[var(--foreground)]">
              Phone <span className="text-[var(--muted)]">(required)</span>
            </label>
            <input
              id="pm-phone"
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
                <label htmlFor="pm-address" className="block text-xs font-medium text-[var(--muted)]">
                  Property address
                </label>
                <input
                  id="pm-address"
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 123 Main St, Toronto"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="pm-type" className="block text-xs font-medium text-[var(--muted)]">
                    Property type
                  </label>
                  <select
                    id="pm-type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select type</option>
                    <option value="single-family">Single-family home</option>
                    <option value="duplex">Duplex</option>
                    <option value="triplex">Triplex</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="condo">Condo</option>
                    <option value="multi-unit">Multi-unit (4+)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="pm-units" className="block text-xs font-medium text-[var(--muted)]">
                    Number of units
                  </label>
                  <input
                    id="pm-units"
                    type="text"
                    value={unitCount}
                    onChange={(e) => setUnitCount(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. 1, 2, 4"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="pm-status" className="block text-xs font-medium text-[var(--muted)]">
                  Current status
                </label>
                <select
                  id="pm-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select status</option>
                  <option value="occupied">Occupied</option>
                  <option value="vacant">Vacant</option>
                  <option value="tenant-moving-out">Tenant moving out soon</option>
                  <option value="new-purchase">New purchase (no tenants yet)</option>
                </select>
              </div>
              <div>
                <label htmlFor="pm-tier" className="block text-xs font-medium text-[var(--muted)]">
                  Interested in tier
                </label>
                <select
                  id="pm-tier"
                  value={interestedTier}
                  onChange={(e) => setInterestedTier(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select tier</option>
                  <option value="essential">Essential</option>
                  <option value="full-service">Full Service</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="pm-message" className="block text-sm font-medium text-[var(--foreground)]">
              Additional details
            </label>
            <textarea
              id="pm-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClass}
              placeholder="Current management, special requirements, timeline, or anything else we should know..."
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
            {loading ? "Sending…" : "Get a free consultation"}
          </button>
        </form>
      )}
    </div>
  );
}
