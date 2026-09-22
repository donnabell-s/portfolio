'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import type { Project } from '@portfolio/shared';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    api
      .adminProjects()
      .then(setProjects)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load'));
  }

  useEffect(reload, []);

  async function handleDelete(project: Project) {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    try {
      await api.deleteProject(project.id);
      setProjects((prev) => prev?.filter((p) => p.id !== project.id) ?? null);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Delete failed');
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          New project
        </Link>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {!projects ? (
        <p className="text-sm text-foreground/60">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="text-sm text-foreground/60">No projects yet.</p>
      ) : (
        <ul className="divide-y divide-black/10 rounded-xl border border-black/10 dark:divide-white/10 dark:border-white/15">
          {projects.map((project) => (
            <li key={project.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{project.title}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      project.status === 'published'
                        ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                        : 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="truncate text-sm text-foreground/60">/{project.slug}</p>
              </div>
              <div className="flex shrink-0 gap-3 text-sm">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="text-foreground/70 hover:text-foreground"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(project)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
