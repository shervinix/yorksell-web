"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { isHdPhotoUrl } from "@/lib/listing-photos";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80";

const SWIPE_THRESHOLD = 50; // px
const AUTO_PLAY_MS = 6000;

type Props = {
  photos: string[];
  fallbackSrc: string;
  alt?: string;
};

export function ListingPhotoSlideshow({ photos, fallbackSrc, alt = "" }: Props) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userInteractedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const lightboxThumbRef = useRef<HTMLDivElement>(null);

  /* ── build URL list ──────────────────────────────────────────────────────── */
  const unique = photos.filter((u, i) => photos.indexOf(u) === i);
  const fallbackTrimmed = fallbackSrc?.trim() ?? "";
  const fallbackOk =
    fallbackTrimmed &&
    (fallbackTrimmed.startsWith("/api/listings/photo") || isHdPhotoUrl(fallbackTrimmed))
      ? fallbackTrimmed
      : "";
  const rawUrls = unique.length > 0 ? unique : fallbackOk ? [fallbackOk] : [PLACEHOLDER];
  const urls = rawUrls.map((u) => (u?.trim() ? u : PLACEHOLDER));
  const count = urls.length;
  const multi = count > 1;

  /* ── navigation ──────────────────────────────────────────────────────────── */
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = null;
  }, []);

  const goTo = useCallback(
    (next: number, fromUser = false) => {
      if (fromUser) {
        userInteractedRef.current = true;
        stopAutoPlay();
      }
      setTransitioning(true);
      setTimeout(() => {
        setIndex((next + count) % count);
        setTransitioning(false);
      }, 150);
    },
    [count, stopAutoPlay]
  );

  const prev = useCallback((fromUser = true) => goTo(index - 1, fromUser), [goTo, index]);
  const next = useCallback((fromUser = true) => goTo(index + 1, fromUser), [goTo, index]);

  /* ── auto-play ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!multi || userInteractedRef.current) return;
    autoPlayRef.current = setInterval(() => next(false), AUTO_PLAY_MS);
    return () => stopAutoPlay();
  }, [multi, next, stopAutoPlay]);

  /* ── keyboard ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!lightboxOpen && !multi) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, multi, prev, next]);

  /* ── scroll active thumbnail into view ───────────────────────────────────── */
  useEffect(() => {
    if (!lightboxOpen || !lightboxThumbRef.current) return;
    const strip = lightboxThumbRef.current;
    const active = strip.children[index] as HTMLElement | undefined;
    if (active) active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index, lightboxOpen]);

  /* ── lock body scroll when lightbox open ─────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  /* ── touch handlers ──────────────────────────────────────────────────────── */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    dx < 0 ? next() : prev();
  };

  const src = (i: number) => (failed.has(i) ? PLACEHOLDER : urls[i]);

  /* ── main viewer ─────────────────────────────────────────────────────────── */
  return (
    <>
      <div
        className="relative h-full w-full cursor-pointer select-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={() => setLightboxOpen(true)}
      >
        {/* Images with crossfade */}
        {urls.map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === index ? (transitioning ? 0 : 1) : 0, zIndex: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            {/* Only render nearby images for perf */}
            {Math.abs(i - index) <= 1 || i === 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src(i)}
                alt={i === 0 ? alt : ""}
                className="h-full w-full object-cover"
                onError={() => setFailed((s) => new Set(s).add(i))}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            ) : null}
          </div>
        ))}

        {/* Counter + expand hint */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
          {multi && (
            <span className="rounded-lg bg-black/55 px-2.5 py-1 text-xs font-medium tabular-nums text-white/80 backdrop-blur-sm">
              {index + 1} / {count}
            </span>
          )}
          <span className="flex items-center gap-1 rounded-lg bg-black/55 px-2.5 py-1 text-xs text-white/70 backdrop-blur-sm">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5V3h2M11 3h2v2M13 11v2h-2M5 13H3v-2" />
            </svg>
            {multi ? "View all photos" : "Expand"}
          </span>
        </div>

        {/* Prev / Next */}
        {multi && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Previous photo"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white backdrop-blur-sm transition hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Next photo"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col bg-black"
          role="dialog"
          aria-modal
          aria-label="Photo viewer"
        >
          {/* Top bar */}
          <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
            <span className="text-sm font-medium tabular-nums text-white/60">
              {index + 1} <span className="text-white/30">/ {count}</span>
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Close photo viewer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main image area */}
          <div
            className="relative min-h-0 flex-1"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {urls.map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                style={{ opacity: i === index ? (transitioning ? 0 : 1) : 0, zIndex: i === index ? 1 : 0 }}
                aria-hidden={i !== index}
              >
                {Math.abs(i - index) <= 1 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src(i)}
                    alt={i === 0 ? alt : ""}
                    className="max-h-full max-w-full object-contain"
                    onError={() => setFailed((s) => new Set(s).add(i))}
                    loading="eager"
                    decoding="async"
                  />
                ) : null}
              </div>
            ))}

            {/* Lightbox Prev / Next */}
            {multi && (
              <>
                <button
                  type="button"
                  onClick={() => prev()}
                  className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:left-4"
                  aria-label="Previous photo"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => next()}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:right-4"
                  aria-label="Next photo"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {multi && (
            <div className="shrink-0 border-t border-white/[0.08] bg-black/60 px-3 py-3 backdrop-blur-sm">
              <div
                ref={lightboxThumbRef}
                className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {urls.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i, true)}
                    aria-label={`Go to photo ${i + 1}`}
                    aria-current={i === index}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md transition ${
                      i === index
                        ? "ring-2 ring-white ring-offset-1 ring-offset-black"
                        : "opacity-50 hover:opacity-80"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src(i)}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
