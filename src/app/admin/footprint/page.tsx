"use client";

import { useCallback, useEffect, useState } from "react";

type FootprintPointType = "sold" | "purchased" | "active";

interface FootprintPoint {
  id: string;
  type: FootprintPointType;
  lat: number;
  lng: number;
  address: string;
  city: string;
  price?: number;
  beds?: number;
  baths?: number;
  soldDate?: string;
  mlsNumber?: string;
}

interface PerformanceOverrides {
  soldCount?: number | null;
  purchasedCount?: number | null;
  activeCount?: number | null;
  soldVolume?: number | null;
  purchasedVolume?: number | null;
  totalVolume?: number | null;
}

interface FootprintData {
  points: FootprintPoint[];
  performanceOverrides?: PerformanceOverrides | null;
}

const TYPES: { value: FootprintPointType; label: string }[] = [
  { value: "sold", label: "Sold" },
  { value: "purchased", label: "Purchased" },
  { value: "active", label: "Active" },
];

export default function AdminFootprintPage() {
  const [data, setData] = useState<FootprintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [useCustomPerformance, setUseCustomPerformance] = useState(false);
  const [newPoint, setNewPoint] = useState({
    type: "sold" as FootprintPointType,
    address: "",
    city: "",
    lat: 43.6532,
    lng: -79.3832,
    price: "" as number | "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/footprint", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const out: FootprintData = await res.json();
      setData(out);
      setUseCustomPerformance(
        !!(out.performanceOverrides && (
          out.performanceOverrides.soldCount != null ||
          out.performanceOverrides.purchasedCount != null ||
          out.performanceOverrides.activeCount != null ||
          out.performanceOverrides.soldVolume != null ||
          out.performanceOverrides.purchasedVolume != null ||
          out.performanceOverrides.totalVolume != null
        ))
      );
    } catch {
      setData({ points: [], performanceOverrides: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function save() {
    if (!data) return;
    setSaving(true);
    setMessage(null);
    try {
      const body: FootprintData = {
        points: data.points,
        performanceOverrides: useCustomPerformance ? (data.performanceOverrides ?? {}) : null,
      };
      const res = await fetch("/api/admin/footprint", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Failed to save");
      }
      setMessage({ type: "ok", text: "Footprint and performance numbers saved." });
    } catch (e) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Failed to save",
      });
    } finally {
      setSaving(false);
    }
  }

  function addPoint() {
    const address = newPoint.address.trim();
    const city = newPoint.city.trim();
    if (!address || !city) return;
    const point: FootprintPoint = {
      id: crypto.randomUUID(),
      type: newPoint.type,
      lat: newPoint.lat,
      lng: newPoint.lng,
      address,
      city,
      price: typeof newPoint.price === "number" ? newPoint.price : undefined,
    };
    setData((d) => d ? { ...d, points: [...d.points, point] } : { points: [point], performanceOverrides: null });
    setNewPoint({ type: "sold", address: "", city: "", lat: 43.6532, lng: -79.3832, price: "" });
  }

  function removePoint(id: string) {
    setData((d) => d ? { ...d, points: d.points.filter((p) => p.id !== id) } : d);
    if (editingId === id) setEditingId(null);
  }

  function updatePoint(id: string, updates: Partial<FootprintPoint>) {
    setData((d) => {
      if (!d) return d;
      return {
        ...d,
        points: d.points.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      };
    });
  }

  function setOverride(field: keyof PerformanceOverrides, value: number | "") {
    setData((d) => {
      if (!d) return d;
      const num = value === "" ? null : Number(value);
      const overrides = { ...(d.performanceOverrides ?? {}), [field]: num };
      return { ...d, performanceOverrides: overrides };
    });
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Footprint
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading…</p>
      </div>
    );
  }

  const points = data?.points ?? [];
  const overrides = data?.performanceOverrides ?? {};

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Footprint
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Control the points shown on the <a href="/footprint" className="text-zinc-900 underline dark:text-zinc-50" target="_blank" rel="noreferrer">footprint map</a> and the numbers in the &quot;Our performance&quot; section.
      </p>

      {/* Map points */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Map points
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Add, edit, or remove points. Each point appears on the footprint map as Sold (green), Purchased (blue), or Active (red).
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <select
            value={newPoint.type}
            onChange={(e) => setNewPoint((p) => ({ ...p, type: e.target.value as FootprintPointType }))}
            className="rounded-lg border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Address"
            value={newPoint.address}
            onChange={(e) => setNewPoint((p) => ({ ...p, address: e.target.value }))}
            className="w-48 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          />
          <input
            type="text"
            placeholder="City"
            value={newPoint.city}
            onChange={(e) => setNewPoint((p) => ({ ...p, city: e.target.value }))}
            className="w-32 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          />
          <input
            type="number"
            placeholder="Lat"
            step="any"
            value={newPoint.lat}
            onChange={(e) => setNewPoint((p) => ({ ...p, lat: Number(e.target.value) || 0 }))}
            className="w-24 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          />
          <input
            type="number"
            placeholder="Lng"
            step="any"
            value={newPoint.lng}
            onChange={(e) => setNewPoint((p) => ({ ...p, lng: Number(e.target.value) || 0 }))}
            className="w-24 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          />
          <input
            type="number"
            placeholder="Price (opt)"
            value={newPoint.price === "" ? "" : newPoint.price}
            onChange={(e) => setNewPoint((p) => ({ ...p, price: e.target.value === "" ? "" : Number(e.target.value) }))}
            className="w-28 rounded-lg border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          />
          <button
            type="button"
            onClick={addPoint}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            Add point
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {points.length === 0 ? (
            <li className="text-sm text-zinc-500 dark:text-zinc-400">No points yet. Add one above.</li>
          ) : (
            points.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <span
                  className={`inline-block w-16 rounded px-1.5 py-0.5 text-xs font-medium ${
                    p.type === "sold"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : p.type === "purchased"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                  }`}
                >
                  {p.type}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">
                  {p.address}, {p.city}
                  {p.price != null ? ` · $${p.price.toLocaleString()}` : ""}
                </span>
                {editingId === p.id ? (
                  <>
                    <input
                      type="text"
                      value={p.address}
                      onChange={(e) => updatePoint(p.id, { address: e.target.value })}
                      className="w-40 rounded border px-1.5 py-0.5 text-sm dark:bg-zinc-900"
                      placeholder="Address"
                    />
                    <input
                      type="text"
                      value={p.city}
                      onChange={(e) => updatePoint(p.id, { city: e.target.value })}
                      className="w-24 rounded border px-1.5 py-0.5 text-sm dark:bg-zinc-900"
                      placeholder="City"
                    />
                    <input
                      type="number"
                      value={p.price ?? ""}
                      onChange={(e) => updatePoint(p.id, { price: e.target.value === "" ? undefined : Number(e.target.value) })}
                      className="w-24 rounded border px-1.5 py-0.5 text-sm dark:bg-zinc-900"
                      placeholder="Price"
                    />
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-sm text-zinc-600 dark:text-zinc-400"
                    >
                      Done
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingId(p.id)}
                    className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
                  >
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removePoint(p.id)}
                  className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                  aria-label="Remove"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Performance overrides */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Our performance numbers
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          By default, counts and volumes are computed from the map points above. Turn on custom numbers to override what appears on the footprint page.
        </p>
        <label className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={useCustomPerformance}
            onChange={(e) => setUseCustomPerformance(e.target.checked)}
            className="rounded border-zinc-300"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">Use custom performance numbers</span>
        </label>
        {useCustomPerformance && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: "soldCount" as const, label: "Sold count" },
              { key: "purchasedCount" as const, label: "Purchased count" },
              { key: "activeCount" as const, label: "Active count" },
              { key: "soldVolume" as const, label: "Sold volume ($)" },
              { key: "purchasedVolume" as const, label: "Purchased volume ($)" },
              { key: "totalVolume" as const, label: "Total volume ($)" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs text-zinc-500">{label}</label>
                <input
                  type="number"
                  min={0}
                  value={overrides[key] ?? ""}
                  onChange={(e) => setOverride(key, e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {saving ? "Saving…" : "Save footprint"}
        </button>
        {message && (
          <span
            className={
              message.type === "ok"
                ? "text-sm text-green-600 dark:text-green-400"
                : "text-sm text-red-600 dark:text-red-400"
            }
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
