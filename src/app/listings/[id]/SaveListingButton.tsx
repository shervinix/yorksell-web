"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SaveListingButtonProps = {
  listingId: string;
  initialSaved: boolean;
};

export function SaveListingButton({ listingId, initialSaved }: SaveListingButtonProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      if (saved) {
        const res = await fetch(`/api/members/saved-listings?listingId=${encodeURIComponent(listingId)}`, {
          method: "DELETE",
        });
        if (res.ok) setSaved(false);
      } else {
        const res = await fetch("/api/members/saved-listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId }),
        });
        if (res.ok) setSaved(true);
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-white/5 disabled:opacity-60"
    >
      {saved ? (
        <>
          <span aria-hidden>✓</span>
          Saved
        </>
      ) : (
        <>Save to my list</>
      )}
    </button>
  );
}
