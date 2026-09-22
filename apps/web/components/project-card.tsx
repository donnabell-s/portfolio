import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@portfolio/shared';
import { TechBadge } from './tech-badge';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-xl border border-black/10 transition-colors hover:border-foreground/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground dark:border-white/15"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/5 dark:bg-white/5">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-semibold">{project.title}</h3>
          <span className="text-xs text-foreground/50">{project.year}</span>
        </div>
        <p className="mb-3 text-sm text-foreground/70">{project.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <TechBadge key={tech}>{tech}</TechBadge>
          ))}
        </div>
      </div>
    </Link>
  );
}
