"use client";

import { useState, useCallback, useEffect } from "react";
import { isHdPhotoUrl } from "@/lib/listing-photos";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80";

type ListingPhotoSlideshowProps = {
  /** All photo URLs in order (prefer full-quality e.g. LargePhotoURL). */
  photos: string[];
  /** Single fallback when photos is empty (e.g. listing.photoUrl or proxy). */
  fallbackSrc: string;
  alt?: string;
};

export function ListingPhotoSlideshow({ photos, fallbackSrc, alt = "" }: ListingPhotoSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());

  const uniquePhotos = photos.filter((u, i) => photos.indexOf(u) === i);
  // Fallback: only proxy (large-first) or URLs that pass strict HD heuristics — never mixed low-res.
  const fallbackTrimmed = fallbackSrc?.trim() ?? "";
  const fallbackOk =
    fallbackTrimmed &&
    (fallbackTrimmed.startsWith("/api/listings/photo") || isHdPhotoUrl(fallbackTrimmed))
      ? fallbackTrimmed
      : "";
  const urls =
    uniquePhotos.length > 0 ? uniquePhotos : fallbackOk ? [fallbackOk] : [PLACEHOLDER];
  const effectiveUrls = urls.map((u) => (u && u.trim() ? u : PLACEHOLDER));
  const count = effectiveUrls.length;
  const isSingle = count <= 1;
  const showControls = count > 1;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (!showControls) return;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [showControls, go]);

  const currentSrc = effectiveUrls[index];
  const isProxy = currentSrc.startsWith("/api/");
  const useUnoptimized = isProxy || currentSrc === PLACEHOLDER;

  return (
    <div className="relative h-full w-full">
      {effectiveUrls.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{ opacity: i === index && !failed.has(i) ? 1 : 0, zIndex: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={failed.has(i) ? PLACEHOLDER : src}
            alt={i === 0 ? alt : ""}
            className="h-full w-full object-cover"
            onError={() => setFailed((s) => new Set(s).add(i))}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
      ))}

      {showControls && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous photo"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next photo"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-1.5">
            {effectiveUrls.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
