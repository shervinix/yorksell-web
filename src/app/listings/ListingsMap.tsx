"use client";

import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { ListingListItem } from "@/app/api/listings/route";

function formatPrice(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value) || value <= 0) return "Contact";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80";

const defaultIcon = L.divIcon({
  className: "listings-marker",
  html: `<span style="background:var(--accent,#c9a227);width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.4);display:block"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function MapFitBounds({ listings }: { listings: ListingListItem[] }) {
  const map = useMap();
  const withCoords = useMemo(
    () => listings.filter((l) => l.lat != null && l.lng != null && Number.isFinite(l.lat) && Number.isFinite(l.lng)),
    [listings]
  );
  useEffect(() => {
    if (withCoords.length === 0) return;
    const bounds = L.latLngBounds(
      withCoords.map((l) => [l.lat!, l.lng!] as [number, number])
    );
    map.fitBounds(bounds.pad(0.15));
  }, [map, withCoords]);
  return null;
}

const GTA_CENTER: [number, number] = [43.65, -79.38];
const GTA_ZOOM = 10;

interface ListingsMapProps {
  listings: ListingListItem[];
  showFitBounds?: boolean;
}

export default function ListingsMap({
  listings,
  showFitBounds = true,
}: ListingsMapProps) {
  const withCoords = useMemo(
    () =>
      listings.filter(
        (l) =>
          l.lat != null &&
          l.lng != null &&
          Number.isFinite(l.lat) &&
          Number.isFinite(l.lng)
      ),
    [listings]
  );

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
      style={{ height: 480 }}
    >
      <MapContainer
        center={GTA_CENTER}
        zoom={GTA_ZOOM}
        className="h-full w-full z-0"
        style={{ height: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        />
        {showFitBounds && withCoords.length > 0 && (
          <MapFitBounds listings={withCoords} />
        )}
        {withCoords.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.lat!, listing.lng!]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="min-w-[200px] text-left rounded-lg bg-[var(--surface-elevated)] p-2 text-[var(--foreground)]">
                <a
                  href={listing.url}
                  className="block font-medium text-[var(--foreground)] hover:text-[var(--accent)] hover:underline"
                >
                  {listing.addressLine || listing.city || "Listing"}
                </a>
                {(listing.city || listing.province) && (
                  <p className="text-sm text-[var(--muted)]">
                    {[listing.city, listing.province].filter(Boolean).join(", ")}
                  </p>
                )}
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {formatPrice(listing.price)}
                </p>
                {(listing.beds != null || listing.baths != null) && (
                  <p className="text-xs text-[var(--muted)]">
                    {[listing.beds != null && `${listing.beds} bed`, listing.baths != null && `${listing.baths} bath`]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                )}
                {(listing.photoUrl || PLACEHOLDER_IMAGE) && (
                  <img
                    src={listing.photoUrl?.trim() || PLACEHOLDER_IMAGE}
                    alt=""
                    className="mt-2 w-full rounded object-cover"
                    style={{ maxHeight: 120 }}
                  />
                )}
                <a
                  href={listing.url}
                  className="mt-2 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  View details →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
