"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Do I pay for buyer representation?",
    a: "In Ontario, buyer agent commission is typically paid by the seller as part of the transaction. In most cases, there is no direct cost to you for our representation. We'll walk you through how this works before we begin so there are no surprises.",
  },
  {
    q: "Do I need a mortgage pre-approval before we start?",
    a: "We strongly recommend it. A pre-approval sets your real budget, makes your offers more competitive, and avoids the disappointment of falling in love with a property you can't finance. We can connect you with trusted mortgage brokers if you need one.",
  },
  {
    q: "How long does a typical search take?",
    a: "It depends on the market and how specific your criteria are. Most buyers find their property within 4–12 weeks of active searching. We'll give you an honest read on what to expect based on your budget and target neighbourhoods.",
  },
  {
    q: "What is a deposit and how much do I need?",
    a: "A deposit is submitted with your offer and held in trust until closing. In Toronto, deposits typically range from $25,000 to 5% of the purchase price depending on the property type and market conditions. It forms part of your down payment.",
  },
  {
    q: "What happens if my offer isn't accepted?",
    a: "We debrief on what happened: price, conditions, competing bids. We adjust strategy if needed and keep searching. Multiple offer rounds are common in Toronto. Each one builds a clearer picture of the market and what it takes to win.",
  },
  {
    q: "Can you help me buy a pre-construction property?",
    a: "Yes. Pre-construction involves different timelines, deposit structures, and risks than resale. We walk you through the assignment clauses, developer reputation, and long-term value considerations before you commit.",
  },
] as const;

export default function BuyFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-[var(--foreground)]">{faq.q}</span>
              <span
                className="shrink-0 text-[var(--muted)] transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                aria-hidden
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
              </span>
            </button>
            <div
              className="grid transition-all duration-300"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-[var(--muted)]">{faq.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
