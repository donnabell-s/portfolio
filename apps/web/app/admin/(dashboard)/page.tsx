'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Project, ContactMessage } from '@portfolio/shared';

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);

  useEffect(() => {
    api.adminProjects().then(setProjects).catch(() => setProjects([]));
    api.adminMessages().then(setMessages).catch(() => setMessages([]));
  }, []);

  const published = projects?.filter((p) => p.status === 'published').length ?? 0;
  const drafts = projects?.filter((p) => p.status === 'draft').length ?? 0;
  const unread = messages?.filter((m) => !m.isRead).length ?? 0;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Published projects" value={published} href="/admin/projects" />
        <StatCard label="Draft projects" value={drafts} href="/admin/projects" />
        <StatCard label="Unread messages" value={unread} href="/admin/messages" />
      </div>
    </div>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-black/10 p-5 transition-colors hover:border-foreground/30 dark:border-white/15"
    >
      <p className="text-sm text-foreground/60">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </Link>
  );
}
