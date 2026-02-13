"use client";

import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80";

export function ListingHeroImage({ src, alt = "" }: { src: string; alt?: string }) {
  const [failed, setFailed] = useState(false);
  const effectiveSrc = failed || !src ? PLACEHOLDER : src;
  const isProxy = src.startsWith("/api/");
  const isPlaceholder = effectiveSrc === PLACEHOLDER || effectiveSrc.startsWith("https://images.unsplash.com");

  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      fill
      className="object-cover"
      priority
      unoptimized={isProxy || !isPlaceholder}
      onError={() => setFailed(true)}
    />
  );
}
