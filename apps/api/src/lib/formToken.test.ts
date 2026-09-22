import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { issueFormToken, checkFormToken } from './formToken.js';

describe('formToken', () => {
  it('accepts a token after the minimum fill time has elapsed', () => {
    const token = issueFormToken();
    // Simulate the passage of time by rewriting the timestamp portion
    // (issueFormToken signs Date.now(), so we recompute with a shifted clock).
    vi.useFakeTimers();
    const start = Date.now();
    vi.setSystemTime(start - 5_000); // pretend the token was issued 5s ago
    const backdatedToken = issueFormToken();
    vi.setSystemTime(start);
    expect(checkFormToken(backdatedToken)).toEqual({ ok: true });
    vi.useRealTimers();
  });

  it('rejects a token submitted faster than the minimum fill time', () => {
    const token = issueFormToken();
    const result = checkFormToken(token);
    expect(result).toEqual({ ok: false, reason: 'too_fast' });
  });

  it('rejects a malformed token', () => {
    expect(checkFormToken('not-a-real-token')).toEqual({ ok: false, reason: 'invalid' });
    expect(checkFormToken('')).toEqual({ ok: false, reason: 'invalid' });
  });

  it('rejects a token with a tampered signature', () => {
    const [timestamp] = issueFormToken().split('.');
    expect(checkFormToken(`${timestamp}.deadbeef`)).toEqual({ ok: false, reason: 'invalid' });
  });

  it('rejects an expired token', () => {
    vi.useFakeTimers();
    const start = Date.now();
    vi.setSystemTime(start - 61 * 60 * 1000); // 61 minutes ago
    const oldToken = issueFormToken();
    vi.setSystemTime(start);
    expect(checkFormToken(oldToken)).toEqual({ ok: false, reason: 'expired' });
    vi.useRealTimers();
  });
});
