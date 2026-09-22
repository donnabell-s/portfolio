'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Container } from '@/components/container';
import { api, ApiError } from '@/lib/api';
import { contactFormSchema } from '@portfolio/shared';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactPage() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    api
      .contactToken()
      .then(({ token }) => setToken(token))
      .catch(() => setToken(null));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setStatus('error');
      setErrorMessage('Form is still loading — please wait a moment and try again.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      subject: String(formData.get('subject') ?? ''),
      body: String(formData.get('body') ?? ''),
      company: String(formData.get('company') ?? ''),
      startedAt: token,
    };

    const parsed = contactFormSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(
        Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? '']),
        ),
      );
      return;
    }
    setFieldErrors({});
    setStatus('submitting');
    setErrorMessage(null);

    try {
      await api.submitContact(parsed.data);
      setStatus('success');
      e.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(
        err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
      );
    }
  }

  return (
    <Container className="py-16">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mb-10 max-w-xl text-foreground/70">
        Have a role, project, or question in mind? Send a message and I'll get back to you.
      </p>

      {status === 'success' ? (
        <p
          role="status"
          className="max-w-md rounded-lg border border-black/10 bg-black/[0.03] p-4 text-foreground/80 dark:border-white/15 dark:bg-white/[0.03]"
        >
          Thanks — your message has been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-5">
          <Field label="Name" name="name" error={fieldErrors.name} autoComplete="name" />
          <Field
            label="Email"
            name="email"
            type="email"
            error={fieldErrors.email}
            autoComplete="email"
          />
          <Field label="Subject" name="subject" error={fieldErrors.subject} />
          <div>
            <label htmlFor="body" className="mb-1.5 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="body"
              name="body"
              rows={5}
              required
              minLength={10}
              className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:border-white/20"
              aria-invalid={Boolean(fieldErrors.body)}
              aria-describedby={fieldErrors.body ? 'body-error' : undefined}
            />
            {fieldErrors.body && (
              <p id="body-error" className="mt-1 text-sm text-red-600 dark:text-red-400">
                {fieldErrors.body}
              </p>
            )}
          </div>

          {/* Honeypot: visually hidden (not display:none, which some bots
              skip filling), out of tab order, and hidden from screen readers.
              A real visitor never interacts with it. */}
          <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          {status === 'error' && errorMessage && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting' || !token}
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </Container>
  );
}

function Field({
  label,
  name,
  type = 'text',
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:border-white/20"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
