'use client';

import { useLayoutEffect, useRef, useState, type UIEvent } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@portfolio/shared';

export function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [active, setActive] = useState(0);

  const loop = images.length > 1;
  // With looping enabled, a clone of the last slide is prepended and a
  // clone of the first slide is appended, so scrolling past either end
  // lands on a lookalike slide that we silently snap back from — the
  // classic infinite-carousel trick, giving a track that never dead-ends.
  const slides = loop ? [images[images.length - 1], ...images, images[0]] : images;

  function slideStep() {
    const track = trackRef.current;
    return ((track?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0) + 16;
  }

  function scrollToExtendedIndex(index: number, smooth: boolean) {
    trackRef.current?.scrollTo({ left: index * slideStep(), behavior: smooth ? 'smooth' : 'auto' });
  }

  useLayoutEffect(() => {
    if (loop) scrollToExtendedIndex(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop]);

  function goTo(index: number) {
    setActive(index);
    scrollToExtendedIndex(loop ? index + 1 : index, true);
  }

  function next() {
    if (!loop) return goTo(Math.min(active + 1, images.length - 1));
    scrollToExtendedIndex(active + 2, true);
  }

  function prev() {
    if (!loop) return goTo(Math.max(active - 1, 0));
    scrollToExtendedIndex(active, true);
  }

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const track = e.currentTarget;
    const step = slideStep();
    const rawIndex = Math.round(track.scrollLeft / step);

    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      if (!loop) {
        setActive(Math.min(Math.max(rawIndex, 0), images.length - 1));
        return;
      }
      if (rawIndex <= 0) {
        scrollToExtendedIndex(images.length, false);
        setActive(images.length - 1);
      } else if (rawIndex >= slides.length - 1) {
        scrollToExtendedIndex(1, false);
        setActive(0);
      } else {
        setActive(rawIndex - 1);
      }
    }, 120);
  }

  if (images.length === 0) return null;

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {slides.map((image, i) => (
          <figure
            key={`${image.id}-${i}`}
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
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-sm dark:border-white/20"
          >
            &lsaquo;
          </button>
          <div className="flex gap-2">
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
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-sm dark:border-white/20"
          >
            &rsaquo;
          </button>
        </div>
      )}
    </div>
  );
}
