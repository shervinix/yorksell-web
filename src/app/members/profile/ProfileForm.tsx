"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProfileFormProps = {
  initial: {
    name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
    address: string | null;
    image: string | null;
  };
};

const labelClass = "block text-xs font-medium uppercase tracking-wider text-[var(--muted)]";
const inputClass =
  "mt-1.5 w-full rounded-xl border border-white/[0.12] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted)]/60 outline-none transition focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20";

export function ProfileForm({ initial }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial.name ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [company, setCompany] = useState(initial.company ?? "");
  const [address, setAddress] = useState(initial.address ?? "");
  const [image, setImage] = useState(initial.image ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const initials = (name.trim() || initial.email || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          phone: phone.trim() || null,
          company: company.trim() || null,
          address: address.trim() || null,
          image: image.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Failed to update." });
        return;
      }
      setMessage({ type: "success", text: "Profile updated successfully." });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Failed to update." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Avatar preview */}
      <div className="flex items-center gap-4">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-14 w-14 shrink-0 rounded-full border border-white/10 object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/15 text-base font-bold text-[var(--accent)]">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <label className={labelClass}>
            Profile photo URL{" "}
            <span className="normal-case tracking-normal opacity-50">(optional)</span>
          </label>
          <input
            type="url"
            className={inputClass}
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Name</label>
        <input
          type="text"
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          className={inputClass + " cursor-not-allowed opacity-50"}
          value={initial.email ?? ""}
          disabled
          title="Email cannot be changed"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">Contact support to change your email address.</p>
      </div>

      <div>
        <label className={labelClass}>Phone</label>
        <input
          type="tel"
          className={inputClass}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(416) 555-0000"
          autoComplete="tel"
        />
      </div>

      <div>
        <label className={labelClass}>Company</label>
        <input
          type="text"
          className={inputClass}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company or brokerage"
          autoComplete="organization"
        />
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <input
          type="text"
          className={inputClass}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street, city, postal code"
          autoComplete="street-address"
        />
      </div>

      {message && (
        <div
          className={`flex items-start gap-2.5 rounded-xl border p-3 text-sm ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0l6.353 11zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          )}
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
