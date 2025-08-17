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
    const url = new URL(request.url);
    const guestId = url.searchParams.get('guestId');
    const guestEmail = url.searchParams.get('guestEmail');

    // First check cookies BEFORE URL params to avoid loops
    const guestCookie = request.cookies.get('guest-session');
    if (guestCookie?.value) {
      try {
        guestSession = JSON.parse(guestCookie.value);

        // If we have a valid cookie but also URL params, clean the URL
        if (guestId && guestEmail) {
          const cleanUrl = new URL(url);
          cleanUrl.searchParams.delete('guestId');
          cleanUrl.searchParams.delete('guestEmail');

          const redirectResponse = NextResponse.redirect(cleanUrl);
          redirectResponse.headers.set('x-guest-session', JSON.stringify(guestSession));
          return redirectResponse;
        }
      } catch (error) {
        console.error('❌ Failed to parse guest session cookie:', error);
        // If cookie is corrupted, clear it
        const response = NextResponse.next();
        response.cookies.delete('guest-session');
      }
    }

    // Only check URL params if no valid cookie exists
    if (!guestSession && guestId && guestEmail) {
      guestSession = {
        user: {
          id: guestId,
          email: guestEmail,
          name: guestEmail,
          type: 'guest'
        }
      };

      // Set cookie and redirect to clean URL
      const cleanUrl = new URL(url);
      cleanUrl.searchParams.delete('guestId');
      cleanUrl.searchParams.delete('guestEmail');

      const redirectResponse = NextResponse.redirect(cleanUrl);
      redirectResponse.headers.set('x-guest-session', JSON.stringify(guestSession));
      redirectResponse.cookies.set('guest-session', JSON.stringify(guestSession), {
        httpOnly: true,
        secure: !isDevelopmentEnvironment,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      });

      return redirectResponse;
    }
  }

  if (!token && !guestSession) {
    // Rate limiting: Don't create guests too frequently from same IP
    const clientIp = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const now = Date.now();
    const lastRequest = recentGuests.get(clientIp);

    // Very permissive rate limiting in development, stricter in production
    const isGuestCreationRequest = pathname === '/api/auth/guest' || request.url.includes('/api/auth/guest');
    const rateLimitWindow = isDevelopmentEnvironment ? 1000 : 30000; // 1 second in dev, 30 seconds in prod

    // In development, be extremely permissive to avoid blocking normal usage
    if (!isDevelopmentEnvironment && !isGuestCreationRequest && lastRequest && (now - lastRequest) < rateLimitWindow) {
      return new Response('Rate limited. Please wait and refresh the page.', { status: 429 });
    }

    if (!isGuestCreationRequest) {
      recentGuests.set(clientIp, now);
    }

    // Clean up old entries (older than 1 minute)
    for (const [ip, timestamp] of recentGuests.entries()) {
      if (now - timestamp > 60000) {
        recentGuests.delete(ip);
      }
    }

    const redirectUrl = encodeURIComponent(request.url);

    return NextResponse.redirect(
      new URL(`/api/auth/guest?redirectUrl=${redirectUrl}`, request.url),
    );
  }

  // Add guest session to request headers for server components
  if (guestSession) {
    const response = NextResponse.next();
    response.headers.set('x-guest-session', JSON.stringify(guestSession));
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
