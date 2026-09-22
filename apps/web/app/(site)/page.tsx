import Link from 'next/link';
import { Container } from '@/components/container';
import { ProjectCard } from '@/components/project-card';
import { ProfilePortrait } from '@/components/profile-portrait';
import { GalleryCarousel } from '@/components/gallery-carousel';
import { getGalleryImages, getPublishedProjects } from '@/lib/api';

// ISR: this page is served from the cache and revalidated in the background
// at most once a minute, so a visitor is never waiting on the API — even
// if Neon has gone idle and needs to resume.
export const revalidate = 60;

export default async function HomePage() {
  const [projects, gallery] = await Promise.all([
    getPublishedProjects().catch(() => []),
    getGalleryImages().catch(() => []),
  ]);
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const highlighted = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <>
      <section className="py-8 sm:py-14">
        <Container className="grid items-center gap-8 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-lg text-foreground/70">Hello I&apos;m</p>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              <span className="text-accent">Donna</span> Sembrano
            </h1>
            <p className="mt-2 text-2xl font-bold tracking-tight">FULL-STACK &amp; AI/ML</p>
            <p className="mt-3 max-w-md text-foreground/70">
              Computer Science graduate building full-stack and AI-powered applications, from web
              platforms to machine learning pipelines.
            </p>
            <p className="mt-4 flex items-center gap-2 text-sm text-foreground/70">
              <PinIcon />
              Cebu, Philippines &bull; Available to WFH
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                View Projects
              </Link>
              <a
                href="#contact"
                className="rounded-full border border-black/15 px-6 py-3 text-sm font-medium transition-colors hover:border-foreground/40 dark:border-white/20"
              >
                Get in touch
              </a>
            </div>
          </div>
          <ProfilePortrait priority />
        </Container>
      </section>

      {highlighted.length > 0 && (
        <section className="border-t border-black/10 py-10 sm:py-12 dark:border-white/10">
          <Container>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold tracking-wide uppercase">Featured works</h2>
              <span
                aria-hidden="true"
                className="mx-auto mt-2 block h-[3px] w-14 rounded-full bg-[var(--underline-accent)]"
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlighted.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link
                href="/projects"
                className="text-sm font-medium text-[var(--underline-accent)] hover:opacity-80"
              >
                All projects &rarr;
              </Link>
            </div>
          </Container>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="border-t border-black/10 py-10 sm:py-12 dark:border-white/10">
          <Container>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold tracking-wide uppercase">Gallery</h2>
              <span
                aria-hidden="true"
                className="mx-auto mt-2 block h-[3px] w-14 rounded-full bg-[var(--underline-accent)]"
              />
            </div>
            <GalleryCarousel images={gallery} />
          </Container>
        </section>
      )}
    </>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-6.1 7-11.3A7 7 0 0 0 5 9.7C5 14.9 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
