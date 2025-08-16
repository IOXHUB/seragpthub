import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { guestRegex, isDevelopmentEnvironment } from './lib/constants';

// Simple in-memory rate limiting for guest creation
const recentGuests = new Map<string, number>();

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

  // Check for guest session in URL parameters if no NextAuth token
  let guestSession = null;
  if (!token) {
    const url = new URL(request.url);
    const guestId = url.searchParams.get('guestId');
    const guestEmail = url.searchParams.get('guestEmail');

    console.log('🔍 Middleware - Guest params:', { guestId: !!guestId, guestEmail: !!guestEmail });

    if (guestId && guestEmail) {
      guestSession = {
        user: {
          id: guestId,
          email: guestEmail,
          name: guestEmail,
          type: 'guest'
        }
      };
      console.log('✅ Middleware - Guest session from URL params');
    }
  }

  if (!token && !guestSession) {
    // Rate limiting: Don't create guests too frequently from same IP
    const clientIp = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown';
    const now = Date.now();
    const lastRequest = recentGuests.get(clientIp);

    // Allow max 1 guest creation per 2 seconds per IP in development, but only for actual guest creation requests
    // Don't rate limit if this is already a redirect to guest creation
    const isGuestCreationRequest = pathname === '/api/auth/guest' || request.url.includes('/api/auth/guest');
    const rateLimitWindow = isDevelopmentEnvironment ? 1000 : 5000; // 1 second in dev, 5 seconds in prod

    // In development, be much more permissive with rate limiting
    if (!isDevelopmentEnvironment && !isGuestCreationRequest && lastRequest && (now - lastRequest) < rateLimitWindow) {
      console.log('🚫 Rate limited guest creation for IP:', clientIp);
      // Return a simple response instead of redirecting to avoid loops
      return new Response('Rate limited. Please wait a few seconds and try again.', { status: 429 });
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
