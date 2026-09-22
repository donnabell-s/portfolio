import { Router } from 'express';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { loginSchema } from '@portfolio/shared';
import { db } from '../db/client.js';
import { adminUsers } from '../db/schema.js';
import { signSession, sessionCookie } from '../lib/jwt.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

const isProd = process.env.NODE_ENV === 'production';

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
    return;
  }
  const { email, password } = parsed.data;

  const user = await db.query.adminUsers.findFirst({ where: eq(adminUsers.email, email) });
  // Always run the hash verification, even on a missing user, against a
  // fixed dummy hash — otherwise a timing difference between "no such
  // user" and "wrong password" leaks which admin emails exist.
  const hashToVerify =
    user?.passwordHash ??
    '$argon2id$v=19$m=65536,t=3,p=4$c2FsdHNhbHRzYWx0c2FsdA$Y5koeSg2XxlqB6qhqvxKfC9wR1oIup/dR4rY5s7DKgI';
  const valid = await argon2.verify(hashToVerify, password).catch(() => false);

  if (!user || !valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = signSession({ sub: user.id, email: user.email });
  res.cookie(sessionCookie.name, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: sessionCookie.maxAgeMs,
    path: '/',
    // No `domain` set — host-only cookie. This is what keeps auth working
    // despite portfolio-xxx.vercel.app and portfolio-api-xxx.vercel.app
    // being unrelated origins on the public suffix list.
  });
  res.json({ id: user.id, email: user.email });
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(sessionCookie.name, { path: '/' });
  res.status(204).send();
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ id: req.admin!.id, email: req.admin!.email });
});
