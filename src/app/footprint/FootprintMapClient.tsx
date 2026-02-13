"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import type { FootprintPoint } from "./data";

const FootprintMap = dynamic(() => import("./FootprintMap"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[420px] w-full items-center justify-center rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)]">
      <p className="text-[var(--muted)]">Loading map…</p>
    </div>
  ),
});

interface FootprintMapClientProps {
  points?: FootprintPoint[];
  showFitBounds?: boolean;
}

export default function FootprintMapClient(props: FootprintMapClientProps) {
  return <FootprintMap {...props} />;
}
