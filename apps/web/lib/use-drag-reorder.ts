'use client';

import { useState, type Dispatch, type DragEvent, type SetStateAction } from 'react';

/**
 * Drag-to-reorder for an admin list. Reordering happens live in local state
 * as the user drags over other rows (so the list visibly shifts, matching
 * the reference interaction); on drop, only the rows whose position
 * actually changed are persisted via `persist`, using each item's existing
 * `sortOrder` field and admin PATCH endpoint — no new API or schema needed.
 */
export function useDragReorder<T extends { id: number; sortOrder: number }>(
  items: T[] | null,
  setItems: Dispatch<SetStateAction<T[] | null>>,
  persist: (id: number, sortOrder: number) => Promise<unknown>,
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDragStart(index: number) {
    return (e: DragEvent<HTMLElement>) => {
      if (!(e.target as HTMLElement).closest('[data-drag-handle]')) {
        e.preventDefault();
        return;
      }
      setDragIndex(index);
    };
  }

  function handleDragOver(index: number) {
    return (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === index) return;
      setItems((prev) => {
        if (!prev) return prev;
        const next = [...prev];
        const [moved] = next.splice(dragIndex, 1);
        next.splice(index, 0, moved);
        return next;
      });
      setDragIndex(index);
    };
  }

  function handleDrop(e: DragEvent<HTMLElement>) {
    e.preventDefault();
  }

  function handleDragEnd() {
    setDragIndex(null);
    items?.forEach((item, index) => {
      if (item.sortOrder !== index) {
        persist(item.id, index);
      }
    });
  }

  return { dragIndex, handleDragStart, handleDragOver, handleDrop, handleDragEnd };
}
