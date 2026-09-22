import { z } from 'zod';

/**
 * One image in the homepage Gallery section. Admin-managed, no upload
 * endpoint — the path points at a file already committed under
 * apps/web/public/gallery/<file>, same convention as project images.
 */
export const galleryImageSchema = z.object({
  id: z.number().int(),
  path: z
    .string()
    .min(1, 'Image path is required')
    .startsWith('/gallery/', 'Path must live under /gallery/'),
  title: z.string().max(150).optional().default(''),
  sortOrder: z.number().int().min(0).default(0),
  createdAt: z.string(),
});
export type GalleryImage = z.infer<typeof galleryImageSchema>;

export const galleryImageInputSchema = galleryImageSchema.omit({ id: true, createdAt: true });
export type GalleryImageInput = z.infer<typeof galleryImageInputSchema>;
