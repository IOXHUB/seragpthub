import { cookies, headers } from 'next/headers';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '../(auth)/auth';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{
    guestId?: string;
    guestEmail?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();

  // Try to get guest session from headers (set by middleware)
  let finalSession = session;
  if (!session) {
    const headersList = await headers();
    const guestSessionHeader = headersList.get('x-guest-session');

    if (guestSessionHeader) {
      try {
        const guestSession = JSON.parse(guestSessionHeader);
        finalSession = {
          user: guestSession.user,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        console.log('✅ Using guest session from headers:', finalSession.user);
      } catch (error) {
        console.error('❌ Failed to parse guest session from headers:', error);
      }
    }

    // Fallback to URL parameters
    if (!finalSession && searchParams.guestId && searchParams.guestEmail) {
      finalSession = {
        user: {
          id: searchParams.guestId,
          email: searchParams.guestEmail,
          name: searchParams.guestEmail,
          type: 'guest'
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      console.log('✅ Using guest session from URL params:', finalSession.user);
    }
  }

  if (!finalSession) {
    redirect('/api/auth/guest');
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialVisibilityType="private"
          isReadonly={false}
          session={finalSession}
          autoResume={false}
        />
        <DataStreamHandler />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={modelIdFromCookie.value}
        initialVisibilityType="private"
        isReadonly={false}
        session={finalSession}
        autoResume={false}
      />
      <DataStreamHandler />
    </>
  );
}
