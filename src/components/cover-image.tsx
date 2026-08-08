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
 * Responsive cover image: always fills the box with object-fit: cover.
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
  // Dynamic /api/media images should skip the optimizer so cover crop is reliable
  const unoptimized = src.startsWith("/api/media/") || src.startsWith("data:");

  return (
    <div
      className={`relative w-full overflow-hidden bg-secondary ${rounded} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src || "/images/og.jpg"}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        unoptimized={unoptimized}
        className={`!h-full !w-full object-cover object-center ${imageClassName}`}
        style={{ objectFit: "cover", objectPosition: "center" }}
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
