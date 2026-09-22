'use client';

import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/components/admin/project-form';
import { api } from '@/lib/api';

export default function NewProjectPage() {
  const router = useRouter();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">New project</h1>
      <ProjectForm
        submitLabel="Create project"
        onSubmit={async (data) => {
          const created = await api.createProject(data);
          router.push(`/admin/projects/${created.id}`);
        }}
      />
    </div>
  );
}
