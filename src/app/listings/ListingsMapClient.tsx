"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import type { ListingListItem } from "@/app/api/listings/route";

const ListingsMap = dynamic(() => import("./ListingsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[480px] w-full items-center justify-center rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)]">
      <p className="text-[var(--muted)]">Loading map…</p>
    </div>
  ),
});

interface ListingsMapClientProps {
  listings: ListingListItem[];
  showFitBounds?: boolean;
}

export default function ListingsMapClient({
  listings,
  showFitBounds = true,
}: ListingsMapClientProps) {
  return <ListingsMap listings={listings} showFitBounds={showFitBounds} />;
}
