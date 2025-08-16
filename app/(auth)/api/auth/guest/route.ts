import { signIn } from '@/app/(auth)/auth';
import { isDevelopmentEnvironment } from '@/lib/constants';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get('redirectUrl') || '/';

    console.log('🔄 Guest route called, checking existing token...');

    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: !isDevelopmentEnvironment,
    });

    if (token) {
      console.log('✅ Token exists, redirecting to home');
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    console.log('🔄 No token, starting guest sign in...');
    // Use NextAuth's signIn but catch any errors
    const result = await signIn('guest', {
      redirect: false, // Don't auto-redirect to prevent loops
    });

    console.log('✅ Guest sign in completed, redirecting');
    return NextResponse.redirect(new URL(redirectUrl, request.url));

  } catch (error) {
    console.error('�� Guest route error:', error);
    // Fallback: redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }
}
