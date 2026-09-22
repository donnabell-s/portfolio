'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
];

export function SiteHeader() {
  // Defaults to Home while the router is still resolving the initial
  // pathname (covers both null/undefined and an empty-string result),
  // so Home reads as selected immediately.
  const pathname = usePathname() || '/';

  return (
    <header className="flex justify-center py-6">
      <nav
        aria-label="Primary"
        className="flex items-center gap-1 rounded-full border border-black/10 bg-background p-1.5 shadow-sm dark:border-white/10"
      >
        {NAV_LINKS.map((link) => {
          const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
