import { Router } from 'express';
import { eq, desc, asc } from 'drizzle-orm';
import { projectInputSchema, projectUpdateSchema, projectImageSchema } from '@portfolio/shared';
import { db } from '../db/client.js';
import { projects, projectImages } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { z } from 'zod';

export const publicProjectsRouter = Router();
export const adminProjectsRouter = Router();

// ---------- Public ----------

publicProjectsRouter.get('/', async (_req, res) => {
  const rows = await db.query.projects.findMany({
    where: eq(projects.status, 'published'),
    orderBy: [desc(projects.featured), asc(projects.sortOrder), desc(projects.year)],
    with: { images: { orderBy: asc(projectImages.sortOrder) } },
  });
  res.json(rows);
});

publicProjectsRouter.get('/:slug', async (req, res) => {
  const row = await db.query.projects.findFirst({
    where: eq(projects.slug, req.params.slug),
    with: { images: { orderBy: asc(projectImages.sortOrder) } },
  });
  if (!row || row.status !== 'published') {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(row);
});

// ---------- Admin ----------

adminProjectsRouter.use(requireAuth);

adminProjectsRouter.get('/', async (_req, res) => {
  const rows = await db.query.projects.findMany({
    orderBy: [asc(projects.sortOrder), desc(projects.year)],
    with: { images: { orderBy: asc(projectImages.sortOrder) } },
  });
  res.json(rows);
});

adminProjectsRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const row = await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: { images: { orderBy: asc(projectImages.sortOrder) } },
  });
  if (!row) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(row);
});

adminProjectsRouter.post('/', async (req, res) => {
  const parsed = projectInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const { images, ...projectData } = parsed.data;

  const existingSlug = await db.query.projects.findFirst({
    where: eq(projects.slug, projectData.slug),
  });
  if (existingSlug) {
    res.status(409).json({ error: 'A project with this slug already exists' });
    return;
  }

  const [created] = await db.insert(projects).values(projectData).returning();
  if (images.length > 0) {
    await db
      .insert(projectImages)
      .values(images.map((img) => ({ ...img, projectId: created.id })));
  }

  const full = await db.query.projects.findFirst({
    where: eq(projects.id, created.id),
    with: { images: { orderBy: asc(projectImages.sortOrder) } },
  });
  res.status(201).json(full);
});

adminProjectsRouter.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const parsed = projectUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const { images, ...projectData } = parsed.data;

  const existing = await db.query.projects.findFirst({ where: eq(projects.id, id) });
  if (!existing) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  if (projectData.slug && projectData.slug !== existing.slug) {
    const clash = await db.query.projects.findFirst({
      where: eq(projects.slug, projectData.slug),
    });
    if (clash) {
      res.status(409).json({ error: 'A project with this slug already exists' });
      return;
    }
  }

  if (Object.keys(projectData).length > 0) {
    await db
      .update(projects)
      .set({ ...projectData, updatedAt: new Date() })
      .where(eq(projects.id, id));
  }

  // Images are replaced wholesale on edit — the admin form always submits
  // the full gallery list, so a diff isn't needed and this keeps ordering
  // (sortOrder) trivially correct.
  if (images) {
    await db.delete(projectImages).where(eq(projectImages.projectId, id));
    if (images.length > 0) {
      await db.insert(projectImages).values(images.map((img) => ({ ...img, projectId: id })));
    }
  }

  const full = await db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: { images: { orderBy: asc(projectImages.sortOrder) } },
  });
  res.json(full);
});

adminProjectsRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const deleted = await db.delete(projects).where(eq(projects.id, id)).returning();
  if (deleted.length === 0) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  // project_images rows cascade via the FK's onDelete: 'cascade'.
  res.status(204).send();
});

const imageIdParam = z.object({ id: z.coerce.number().int(), imageId: z.coerce.number().int() });

adminProjectsRouter.post('/:id/images', async (req, res) => {
  const id = Number(req.params.id);
  const parsed = projectImageSchema.omit({ id: true }).safeParse(req.body);
  if (!Number.isInteger(id) || !parsed.success) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
  const [created] = await db
    .insert(projectImages)
    .values({ ...parsed.data, projectId: id })
    .returning();
  res.status(201).json(created);
});

adminProjectsRouter.delete('/:id/images/:imageId', async (req, res) => {
  const parsed = imageIdParam.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  await db
    .delete(projectImages)
    .where(eq(projectImages.id, parsed.data.imageId));
  res.status(204).send();
});
