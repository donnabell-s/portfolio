import type { MetadataRoute } from 'next';
import { getPublishedProjects } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects().catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = ['', '/projects', '/about'].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
    }),
  );

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date(project.updatedAt),
  }));

  return [...staticRoutes, ...projectRoutes];
}
