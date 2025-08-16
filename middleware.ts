import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { guestRegex, isDevelopmentEnvironment } from './lib/constants';

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
    const redirectUrl = encodeURIComponent(request.url);

    return NextResponse.redirect(
      new URL(`/api/auth/guest?redirectUrl=${redirectUrl}`, request.url),
    );
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
