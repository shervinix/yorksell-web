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

export function ProfileForm({ initial }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial.name ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [company, setCompany] = useState(initial.company ?? "");
  const [address, setAddress] = useState(initial.address ?? "");
  const [image, setImage] = useState(initial.image ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
      setMessage({ type: "success", text: "Profile updated." });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Failed to update." });
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-white/10 bg-[var(--surface)] px-3 py-2.5 text-[var(--foreground)] placeholder-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--accent)]";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Name
        </label>
        <input
          type="text"
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Email
        </label>
        <input
          type="email"
          className={inputClass + " opacity-70"}
          value={initial.email ?? ""}
          disabled
          title="Email cannot be changed here"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">Email cannot be changed here.</p>
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Phone
        </label>
        <input
          type="tel"
          className={inputClass}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(416) 555-0000"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Company
        </label>
        <input
          type="text"
          className={inputClass}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company or brokerage"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Address
        </label>
        <input
          type="text"
          className={inputClass}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street, city, postal code"
        />
      </div>
      <div>
        <label className="block text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          Profile photo URL
        </label>
        <input
          type="url"
          className={inputClass}
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://..."
        />
        {image && (
          <div className="mt-2 flex items-center gap-3">
            <img
              src={image}
              alt=""
              className="h-14 w-14 rounded-full object-cover border border-white/10"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
      </div>
      {message && (
        <p
          className={
            "text-sm " +
            (message.type === "success" ? "text-green-500" : "text-red-400")
          }
        >
          {message.text}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
