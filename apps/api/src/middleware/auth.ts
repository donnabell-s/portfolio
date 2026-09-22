import type { Request, Response, NextFunction } from 'express';
import { sessionCookie, verifySession } from '../lib/jwt.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: { id: number; email: string };
    }
  }
}

/**
 * Guards every /admin/* route. This is the real gate — the Next.js
 * middleware only hides the admin UI for convenience; the API domain is
 * reachable directly (bypassing the rewrite proxy), so authorization must
 * be enforced here regardless of what the frontend does.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[sessionCookie.name];
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  try {
    const payload = verifySession(token);
    req.admin = { id: payload.sub, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}
