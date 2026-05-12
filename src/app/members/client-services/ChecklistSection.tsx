"use client";

import { useState } from "react";

type ChecklistItem = {
  id: string;
  title: string;
  assignedTo: string;
  done: boolean;
  doneAt: string | null;
  order: number;
};

export function ChecklistSection({ initial }: { initial: ChecklistItem[] }) {
  const [items, setItems] = useState(initial);

  async function toggle(itemId: string, done: boolean) {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, done, doneAt: done ? new Date().toISOString() : null } : it))
    );
    await fetch(`/api/members/client-services/checklist/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
  }

  const total = items.length;
  const done = items.filter((i) => i.done).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[var(--muted)]">{done} of {total} complete</span>
          <span className="text-xs font-semibold text-[var(--accent)]">{pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
              item.done
                ? "border-white/[0.04] bg-white/[0.02] opacity-60"
                : "border-white/[0.06] bg-[var(--surface-elevated)]"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(item.id, !item.done)}
              aria-label={item.done ? "Mark incomplete" : "Mark complete"}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                item.done
                  ? "border-[var(--accent)] bg-[var(--accent)]"
                  : "border-white/20 hover:border-[var(--accent)]/60"
              }`}
            >
              {item.done && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className={`flex-1 text-sm ${item.done ? "line-through text-[var(--muted)]" : "text-[var(--foreground)]"}`}>
              {item.title}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              item.assignedTo === "agent"
                ? "bg-blue-500/10 text-blue-400"
                : "bg-white/[0.06] text-[var(--muted)]"
            }`}>
              {item.assignedTo === "agent" ? "Agent" : "You"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
