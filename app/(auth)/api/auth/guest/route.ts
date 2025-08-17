import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Guests are no longer allowed - redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}
