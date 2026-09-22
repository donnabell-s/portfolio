import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Minimum time a human plausibly needs to fill the contact form. A bot that
 * fetches the token and immediately POSTs gets rejected.
 */
const MIN_FILL_TIME_MS = 3_000;
/** Tokens older than this are rejected too, so a stolen token can't be replayed indefinitely. */
const MAX_TOKEN_AGE_MS = 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
}

/** Issues an opaque `<timestamp>.<hmac>` token the contact form must echo back as `startedAt`. */
export function issueFormToken(): string {
  const timestamp = Date.now().toString();
  const sig = createHmac('sha256', getSecret()).update(timestamp).digest('hex');
  return `${timestamp}.${sig}`;
}

export type FormTokenResult = { ok: true } | { ok: false; reason: 'invalid' | 'too_fast' | 'expired' };

/** Verifies the token's signature and that enough (but not too much) time has passed. */
export function checkFormToken(token: string): FormTokenResult {
  const [timestampStr, sig] = token.split('.');
  if (!timestampStr || !sig) return { ok: false, reason: 'invalid' };

  const expectedSig = createHmac('sha256', getSecret()).update(timestampStr).digest('hex');
  const expected = Buffer.from(expectedSig, 'hex');
  const actual = Buffer.from(sig, 'hex');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return { ok: false, reason: 'invalid' };
  }

  const timestamp = Number(timestampStr);
  const elapsed = Date.now() - timestamp;
  if (elapsed < MIN_FILL_TIME_MS) return { ok: false, reason: 'too_fast' };
  if (elapsed > MAX_TOKEN_AGE_MS) return { ok: false, reason: 'expired' };
  return { ok: true };
}
