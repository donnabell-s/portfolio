'use client';

import { useRef, useState, type UIEvent } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@portfolio/shared';

export function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  function goTo(index: number) {
    const track = trackRef.current;
    const target = track?.children[index] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    setActive(index);
  }

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const track = e.currentTarget;
    const slideWidth = (track.firstElementChild as HTMLElement | null)?.offsetWidth || 1;
    const index = Math.round(track.scrollLeft / (slideWidth + 16));
    setActive(Math.min(Math.max(index, 0), images.length - 1));
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {images.map((image, i) => (
          <figure
            key={image.id}
            className="relative aspect-[4/3] w-[85%] shrink-0 snap-start overflow-hidden rounded-xl bg-black/5 sm:w-[45%] dark:bg-white/5"
          >
            <Image
              src={image.path}
              alt={image.title || 'Gallery photo'}
              fill
              sizes="(min-width: 640px) 45vw, 85vw"
              className="object-cover"
              priority={i === 0}
            />
            {image.title && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm font-medium text-white">
                {image.title}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === active ? 'bg-accent' : 'bg-black/15 dark:bg-white/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
