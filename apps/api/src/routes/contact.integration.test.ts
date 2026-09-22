import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';

/**
 * Hits a real database, so it only runs when DATABASE_URL is configured
 * (point it at a disposable Neon branch, never production). Skipped
 * automatically in environments without it, e.g. a fresh clone before
 * `.env` is filled in.
 */
describe.skipIf(!process.env.DATABASE_URL)('POST /contact rate limiting', () => {
  let createApp: typeof import('../app.js').createApp;
  let issueFormToken: typeof import('../lib/formToken.js').issueFormToken;
  let app: import('express').Express;

  beforeAll(async () => {
    ({ createApp } = await import('../app.js'));
    ({ issueFormToken } = await import('../lib/formToken.js'));
    app = createApp();
  });

  /** Issues a token that already satisfies the min-fill-time check, so the
   * test exercises the rate limiter rather than tripping the bot-speed guard. */
  function issueBackdatedToken() {
    const now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now - 5_000);
    const token = issueFormToken();
    vi.setSystemTime(now);
    vi.useRealTimers();
    return token;
  }

  it('rejects after the per-IP hourly threshold is exceeded', async () => {
    const submit = () =>
      request(app)
        .post('/contact')
        .send({
          name: 'Load Test',
          email: 'load@example.com',
          subject: 'Rate limit check',
          body: 'This message is submitted repeatedly to trip the rate limiter.',
          startedAt: issueBackdatedToken(),
        });

    const results = [];
    for (let i = 0; i < 6; i++) {
      // Sequential on purpose — the count query would race under real concurrency.
      results.push(await submit());
    }

    const statuses = results.map((r) => r.status);
    expect(statuses.slice(0, 5).every((s) => s === 201)).toBe(true);
    expect(statuses.at(-1)).toBe(429);
  });
});
