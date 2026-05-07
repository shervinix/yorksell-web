"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/listings?q=${encodeURIComponent(q)}` : "/listings");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-lg gap-2">
      <label htmlFor="hero-search" className="sr-only">
        Search by city, address, or MLS#
      </label>
      <input
        id="hero-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="City, address, or MLS#"
        className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 backdrop-blur-sm outline-none transition focus:border-white/40 focus:bg-white/15"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
      >
        Search
      </button>
    </form>
  );
}
