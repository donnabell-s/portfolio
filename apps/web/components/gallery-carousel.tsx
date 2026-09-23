'use client';

import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@portfolio/shared';

export function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const loop = images.length > 1;
  // A clone of the last slide is prepended and a clone of the first slide is
  // appended, so the track can keep animating past either end. Once the
  // animation lands on a clone, we silently jump (no transition) to the
  // matching real slide — the standard infinite-carousel technique, but
  // driven by transform + transitionend instead of native scroll-snap,
  // which was prone to getting stuck mid-gesture.
  const slides = loop ? [images[images.length - 1], ...images, images[0]] : images;

  const [pos, setPos] = useState(loop ? 1 : 0);
  const [animate, setAnimate] = useState(false);
  const [offset, setOffset] = useState(0);
  const [dragX, setDragX] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const dragging = useRef(false);

  const active = !loop ? pos : pos === 0 ? images.length - 1 : pos === slides.length - 1 ? 0 : pos - 1;

  function offsetOf(index: number) {
    const el = trackRef.current?.children[index] as HTMLElement | null;
    return el ? el.offsetLeft : 0;
  }

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- measuring real DOM layout after (re)render, not mirroring external state
    setOffset(offsetOf(pos));
  }, [pos, images.length]);

  useLayoutEffect(() => {
    function handleResize() {
      setOffset(offsetOf(pos));
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pos]);

  function moveTo(index: number, withAnimation: boolean) {
    setAnimate(withAnimation);
    setPos(index);
  }

  function goTo(imageIndex: number) {
    moveTo(loop ? imageIndex + 1 : imageIndex, true);
  }

  function next() {
    moveTo(Math.min(pos + 1, slides.length - 1), true);
  }

  function prev() {
    moveTo(Math.max(pos - 1, 0), true);
  }

  function handleTransitionEnd() {
    if (!loop) return;
    if (pos === 0) moveTo(slides.length - 2, false);
    else if (pos === slides.length - 1) moveTo(1, false);
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (slides.length <= 1) return;
    dragging.current = true;
    dragStartX.current = e.clientX;
    setAnimate(false);
    trackRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging.current || dragStartX.current === null) return;
    setDragX(e.clientX - dragStartX.current);
  }

  function endDrag() {
    if (!dragging.current) return;
    dragging.current = false;
    dragStartX.current = null;
    const threshold = 50;
    const delta = dragX;
    setDragX(0);
    if (delta <= -threshold) next();
    else if (delta >= threshold) prev();
    else setAnimate(true);
  }

  if (images.length === 0) return null;

  const x = -offset + dragX;

  return (
    <div>
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`flex gap-4 ${animate ? 'transition-transform duration-300 ease-out' : ''} ${
            slides.length > 1 ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
          style={{ transform: `translateX(${x}px)`, touchAction: 'pan-y' }}
        >
          {slides.map((image, i) => (
            <figure
              key={`${image.id}-${i}`}
              className="relative aspect-[4/3] w-[85%] shrink-0 select-none overflow-hidden rounded-xl bg-black/5 sm:w-[45%] dark:bg-white/5"
            >
              <Image
                src={image.path}
                alt={image.title || 'Gallery photo'}
                fill
                sizes="(min-width: 640px) 45vw, 85vw"
                className="object-cover"
                priority={i === 0}
                draggable={false}
              />
              {image.title && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm font-medium text-white">
                  {image.title}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous image"
            onClick={prev}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-sm transition-colors hover:border-foreground/40 dark:border-white/20"
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
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-sm transition-colors hover:border-foreground/40 dark:border-white/20"
          >
            &rsaquo;
          </button>
        </div>
      )}
    </div>
  );
}
