import { describe, it, expect } from 'vitest';
import { contactFormSchema } from '@portfolio/shared';
import { issueFormToken } from '../lib/formToken.js';

describe('contactFormSchema', () => {
  const base = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'Hello',
    body: 'This is a long enough message to pass validation.',
    startedAt: issueFormToken(),
  };

  it('accepts a well-formed submission', () => {
    expect(contactFormSchema.safeParse(base).success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = contactFormSchema.safeParse({ ...base, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects a message body that is too short', () => {
    const result = contactFormSchema.safeParse({ ...base, body: 'short' });
    expect(result.success).toBe(false);
  });

  it('passes a filled-in honeypot field through validation', () => {
    // The schema deliberately accepts this — rejecting it here would 400 and
    // tip a bot off. The route layer (not covered by this schema-only test)
    // is what silently drops honeypot-triggered submissions.
    const result = contactFormSchema.safeParse({ ...base, company: 'Acme Corp' });
    expect(result.success).toBe(true);
  });

  it('rejects a missing startedAt token', () => {
    const { startedAt, ...rest } = base;
    const result = contactFormSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});
