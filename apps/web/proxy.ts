import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Cheap first gate for the admin UI: redirects to /admin/login if the
 * session cookie is simply absent, so an unauthenticated visitor doesn't
 * see the admin shell flash before a client-side redirect.
 *
 * This is NOT the real authorization boundary — it only checks that a
 * cookie exists, not that it's a valid, unexpired JWT. The API's
 * requireAuth middleware (apps/api/src/middleware/auth.ts) verifies the
 * token on every request and is what actually protects the data, since
 * the API is reachable directly and bypasses this proxy entirely.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has('portfolio_session');
  if (!hasSession) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
