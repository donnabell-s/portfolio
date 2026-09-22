'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';
import type { Me } from '@portfolio/shared';

/**
 * Client-side defense-in-depth: confirms the session is actually valid
 * (not just "a cookie exists", which is all proxy.ts checks) and redirects
 * to login if not. The real enforcement is the API's requireAuth
 * middleware — this only makes the admin UI behave correctly.
 */
export function useAdminGuard() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .me()
      .then((me) => {
        if (!cancelled) setMe(me);
      })
      .catch(() => {
        if (!cancelled) router.replace('/admin/login');
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  return { me, checking };
}
