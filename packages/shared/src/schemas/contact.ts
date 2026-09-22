import { z } from 'zod';

/**
 * Contact form submission.
 *
 * `company` is a honeypot: real visitors never see or fill this field (it's
 * hidden via CSS, not `type="hidden"`, so naive bots that skip hidden inputs
 * still get caught). `startedAt` is a signed timestamp minted when the form
 * mounts; the API rejects submissions faster than a human could plausibly
 * type. Both checks are enforced server-side in apps/api, not here.
 */
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Enter a valid email address').max(200),
  subject: z.string().min(1, 'Subject is required').max(150),
  body: z.string().min(10, 'Message must be at least 10 characters').max(4000),
  // Intentionally permissive (any string, including non-empty) — the API
  // route decides what to do with a filled honeypot, not schema validation.
  // Rejecting it here would 400 and tip a bot off that it was detected.
  company: z.string().max(200).optional().default(''),
  startedAt: z.string().min(1, 'Missing form timing token'),
});
export type ContactForm = z.infer<typeof contactFormSchema>;

export const contactMessageSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string(),
  subject: z.string(),
  body: z.string(),
  isRead: z.boolean(),
  createdAt: z.string(),
});
export type ContactMessage = z.infer<typeof contactMessageSchema>;
