import { auth as nextAuth } from '@/app/(auth)/auth';
import type { Session } from 'next-auth';

/**
 * Auth function that only allows authenticated users
 * Guest sessions are no longer supported
 */
export async function auth(): Promise<Session | null> {
  // Only return NextAuth session - no guest support
  return await nextAuth();
}
