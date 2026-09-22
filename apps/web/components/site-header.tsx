'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
];

export function SiteHeader() {
  const routerPathname = usePathname();
  // Statically cached/regenerated HTML can serve this before the client
  // router has resolved a pathname, so Home is the default until mount —
  // it then switches to the router's live value, which is always correct
  // in the browser.
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional isMounted flag to bridge SSR/hydration
  useEffect(() => setMounted(true), []);
  const pathname = mounted ? routerPathname || '/' : '/';

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
