"use client";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

const SingleListingMap = dynamic(() => import("./SingleListingMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-[var(--surface)] text-xs text-[var(--muted)]">
      Loading map…
    </div>
  ),
});

export default function SingleListingMapClient({ lat, lng }: { lat: number; lng: number }) {
  return <SingleListingMap lat={lat} lng={lng} />;
}
