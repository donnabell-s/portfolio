import { z } from 'zod';

/** Matches the `projects.status` Postgres enum. */
export const projectStatus = z.enum(['draft', 'published']);
export type ProjectStatus = z.infer<typeof projectStatus>;

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** One screenshot/clip attached to a project. Shared by the admin form and the public gallery. */
export const projectImageSchema = z.object({
  id: z.number().int().optional(),
  path: z
    .string()
    .min(1, 'Image path is required')
    .startsWith('/projects/', 'Path must live under /projects/<slug>/'),
  alt: z.string().min(1, 'Alt text is required for accessibility').max(200),
  caption: z.string().max(300).optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
});
export type ProjectImage = z.infer<typeof projectImageSchema>;

/** Fields the admin form submits when creating/editing a project. */
export const projectInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(slugPattern, 'Use lowercase letters, numbers, and single hyphens only'),
  title: z.string().min(1, 'Title is required').max(120),
  summary: z.string().min(1, 'Summary is required').max(280),
  role: z.string().min(1).max(120),
  description: z.string().min(1, 'Description is required'),
  techStack: z.array(z.string().min(1).max(40)).min(1, 'Add at least one technology'),
  year: z
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear() + 1),
  repoUrl: z.string().url('Must be a valid URL'),
  liveUrl: z.string().url('Must be a valid URL').optional().nullable(),
  coverImage: z.string().min(1, 'Cover image is required'),
  status: projectStatus.default('draft'),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
  images: z.array(projectImageSchema).default([]),
});
export type ProjectInput = z.infer<typeof projectInputSchema>;

/** Full record as returned by the API (adds server-assigned fields). */
export const projectSchema = projectInputSchema.extend({
  id: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Project = z.infer<typeof projectSchema>;

export const projectUpdateSchema = projectInputSchema.partial();
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
