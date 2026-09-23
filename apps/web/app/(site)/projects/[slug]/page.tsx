import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AspectFitImage } from '@/components/aspect-fit-image';
import { Container } from '@/components/container';
import { TechBadge } from '@/components/tech-badge';
import { ApiError, getProjectBySlug } from '@/lib/api';

export const revalidate = 60;

async function loadProject(slug: string) {
  try {
    return await getProjectBySlug(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: PageProps<'/projects/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [project.coverImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps<'/projects/[slug]'>) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) notFound();

  return (
    <article className="py-16">
      <Container>
        <Link
          href="/projects"
          className="text-sm font-medium text-[var(--underline-accent)] hover:opacity-80"
        >
          &larr; All projects
        </Link>

        <header className="mt-6 mb-10">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-sm text-foreground/60">
            <span>{project.year}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{project.role}</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-foreground/70">{project.summary}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <TechBadge key={tech}>{tech}</TechBadge>
            ))}
          </div>

          <div className="mt-6 flex gap-4 text-sm font-medium">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-foreground px-4 py-2 text-background transition-opacity hover:opacity-90"
            >
              View source &rarr;
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/15 px-4 py-2 transition-colors hover:border-foreground/40 dark:border-white/20"
              >
                Live demo &rarr;
              </a>
            )}
          </div>
        </header>

        <AspectFitImage
          src={project.coverImage}
          alt={project.title}
          sizes="(min-width: 1024px) 720px, 100vw"
          priority
          defaultRatio={16 / 10}
          className="mx-auto mb-12 max-w-3xl overflow-hidden rounded-xl"
        />

        <div className="columns-1 gap-10 text-foreground/80 sm:columns-2">
          {project.description.split(/\n{2,}/).map((paragraph, i) => (
            <p key={i} className="mb-4 whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        {project.images.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-semibold">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.images.map((image) => (
                <figure
                  key={image.id}
                  className="overflow-hidden rounded-xl border border-black/10 dark:border-white/15"
                >
                  <AspectFitImage
                    src={image.path}
                    alt={image.alt}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    defaultRatio={16 / 9}
                  />
                  {image.caption && (
                    <figcaption className="p-3 text-sm text-foreground/60">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}
