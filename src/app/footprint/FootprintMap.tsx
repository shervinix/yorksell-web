"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { FootprintPoint, FootprintPointType } from "./data";
import { FOOTPRINT_POINTS, GTA_MAP_CENTER, GTA_MAP_ZOOM } from "./data";

// Fix default marker icon in Next.js (Leaflet uses file paths that break with bundlers)
const createIcon = (type: FootprintPointType) => {
  const colors = { sold: "#22c55e", purchased: "#3b82f6", active: "#ef4444" };
  const color = colors[type];
  return L.divIcon({
    className: "footprint-marker",
    html: `<span style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,0.4);display:block"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

function formatPrice(value: number | undefined) {
  if (value == null || !Number.isFinite(value)) return "";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(value);
}

function MapFitBounds({ points }: { points: FootprintPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.15));
  }, [map, points]);
  return null;
}

function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

interface FootprintMapProps {
  points?: FootprintPoint[];
  showFitBounds?: boolean;
}

export default function FootprintMap({ points = FOOTPRINT_POINTS, showFitBounds = true }: FootprintMapProps) {
  const icons = useMemo(
    () => ({
      sold: createIcon("sold"),
      purchased: createIcon("purchased"),
      active: createIcon("active"),
    }),
    []
  );

  return (
    <div
      className="w-full rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
      style={{ height: 420 }}
    >
      <MapContainer
        center={GTA_MAP_CENTER}
        zoom={GTA_MAP_ZOOM}
        className="h-full w-full z-0"
        style={{ height: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        />
        <MapResizeHandler />
        {showFitBounds && points.length > 0 && <MapFitBounds points={points} />}
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={icons[point.type]}
          >
            <Popup>
              <div className="min-w-[180px] text-left">
                <span
                  className="inline-block px-1.5 py-0.5 rounded text-xs font-medium text-white capitalize mb-1"
                  style={{
                    backgroundColor:
                      point.type === "sold"
                        ? "#22c55e"
                        : point.type === "purchased"
                          ? "#3b82f6"
                          : "#ef4444",
                  }}
                >
                  {point.type}
                </span>
                <p className="font-medium text-gray-900">{point.address}</p>
                <p className="text-sm text-gray-600">{point.city}</p>
                {point.price != null && (
                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {formatPrice(point.price)}
                  </p>
                )}
                {(point.beds != null || point.baths != null) && (
                  <p className="text-xs text-gray-500">
                    {[point.beds != null && `${point.beds} bed`, point.baths != null && `${point.baths} bath`]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                )}
                {point.soldDate && (
                  <p className="text-xs text-gray-500 mt-0.5">Closed {point.soldDate}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
