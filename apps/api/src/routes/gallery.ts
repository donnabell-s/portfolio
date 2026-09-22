import { Router } from 'express';
import { asc, eq } from 'drizzle-orm';
import { galleryImageInputSchema } from '@portfolio/shared';
import { db } from '../db/client.js';
import { galleryImages } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';

export const publicGalleryRouter = Router();
export const adminGalleryRouter = Router();

// ---------- Public ----------

publicGalleryRouter.get('/', async (_req, res) => {
  const rows = await db.query.galleryImages.findMany({
    orderBy: asc(galleryImages.sortOrder),
  });
  res.json(rows);
});

// ---------- Admin ----------

adminGalleryRouter.use(requireAuth);

adminGalleryRouter.get('/', async (_req, res) => {
  const rows = await db.query.galleryImages.findMany({
    orderBy: asc(galleryImages.sortOrder),
  });
  res.json(rows);
});

adminGalleryRouter.post('/', async (req, res) => {
  const parsed = galleryImageInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const [created] = await db.insert(galleryImages).values(parsed.data).returning();
  res.status(201).json(created);
});

adminGalleryRouter.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const parsed = galleryImageInputSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const [updated] = await db
    .update(galleryImages)
    .set(parsed.data)
    .where(eq(galleryImages.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: 'Gallery image not found' });
    return;
  }
  res.json(updated);
});

adminGalleryRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const deleted = await db.delete(galleryImages).where(eq(galleryImages.id, id)).returning();
  if (deleted.length === 0) {
    res.status(404).json({ error: 'Gallery image not found' });
    return;
  }
  res.status(204).send();
});
