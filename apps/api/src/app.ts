import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.js';
import { publicProjectsRouter, adminProjectsRouter } from './routes/projects.js';
import { publicContactRouter, adminMessagesRouter } from './routes/contact.js';
import { publicGalleryRouter, adminGalleryRouter } from './routes/gallery.js';

export function createApp() {
  const app = express();

  // Vercel (and most PaaS front doors) sit behind a reverse proxy — without
  // this, req.ip and req.secure read the proxy's connection, not the
  // visitor's, which breaks both rate limiting and secure-cookie checks.
  app.set('trust proxy', 1);

  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  const corsOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && corsOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/auth', authRouter);
  app.use('/projects', publicProjectsRouter);
  app.use('/admin/projects', adminProjectsRouter);
  app.use('/contact', publicContactRouter);
  app.use('/admin/messages', adminMessagesRouter);
  app.use('/gallery', publicGalleryRouter);
  app.use('/admin/gallery', adminGalleryRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Express 5 error handler — must take 4 args to be recognized as one.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
