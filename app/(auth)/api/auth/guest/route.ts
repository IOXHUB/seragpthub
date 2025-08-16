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
    return NextResponse.redirect(redirectUrlObj);

  } catch (error) {
    console.error('❌ Guest route error:', error);
    // Fallback: redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }
}
