import type { Project, ContactMessage, Me } from '@portfolio/shared';

/**
 * Base URL for server-side fetches (Server Components, Route Handlers).
 * These talk to the API directly — no cookie is involved, so there's no
 * same-origin requirement. The browser, by contrast, always uses relative
 * `/api/*` paths so the rewrite in next.config.ts can keep the session
 * cookie first-party. See next.config.ts for why that matters.
 */
const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, body?.error ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

/** Server-side fetch — Server Components and generateStaticParams/metadata. */
export async function serverFetch<T>(
  path: string,
  init?: RequestInit & { revalidate?: number | false },
): Promise<T> {
  const { revalidate, ...rest } = init ?? {};
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    next: revalidate === undefined ? { revalidate: 60 } : { revalidate },
  });
  return parseOrThrow<T>(res);
}

/** Client-side fetch — goes through the Next.js rewrite so the session cookie stays first-party. */
export async function clientFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  return parseOrThrow<T>(res);
}

// ---------- Public reads (server-side, cached via ISR) ----------

export function getPublishedProjects() {
  return serverFetch<Project[]>('/projects');
}

export function getProjectBySlug(slug: string) {
  return serverFetch<Project>(`/projects/${slug}`, { revalidate: 60 });
}

// ---------- Client-side (admin + contact) ----------

export const api = {
  login: (email: string, password: string) =>
    clientFetch<Me>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => clientFetch<void>('/auth/logout', { method: 'POST' }),
  me: () => clientFetch<Me>('/auth/me'),

  adminProjects: () => clientFetch<Project[]>('/admin/projects'),
  adminProject: (id: number) => clientFetch<Project>(`/admin/projects/${id}`),
  createProject: (data: unknown) =>
    clientFetch<Project>('/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: number, data: unknown) =>
    clientFetch<Project>(`/admin/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id: number) => clientFetch<void>(`/admin/projects/${id}`, { method: 'DELETE' }),

  contactToken: () => clientFetch<{ token: string }>('/contact/token'),
  submitContact: (data: unknown) =>
    clientFetch<{ ok: true }>('/contact', { method: 'POST', body: JSON.stringify(data) }),

  adminMessages: () => clientFetch<ContactMessage[]>('/admin/messages'),
  markMessageRead: (id: number, isRead: boolean) =>
    clientFetch<ContactMessage>(`/admin/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead }),
    }),
};
