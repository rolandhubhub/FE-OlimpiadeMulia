"use client";

import { useState } from "react";

interface ThumbProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export default function Thumb({ src, alt, className = "" }: ThumbProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showPlaceholder = !src || failedSrc === src;

  if (showPlaceholder) {
    return (
      <span className={`thumb thumb--placeholder ${className}`.trim()} role="img" aria-label={alt}>
        Tidak ada gambar
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`thumb ${className}`.trim()}
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
    />
  );
}
