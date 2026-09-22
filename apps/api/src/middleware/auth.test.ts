import { describe, it, expect } from 'vitest';
import express from 'express';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { requireAuth } from './auth.js';
import { signSession, sessionCookie } from '../lib/jwt.js';

function buildTestApp() {
  const app = express();
  app.use(cookieParser());
  app.get('/protected', requireAuth, (req, res) => {
    res.json({ admin: req.admin });
  });
  return app;
}

describe('requireAuth', () => {
  it('returns 401 when no session cookie is present', async () => {
    const app = buildTestApp();
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  it('returns 401 for a garbage cookie value', async () => {
    const app = buildTestApp();
    const res = await request(app)
      .get('/protected')
      .set('Cookie', `${sessionCookie.name}=not-a-valid-jwt`);
    expect(res.status).toBe(401);
  });

  it('allows the request through with a valid session cookie', async () => {
    const app = buildTestApp();
    const token = signSession({ sub: 1, email: 'admin@example.com' });
    const res = await request(app).get('/protected').set('Cookie', `${sessionCookie.name}=${token}`);
    expect(res.status).toBe(200);
    expect(res.body.admin).toEqual({ id: 1, email: 'admin@example.com' });
  });
});
