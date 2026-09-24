'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { useDragReorder } from '@/lib/use-drag-reorder';
import { GripIcon } from '@/components/admin/grip-icon';
import type { GalleryImage } from '@portfolio/shared';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [path, setPath] = useState('');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function reload() {
    api
      .adminGallery()
      .then(setImages)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load'));
  }

  useEffect(reload, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.createGalleryImage({
        path: path.trim(),
        title: title.trim(),
        sortOrder: images?.length ?? 0,
      });
      setPath('');
      setTitle('');
      reload();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to add image');
    } finally {
      setSubmitting(false);
    }
  }

  function handleTitleChange(image: GalleryImage, value: string) {
    setImages((prev) => prev?.map((img) => (img.id === image.id ? { ...img, title: value } : img)) ?? null);
  }

  async function handleTitleBlur(image: GalleryImage) {
    try {
      await api.updateGalleryImage(image.id, { title: image.title });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save title');
    }
  }

  async function handleDelete(image: GalleryImage) {
    if (!confirm('Remove this gallery image?')) return;
    try {
      await api.deleteGalleryImage(image.id);
      setImages((prev) => prev?.filter((img) => img.id !== image.id) ?? null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed');
    }
  }

  const { dragIndex, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragReorder(
    images,
    setImages,
    (id, sortOrder) =>
      api
        .updateGalleryImage(id, { sortOrder })
        .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to save order')),
  );

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">Gallery</h1>

      <form
        onSubmit={handleAdd}
        className="mb-8 flex flex-wrap items-end gap-4 rounded-xl border border-black/10 p-4 dark:border-white/15"
      >
        <div className="min-w-[220px] flex-1">
          <label htmlFor="gallery-path" className="mb-1.5 block text-sm font-medium">
            Image path
          </label>
          <input
            id="gallery-path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/gallery/example.jpg"
            className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>
        <div className="min-w-[220px] flex-1">
          <label htmlFor="gallery-title" className="mb-1.5 block text-sm font-medium">
            Title
          </label>
          <input
            id="gallery-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !path.trim()}
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          Add image
        </button>
      </form>

      {error && <p role="alert" className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {!images ? (
        <p className="text-sm text-foreground/60">Loading…</p>
      ) : images.length === 0 ? (
        <p className="text-sm text-foreground/60">
          No gallery images yet. Commit an image under apps/web/public/gallery/ first, then add
          its path here.
        </p>
      ) : (
        <ul className="divide-y divide-black/10 rounded-xl border border-black/10 dark:divide-white/10 dark:border-white/15">
          {images.map((image, i) => (
            <li
              key={image.id}
              draggable
              onDragStart={handleDragStart(i)}
              onDragOver={handleDragOver(i)}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              className={`flex flex-wrap items-center gap-4 p-4 ${
                dragIndex === i ? 'opacity-50' : ''
              }`}
            >
              <span data-drag-handle className="cursor-grab touch-none text-foreground/40 active:cursor-grabbing">
                <GripIcon />
              </span>
              <span className="w-full truncate text-sm text-foreground/60 sm:w-56">
                {image.path}
              </span>
              <input
                value={image.title}
                onChange={(e) => handleTitleChange(image, e.target.value)}
                onBlur={() => handleTitleBlur(image)}
                placeholder="Title"
                className="min-w-[160px] flex-1 rounded-lg border border-black/15 bg-transparent px-3 py-1.5 text-sm dark:border-white/20"
              />
              <button
                type="button"
                onClick={() => handleDelete(image)}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
