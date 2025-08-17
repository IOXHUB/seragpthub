import { NextResponse } from 'next/server';
import { createGuestUser } from '@/lib/db/queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let redirectUrl = searchParams.get('redirectUrl') || '/';

    console.log('🔄 Guest route called, creating guest session...');

    // Create guest user
    const [guestUser] = await createGuestUser();
    console.log('✅ Guest user created:', guestUser);

    // Add guest session to URL parameters
    const redirectUrlObj = new URL(redirectUrl);
    redirectUrlObj.searchParams.set('guestId', guestUser.id);
    redirectUrlObj.searchParams.set('guestEmail', guestUser.email);

    console.log('✅ Guest session created, redirecting to:', redirectUrlObj.toString());

    // Create response with redirect
    const response = NextResponse.redirect(redirectUrlObj);

    // Set guest session cookie to prevent future redirects
    const guestSession = {
      user: {
        id: guestUser.id,
        email: guestUser.email,
        name: guestUser.email,
        type: 'guest'
      }
    };

    response.cookies.set('guest-session', JSON.stringify(guestSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('❌ Guest route error:', error);
    // Fallback: redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }
}
