"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How is your management fee calculated?",
    a: "Our fee is a percentage of the monthly rent, charged monthly. The exact rate depends on the package you select. There are no hidden setup fees. We walk you through the full cost breakdown before you sign anything.",
  },
  {
    q: "What does the tenant placement process involve?",
    a: "We market the unit across rental platforms and our agent network, coordinate showings, and vet every applicant with credit checks, employment verification, and reference calls. We present you with our recommendation and you make the final call before any lease is signed.",
  },
  {
    q: "How do you handle maintenance requests?",
    a: "Tenants contact us directly for any maintenance issues. We coordinate with our vetted vendor network to get work done promptly. For anything above a pre-agreed cost threshold, we notify you before authorizing the work. You are not fielding calls at 11pm.",
  },
  {
    q: "Can I use my own contractors?",
    a: "Yes. If you have preferred vendors you want us to work with, we are happy to coordinate through them. We handle scheduling, access, and follow-up regardless of who does the work.",
  },
  {
    q: "Do you handle Landlord and Tenant Board matters?",
    a: "We assist with documentation, notices, and process guidance for common situations like late payments or lease violations. For formal LTB hearings or filings that require legal representation, we refer you to trusted paralegals and can brief them on your case.",
  },
  {
    q: "How do you handle lease renewals?",
    a: "We reach out proactively before the lease end date, review current market rents, and advise on whether to renew at the existing rate, increase within Ontario's allowable guidelines, or re-list the unit. We handle all renewal paperwork and tenant communication.",
  },
] as const;

export default function PMFaq() {
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
