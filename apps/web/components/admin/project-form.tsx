'use client';

import { useState, type FormEvent } from 'react';
import { projectInputSchema, type Project, type ProjectImage } from '@portfolio/shared';

type FormState = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  problem: string;
  approach: string;
  outcome: string;
  techStackText: string;
  year: string;
  repoUrl: string;
  liveUrl: string;
  coverImage: string;
  status: 'draft' | 'published';
  featured: boolean;
  sortOrder: string;
  images: ProjectImage[];
};

function toFormState(project?: Project): FormState {
  return {
    slug: project?.slug ?? '',
    title: project?.title ?? '',
    summary: project?.summary ?? '',
    role: project?.role ?? '',
    problem: project?.problem ?? '',
    approach: project?.approach ?? '',
    outcome: project?.outcome ?? '',
    techStackText: project?.techStack.join(', ') ?? '',
    year: String(project?.year ?? new Date().getFullYear()),
    repoUrl: project?.repoUrl ?? '',
    liveUrl: project?.liveUrl ?? '',
    coverImage: project?.coverImage ?? '',
    status: project?.status ?? 'draft',
    featured: project?.featured ?? false,
    sortOrder: String(project?.sortOrder ?? 0),
    images: project?.images ?? [],
  };
}

export function ProjectForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Project;
  onSubmit: (data: ReturnType<typeof projectInputSchema.parse>) => Promise<void>;
  submitLabel: string;
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addImage() {
    set('images', [...form.images, { path: '', alt: '', caption: '', sortOrder: form.images.length }]);
  }

  function updateImage(index: number, patch: Partial<ProjectImage>) {
    set(
      'images',
      form.images.map((img, i) => (i === index ? { ...img, ...patch } : img)),
    );
  }

  function removeImage(index: number) {
    set(
      'images',
      form.images.filter((_, i) => i !== index),
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const candidate = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      summary: form.summary.trim(),
      role: form.role.trim(),
      problem: form.problem.trim(),
      approach: form.approach.trim(),
      outcome: form.outcome.trim(),
      techStack: form.techStackText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      year: Number(form.year),
      repoUrl: form.repoUrl.trim(),
      liveUrl: form.liveUrl.trim() || null,
      coverImage: form.coverImage.trim(),
      status: form.status,
      featured: form.featured,
      sortOrder: Number(form.sortOrder) || 0,
      images: form.images.map((img, i) => ({ ...img, sortOrder: i })),
    };

    const parsed = projectInputSchema.safeParse(candidate);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? '']),
        ),
      );
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await onSubmit(parsed.data);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Slug" value={form.slug} onChange={(v) => set('slug', v)} error={errors.slug} />
        <TextField label="Title" value={form.title} onChange={(v) => set('title', v)} error={errors.title} />
      </div>

      <TextArea
        label="Summary"
        value={form.summary}
        onChange={(v) => set('summary', v)}
        error={errors.summary}
        rows={2}
      />
      <TextField label="Role" value={form.role} onChange={(v) => set('role', v)} error={errors.role} />

      <TextArea label="Problem" value={form.problem} onChange={(v) => set('problem', v)} error={errors.problem} />
      <TextArea label="Approach" value={form.approach} onChange={(v) => set('approach', v)} error={errors.approach} />
      <TextArea label="Outcome" value={form.outcome} onChange={(v) => set('outcome', v)} error={errors.outcome} />

      <TextField
        label="Tech stack (comma-separated)"
        value={form.techStackText}
        onChange={(v) => set('techStackText', v)}
        error={errors.techStack}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <TextField label="Year" value={form.year} onChange={(v) => set('year', v)} error={errors.year} type="number" />
        <TextField label="Repo URL" value={form.repoUrl} onChange={(v) => set('repoUrl', v)} error={errors.repoUrl} />
        <TextField label="Live URL (optional)" value={form.liveUrl} onChange={(v) => set('liveUrl', v)} error={errors.liveUrl} />
      </div>

      <TextField
        label="Cover image path (e.g. /projects/my-slug/cover.png)"
        value={form.coverImage}
        onChange={(v) => set('coverImage', v)}
        error={errors.coverImage}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => set('status', e.target.value as 'draft' | 'published')}
            className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <TextField label="Sort order" value={form.sortOrder} onChange={(v) => set('sortOrder', v)} type="number" />
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="h-4 w-4 rounded border-black/20 dark:border-white/30"
            />
            Featured
          </label>
        </div>
      </div>

      <fieldset className="space-y-4">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-semibold">Gallery images</legend>
          <button
            type="button"
            onClick={addImage}
            className="text-sm text-foreground/70 hover:text-foreground"
          >
            + Add image
          </button>
        </div>
        {form.images.map((image, index) => (
          <div key={index} className="grid gap-3 rounded-lg border border-black/10 p-4 sm:grid-cols-2 dark:border-white/15">
            <TextField
              label="Path"
              value={image.path}
              onChange={(v) => updateImage(index, { path: v })}
            />
            <TextField
              label="Alt text"
              value={image.alt}
              onChange={(v) => updateImage(index, { alt: v })}
            />
            <div className="sm:col-span-2">
              <TextField
                label="Caption (optional)"
                value={image.caption ?? ''}
                onChange={(v) => updateImage(index, { caption: v })}
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="text-left text-sm text-red-600 hover:text-red-700 dark:text-red-400"
            >
              Remove
            </button>
          </div>
        ))}
      </fieldset>

      {formError && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}

function TextField({
  label,
  value,
  onChange,
  error,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:border-white/20"
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  error,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:border-white/20"
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
