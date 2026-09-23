'use client';

import { useState, type SyntheticEvent } from 'react';
import Image from 'next/image';

/**
 * Shows the full image at its real aspect ratio (object-contain, never
 * object-cover) so nothing is cropped or stretched. The wrapper starts at
 * `defaultRatio` and snaps to the image's real ratio once it loads, so nothing
 * shifts noticeably once the browser has the real dimensions.
 */
export function AspectFitImage({
  src,
  alt,
  sizes,
  priority = false,
  className = '',
  defaultRatio = 4 / 3,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  defaultRatio?: number;
}) {
  const [ratio, setRatio] = useState(defaultRatio);

  function handleLoad(e: SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setRatio(img.naturalWidth / img.naturalHeight);
    }
  }

  return (
    <div className={`relative w-full bg-black/5 dark:bg-white/5 ${className}`} style={{ aspectRatio: ratio }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-contain"
        priority={priority}
        onLoad={handleLoad}
      />
    </div>
  );
}
