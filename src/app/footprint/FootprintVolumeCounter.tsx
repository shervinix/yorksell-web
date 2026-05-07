"use client";

import { useEffect, useRef, useState } from "react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function FootprintVolumeCounter({ total }: { total: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 2200;
          const startTime = performance.now();

          function tick(now: number) {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            // ease-out quart — fast start, smooth landing
            const eased = 1 - Math.pow(1 - t, 4);
            setDisplayValue(Math.round(eased * total));
            if (t < 1) requestAnimationFrame(tick);
            else setDisplayValue(total);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [total]);

  return (
    <div ref={ref} className="mt-8 tabular-nums text-5xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl md:text-7xl lg:text-8xl">
      {formatCurrency(displayValue)}
    </div>
  );
}
