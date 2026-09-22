'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/components/admin/project-form';
import { api, ApiError } from '@/lib/api';
import type { Project } from '@portfolio/shared';

export default function EditProjectPage(props: PageProps<'/admin/projects/[id]'>) {
  const { id } = use(props.params);
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .adminProject(Number(id))
      .then(setProject)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load'));
  }, [id]);

  if (error) return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  if (!project) return <p className="text-sm text-foreground/60">Loading…</p>;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">Edit project</h1>
      <ProjectForm
        initial={project}
        submitLabel="Save changes"
        onSubmit={async (data) => {
          await api.updateProject(project.id, data);
          router.push('/admin/projects');
        }}
      />
    </div>
  );
}
