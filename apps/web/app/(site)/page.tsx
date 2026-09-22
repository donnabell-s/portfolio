import Link from 'next/link';
import { Container } from '@/components/container';
import { ProjectCard } from '@/components/project-card';
import { getPublishedProjects } from '@/lib/api';

// ISR: this page is served from the cache and revalidated in the background
// at most once a minute, so a visitor is never waiting on the API — even
// if Neon has gone idle and needs to resume.
export const revalidate = 60;

const SKILLS = [
  'TypeScript',
  'Node.js',
  'Next.js',
  'React',
  'PostgreSQL',
  'Express',
  'PHP',
  'Python / Django',
  'C# / .NET',
];

export default async function HomePage() {
  const projects = await getPublishedProjects().catch(() => []);
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const highlighted = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <>
      <section className="border-b border-black/10 py-20 dark:border-white/10">
        <Container>
          <p className="mb-3 text-sm font-medium text-foreground/60">Full-stack developer</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            I build things end to end — backend, frontend, and everything holding them together.
          </h1>
          <p className="mt-5 max-w-xl text-foreground/70">
            This site is itself a project: a Node.js/Express API, a Next.js frontend, and an
            authenticated CMS behind it, deployed for free. Other projects below are presented as
            case studies with screenshots and linked source code.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/projects"
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              View projects
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40 dark:border-white/20"
            >
              Get in touch
            </Link>
          </div>
        </Container>
      </section>

      {highlighted.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-xl font-semibold">Featured work</h2>
              <Link href="/projects" className="text-sm text-foreground/60 hover:text-foreground">
                All projects &rarr;
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlighted.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-black/10 py-16 dark:border-white/10">
        <Container>
          <h2 className="mb-6 text-xl font-semibold">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-black/10 px-3 py-1.5 text-sm text-foreground/80 dark:border-white/15"
              >
                {skill}
              </span>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
