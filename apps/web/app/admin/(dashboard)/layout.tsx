'use client';

import type { ReactNode } from 'react';
import { AdminNav } from '@/components/admin/admin-nav';
import { useAdminGuard } from '@/lib/use-admin-guard';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { me, checking } = useAdminGuard();

  if (checking) {
    return <div className="p-6 text-sm text-foreground/60">Checking session…</div>;
  }
  if (!me) {
    // useAdminGuard already redirected; render nothing while that happens.
    return null;
  }

  return (
    <div className="min-h-screen">
      <AdminNav />
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
