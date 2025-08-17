import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { guestRegex, isDevelopmentEnvironment } from './lib/constants';

// Simple in-memory rate limiting for guest creation (very permissive in dev)
const recentGuests = new Map<string, number>();

// Clear cache periodically to prevent memory leaks
setInterval(() => {
  recentGuests.clear();
}, 60000); // Clear every minute

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith('/ping')) {
    return new Response('pong', { status: 200 });
  }

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Skip middleware for static assets
  if (pathname.startsWith('/_next/') ||
      pathname.includes('.') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });

  // Check for guest session in URL parameters or cookies if no NextAuth token
  let guestSession = null;
  if (!token) {
    // Check cookies first
    const guestCookie = request.cookies.get('guest-session');
    if (guestCookie?.value) {
      try {
        guestSession = JSON.parse(guestCookie.value);
        console.log('✅ Found guest session in cookie:', guestSession.user?.email);
      } catch (error) {
        console.error('❌ Failed to parse guest session cookie:', error);
      }
    }

    // If no cookie, check URL params
    if (!guestSession) {
      const url = new URL(request.url);
      const guestId = url.searchParams.get('guestId');
      const guestEmail = url.searchParams.get('guestEmail');

      if (guestId && guestEmail) {
        guestSession = {
          user: {
            id: guestId,
            email: guestEmail,
            name: guestEmail,
            type: 'guest'
          }
        };
        console.log('✅ Created guest session from URL params:', guestSession.user?.email);
      }
    }
  }

  if (!token && !guestSession) {
    // Only redirect to create guest if we're not already in the auth flow
    if (!pathname.startsWith('/api/auth/')) {
      const redirectUrl = encodeURIComponent(request.url);
      return NextResponse.redirect(
        new URL(`/api/auth/guest?redirectUrl=${redirectUrl}`, request.url),
      );
    }
  }

  // Add guest session to request headers for server components
  if (guestSession) {
    const response = NextResponse.next();
    response.headers.set('x-guest-session', JSON.stringify(guestSession));

    // Set cookie if it doesn't exist (but don't redirect)
    const guestCookie = request.cookies.get('guest-session');
    if (!guestCookie?.value) {
      response.cookies.set('guest-session', JSON.stringify(guestSession), {
        httpOnly: true,
        secure: !isDevelopmentEnvironment,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      });
    }

    return response;
  }

  const isGuest = guestRegex.test(token?.email ?? '') || (guestSession && guestSession.user?.type === 'guest');

  if ((token || guestSession) && !isGuest && ['/login', '/register'].includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/chat/:id',
    '/api/:path*',
    '/login',
    '/register',

    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
