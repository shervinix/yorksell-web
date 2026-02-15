"use client";

import { useState } from "react";

export default function JoinYorksellForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [license, setLicense] = useState("");
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const metadata: Record<string, string> = {};
      if (license.trim()) metadata.license = license.trim();
      if (experience.trim()) metadata.experience = experience.trim();

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          phone: phone.trim(),
          message: message.trim() || undefined,
          source: "join_page",
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
      setLicense("");
      setExperience("");
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
        Express your interest
      </h2>
      <p className="mt-2 text-[var(--muted)]">
        Tell us about yourself and we&apos;ll be in touch to discuss opportunities.
      </p>

      {sent ? (
        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
          <p className="font-medium text-[var(--foreground)]">Thanks! We&apos;ll reach out soon to discuss next steps.</p>
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
              <label htmlFor="join-name" className="block text-sm font-medium text-[var(--foreground)]">
                Name
              </label>
              <input
                id="join-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="join-email" className="block text-sm font-medium text-[var(--foreground)]">
                Email <span className="text-[var(--muted)]">(required)</span>
              </label>
              <input
                id="join-email"
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
            <label htmlFor="join-phone" className="block text-sm font-medium text-[var(--foreground)]">
              Phone <span className="text-[var(--muted)]">(required)</span>
            </label>
            <input
              id="join-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="Best number to reach you"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="join-license" className="block text-sm font-medium text-[var(--foreground)]">
                Real estate license
              </label>
              <input
                id="join-license"
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className={inputClass}
                placeholder="e.g. Ontario RECO #"
              />
            </div>
            <div>
              <label htmlFor="join-experience" className="block text-sm font-medium text-[var(--foreground)]">
                Experience
              </label>
              <input
                id="join-experience"
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className={inputClass}
                placeholder="e.g. 2 years, new agent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="join-message" className="block text-sm font-medium text-[var(--foreground)]">
              Tell us about yourself
            </label>
            <textarea
              id="join-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClass}
              placeholder="Your background, goals, areas of interest..."
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
            {loading ? "Sending…" : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
