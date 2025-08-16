import { NextResponse } from 'next/server';
import { createGuestUser } from '@/lib/db/queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get('redirectUrl') || '/';

    console.log('🔄 Guest route called, creating guest session...');

    // Create guest user
    const [guestUser] = await createGuestUser();
    console.log('✅ Guest user created:', guestUser);

    // Create response with redirect
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));

    // Set session cookie manually
    response.cookies.set('guest-session', JSON.stringify({
      user: {
        id: guestUser.id,
        email: guestUser.email,
        name: guestUser.email,
        type: 'guest'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours in seconds
    });

    console.log('✅ Guest session created, redirecting to:', redirectUrl);
    return response;

  } catch (error) {
    console.error('❌ Guest route error:', error);
    // Fallback: redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }
}
