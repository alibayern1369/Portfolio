"use client";

import Image from "next/image";
import { useState } from "react";

interface CoverImageProps {
  src: string;
  alt: string;
  /** Optional fixed aspect ratio, e.g. "16/9". If omitted, uses the image's natural ratio once loaded. */
  aspectRatio?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  rounded?: string;
}

/**
 * Responsive cover image: fills its container with object-cover,
 * and by default adopts the image's own aspect ratio.
 */
export function CoverImage({
  src,
  alt,
  aspectRatio,
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  rounded = "",
}: CoverImageProps) {
  const [naturalRatio, setNaturalRatio] = useState<string | null>(null);
  const ratio = aspectRatio || naturalRatio || "16 / 9";

  return (
    <div
      className={`relative w-full overflow-hidden bg-secondary ${rounded} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover object-center ${imageClassName}`}
        onLoad={(e) => {
          if (aspectRatio) return;
          const img = e.currentTarget;
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            setNaturalRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
          }
        }}
      />
    </div>
  );
}
