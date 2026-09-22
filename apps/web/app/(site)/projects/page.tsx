import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { ProjectCard } from '@/components/project-card';
import { getPublishedProjects } from '@/lib/api';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Case studies and project write-ups.',
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects().catch(() => []);

  return (
    <Container className="py-16">
      <h1 className="mb-10 text-3xl font-bold tracking-tight">Projects</h1>

      {projects.length === 0 ? (
        <p className="text-foreground/60">No published projects yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </Container>
  );
}
