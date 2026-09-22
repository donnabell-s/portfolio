import { Router } from 'express';
import { and, eq, gt, sql } from 'drizzle-orm';
import { contactFormSchema } from '@portfolio/shared';
import { db } from '../db/client.js';
import { contactMessages } from '../db/schema.js';
import { requireAuth } from '../middleware/auth.js';
import { issueFormToken, checkFormToken } from '../lib/formToken.js';

export const publicContactRouter = Router();
export const adminMessagesRouter = Router();

/** Max submissions from one IP per hour. Checked against the DB directly —
 * an in-memory counter would reset on every cold serverless invocation. */
const RATE_LIMIT_PER_HOUR = 5;

publicContactRouter.get('/token', (_req, res) => {
  res.json({ token: issueFormToken() });
});

publicContactRouter.post('/', async (req, res) => {
  const parsed = contactFormSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const { name, email, subject, body, company, startedAt } = parsed.data;

  // Honeypot: a real visitor never fills this hidden field.
  if (company) {
    // Respond as if it succeeded — telling a bot it was caught only teaches it to adapt.
    res.status(201).json({ ok: true });
    return;
  }

  const tokenCheck = checkFormToken(startedAt);
  if (!tokenCheck.ok) {
    res.status(400).json({ error: 'Form submitted too quickly or the token expired. Please try again.' });
    return;
  }

  const ip = req.ip ?? null;
  if (ip) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactMessages)
      .where(and(eq(contactMessages.ip, ip), gt(contactMessages.createdAt, oneHourAgo)));
    if (count >= RATE_LIMIT_PER_HOUR) {
      res.status(429).json({ error: 'Too many messages sent recently. Please try again later.' });
      return;
    }
  }

  await db.insert(contactMessages).values({
    name,
    email,
    subject,
    body,
    ip: ip ?? undefined,
    userAgent: req.get('user-agent') ?? undefined,
  });

  res.status(201).json({ ok: true });
});

// ---------- Admin inbox ----------

adminMessagesRouter.use(requireAuth);

adminMessagesRouter.get('/', async (_req, res) => {
  const rows = await db.query.contactMessages.findMany({
    orderBy: (m, { desc }) => desc(m.createdAt),
  });
  res.json(rows);
});

adminMessagesRouter.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || typeof req.body?.isRead !== 'boolean') {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
  const [updated] = await db
    .update(contactMessages)
    .set({ isRead: req.body.isRead })
    .where(eq(contactMessages.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }
  res.json(updated);
});
