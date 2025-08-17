import { headers } from 'next/headers';
import { auth as nextAuth } from '@/app/(auth)/auth';
import type { Session } from 'next-auth';

/**
 * Unified auth function that handles both NextAuth and guest sessions
 * This function first checks for NextAuth session, then falls back to guest session headers
 */
export async function auth(): Promise<Session | null> {
  // First try to get NextAuth session
  const nextAuthSession = await nextAuth();
  
  if (nextAuthSession) {
    return nextAuthSession;
  }

  // If no NextAuth session, check for guest session headers
  try {
    const headersList = await headers();
    const guestSessionHeader = headersList.get('x-guest-session');
    
    if (guestSessionHeader) {
      const guestSession = JSON.parse(guestSessionHeader);
      console.log('✅ Using guest session from headers:', guestSession.user);
      
      // Convert guest session to NextAuth-compatible format
      return {
        user: guestSession.user,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      };
    }
  } catch (error) {
    console.error('❌ Failed to parse guest session header:', error);
  }

  return null;
}
