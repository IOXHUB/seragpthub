import { NextResponse } from 'next/server';
import { signIn } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get('redirectUrl') || '/';

    console.log('🔄 Guest route called, using NextAuth signIn...');

    // Use NextAuth's built-in signIn with redirect
    await signIn('guest', {
      redirectTo: redirectUrl,
      redirect: true
    });

    // This line should never be reached due to redirect
    return NextResponse.redirect(new URL(redirectUrl, request.url));

  } catch (error) {
    // Check if it's a NEXT_REDIRECT error (expected behavior)
    if (error && typeof error === 'object' && 'digest' in error &&
        typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
      // Re-throw NEXT_REDIRECT errors as they are handled by Next.js
      throw error;
    }

    console.error('❌ Guest route error:', error);
    // Fallback: redirect to home for other errors
    return NextResponse.redirect(new URL('/', request.url));
  }
}
