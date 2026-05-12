"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How is commission structured?",
    a: "In Ontario, the listing brokerage fee is typically a percentage of the sale price, negotiated at the time of listing. Part of that covers the buyer's agent commission. We walk you through the full breakdown before you sign anything so there are no surprises at closing.",
  },
  {
    q: "When is the best time to sell?",
    a: "Spring and fall are traditionally the busiest markets in Toronto, which can mean more buyers but also more competing listings. The best time to sell depends on your property type, neighbourhood, and personal timeline. We give you an honest read on current conditions rather than a generic answer.",
  },
  {
    q: "Should I renovate before listing?",
    a: "Usually not extensively. Targeted improvements like fresh paint, minor repairs, decluttering, and professional staging tend to deliver the best return. Major renovations rarely recover their cost in the sale price. We walk through the property with you and advise on exactly what is and isn't worth doing.",
  },
  {
    q: "What is a holdback and should I use one?",
    a: "A holdback means setting an offer review date several days after listing, giving buyers time to view the property and prepare competing offers. In the right conditions it can generate a multiple-offer scenario and drive the price up. We advise based on current market activity, your property type, and neighbourhood. It is not always the right move.",
  },
  {
    q: "How long will my property be on the market?",
    a: "It depends on pricing, presentation, and the current market. Correctly priced, well-presented properties in active neighbourhoods often sell within the first two weeks. We set realistic expectations upfront and adjust strategy if needed rather than letting a listing go stale.",
  },
  {
    q: "Do I need to be home during showings?",
    a: "No, and in most cases it is better if you are not. Buyers tend to move through a property more comfortably and spend more time when the owner is absent. We coordinate all showings, manage lockbox access, and follow up with every agent who views the property.",
  },
] as const;

export default function SellFAQ() {
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
