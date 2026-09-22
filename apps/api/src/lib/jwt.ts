import jwt from 'jsonwebtoken';

export interface SessionPayload {
  sub: number;
  email: string;
}

const SESSION_COOKIE = 'portfolio_session';
const TOKEN_TTL = '7d';
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_TTL });
}

export function verifySession(token: string): SessionPayload {
  const decoded = jwt.verify(token, getSecret());
  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    typeof (decoded as Record<string, unknown>).sub !== 'number' ||
    typeof (decoded as Record<string, unknown>).email !== 'string'
  ) {
    throw new Error('Malformed session token payload');
  }
  return decoded as unknown as SessionPayload;
}

export const sessionCookie = {
  name: SESSION_COOKIE,
  maxAgeMs: TOKEN_TTL_MS,
} as const;
