'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/messages', label: 'Messages' },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await api.logout().catch(() => {});
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <nav className="flex items-center justify-between border-b border-black/10 px-6 py-4 dark:border-white/10">
      <div className="flex items-center gap-6">
        <span className="text-sm font-semibold">Admin</span>
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm ${active ? 'font-medium text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm text-foreground/60 hover:text-foreground">
          View site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-foreground/60 hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
