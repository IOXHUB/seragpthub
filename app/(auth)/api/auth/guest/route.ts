import { NextResponse } from 'next/server';
import { signIn } from '@/app/(auth)/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get('redirectUrl') || '/';

    console.log('🔄 Guest route called, using NextAuth signIn...');

    // Use NextAuth's built-in signIn with redirect
    // This will properly handle session creation and redirects
    return await signIn('guest', {
      redirectTo: redirectUrl,
      redirect: true
    });

  } catch (error) {
    console.error('❌ Guest route error:', error);
    // Fallback: redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }
}
