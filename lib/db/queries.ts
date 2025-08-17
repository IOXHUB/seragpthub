import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, desc, and, asc, sql, gt, exists } from 'drizzle-orm';
import postgres from 'postgres';

import type { User, Chat, DBMessage, Suggestion } from './schema';
import type { ArtifactKind } from '@/components/artifact';
import type { VisibilityType } from '@/components/visibility-selector';
import { devFallback } from './dev-fallback';
import {
  user,
  chat,
  message,
  vote,
  document,
  suggestion,
  stream,
  messageDeprecated,
  voteDeprecated,
} from './schema';

// Initialize database connection
let db: ReturnType<typeof drizzle> | null = null;
let client: ReturnType<typeof postgres> | null = null;

function getDatabase() {
  if (!process.env.POSTGRES_URL) {
    console.log('🔄 Database: Using in-memory fallback (no POSTGRES_URL)');
    return null;
  }

  if (!db) {
    client = postgres(process.env.POSTGRES_URL, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    db = drizzle(client);
    console.log('✅ Database: Connected to Supabase');
  }

  return db;
}

export async function getUser(email: string): Promise<Array<User>> {
  const database = getDatabase();
  if (!database) {
    return devFallback.getUser(email);
  }

  try {
    const users = await database.select().from(user).where(eq(user.email, email));
    return users;
  } catch (error) {
    console.error('Database error in getUser:', error);
    return devFallback.getUser(email);
  }
}

export async function createUser(email: string, password: string) {
  const database = getDatabase();
  if (!database) {
    return devFallback.createUser(email, password);
  }

  try {
    const [newUser] = await database
      .insert(user)
      .values({ email, password })
      .returning();
    return newUser;
  } catch (error) {
    console.error('Database error in createUser:', error);
    return devFallback.createUser(email, password);
  }
}

export async function createGuestUser() {
  const database = getDatabase();
  if (!database) {
    return devFallback.createGuestUser();
  }

  try {
    const email = `guest-${Date.now()}@example.com`;
    const [newUser] = await database
      .insert(user)
      .values({ email, password: null })
      .returning();
    return [{ id: newUser.id, email: newUser.email }];
  } catch (error) {
    console.error('Database error in createGuestUser:', error);
    return devFallback.createGuestUser();
  }
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  const database = getDatabase();
  if (!database) {
    return devFallback.saveChat({ id, userId, title, visibility });
  }

  try {
    const [newChat] = await database
      .insert(chat)
      .values({ id, userId, title, visibility, createdAt: new Date() })
      .returning();
    return newChat;
  } catch (error) {
    console.error('Database error in saveChat:', error);
    return devFallback.saveChat({ id, userId, title, visibility });
  }
}

export async function deleteChatById({ id }: { id: string }) {
  const database = getDatabase();
  if (!database) {
    return devFallback.deleteChatById({ id });
  }

  try {
    const [deletedChat] = await database
      .delete(chat)
      .where(eq(chat.id, id))
      .returning();
    return deletedChat;
  } catch (error) {
    console.error('Database error in deleteChatById:', error);
    return devFallback.deleteChatById({ id });
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  const database = getDatabase();
  if (!database) {
    return devFallback.getChatsByUserId({ id, limit, startingAfter, endingBefore });
  }

  try {
    let whereConditions = [eq(chat.userId, id)];

    if (startingAfter) {
      whereConditions.push(gt(chat.createdAt, new Date(startingAfter)));
    }

    if (endingBefore) {
      whereConditions.push(lt(chat.createdAt, new Date(endingBefore)));
    }

    const chats = await database
      .select()
      .from(chat)
      .where(and(...whereConditions))
      .orderBy(desc(chat.createdAt))
      .limit(limit + 1);
    const hasMore = chats.length > limit;
    
    return {
      chats: hasMore ? chats.slice(0, -1) : chats,
      hasMore,
    };
  } catch (error) {
    console.error('Database error in getChatsByUserId:', error);
    return devFallback.getChatsByUserId({ id, limit, startingAfter, endingBefore });
  }
}

export async function getChatById({ id }: { id: string }) {
  const database = getDatabase();
  if (!database) {
    return devFallback.getChatById({ id });
  }

  try {
    const [chatResult] = await database
      .select()
      .from(chat)
      .where(eq(chat.id, id));
    return chatResult || null;
  } catch (error) {
    console.error('Database error in getChatById:', error);
    return devFallback.getChatById({ id });
  }
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  const database = getDatabase();
  if (!database) {
    return devFallback.saveMessages({ messages });
  }

  try {
    return await database.insert(message).values(messages).returning();
  } catch (error) {
    console.error('Database error in saveMessages:', error);
    return devFallback.saveMessages({ messages });
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  const database = getDatabase();
  if (!database) {
    return devFallback.getMessagesByChatId({ id });
  }

  try {
    const messages = await database
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
    return messages;
  } catch (error) {
    console.error('Database error in getMessagesByChatId:', error);
    return devFallback.getMessagesByChatId({ id });
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  const database = getDatabase();
  if (!database) {
    return devFallback.voteMessage({ chatId, messageId, type });
  }

  try {
    const isUpvoted = type === 'up';
    return await database
      .insert(vote)
      .values({ chatId, messageId, isUpvoted })
      .onConflictDoUpdate({
        target: [vote.chatId, vote.messageId],
        set: { isUpvoted },
      })
      .returning();
  } catch (error) {
    console.error('Database error in voteMessage:', error);
    return devFallback.voteMessage({ chatId, messageId, type });
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  const database = getDatabase();
  if (!database) {
    return devFallback.getVotesByChatId({ id });
  }

  try {
    return await database
      .select()
      .from(vote)
      .where(eq(vote.chatId, id));
  } catch (error) {
    console.error('Database error in getVotesByChatId:', error);
    return devFallback.getVotesByChatId({ id });
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  const database = getDatabase();
  if (!database) {
    return devFallback.saveDocument({ id, title, kind, content, userId });
  }

  try {
    return await database
      .insert(document)
      .values({ id, title, kind, content, userId, createdAt: new Date() })
      .returning();
  } catch (error) {
    console.error('Database error in saveDocument:', error);
    return devFallback.saveDocument({ id, title, kind, content, userId });
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  const database = getDatabase();
  if (!database) {
    return devFallback.getDocumentsById({ id });
  }

  try {
    return await database
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));
  } catch (error) {
    console.error('Database error in getDocumentsById:', error);
    return devFallback.getDocumentsById({ id });
  }
}

export async function getDocumentById({ id }: { id: string }) {
  const database = getDatabase();
  if (!database) {
    return devFallback.getDocumentById({ id });
  }

  try {
    const [doc] = await database
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt))
      .limit(1);
    return doc || null;
  } catch (error) {
    console.error('Database error in getDocumentById:', error);
    return devFallback.getDocumentById({ id });
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  const database = getDatabase();
  if (!database) {
    return devFallback.deleteDocumentsByIdAfterTimestamp({ id, timestamp });
  }

  try {
    return await database
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)))
      .returning();
  } catch (error) {
    console.error('Database error in deleteDocumentsByIdAfterTimestamp:', error);
    return devFallback.deleteDocumentsByIdAfterTimestamp({ id, timestamp });
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  const database = getDatabase();
  if (!database) {
    return devFallback.saveSuggestions({ suggestions });
  }

  try {
    return await database.insert(suggestion).values(suggestions).returning();
  } catch (error) {
    console.error('Database error in saveSuggestions:', error);
    return devFallback.saveSuggestions({ suggestions });
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  const database = getDatabase();
  if (!database) {
    return devFallback.getSuggestionsByDocumentId({ documentId });
  }

  try {
    return await database
      .select()
      .from(suggestion)
      .where(eq(suggestion.documentId, documentId))
      .orderBy(desc(suggestion.createdAt));
  } catch (error) {
    console.error('Database error in getSuggestionsByDocumentId:', error);
    return devFallback.getSuggestionsByDocumentId({ documentId });
  }
}

export async function getMessageById({ id }: { id: string }) {
  const database = getDatabase();
  if (!database) {
    return devFallback.getMessageById({ id });
  }

  try {
    return await database
      .select()
      .from(message)
      .where(eq(message.id, id));
  } catch (error) {
    console.error('Database error in getMessageById:', error);
    return devFallback.getMessageById({ id });
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  const database = getDatabase();
  if (!database) {
    return devFallback.deleteMessagesByChatIdAfterTimestamp({ chatId, timestamp });
  }

  try {
    return await database
      .delete(message)
      .where(and(eq(message.chatId, chatId), gt(message.createdAt, timestamp)))
      .returning();
  } catch (error) {
    console.error('Database error in deleteMessagesByChatIdAfterTimestamp:', error);
    return devFallback.deleteMessagesByChatIdAfterTimestamp({ chatId, timestamp });
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  const database = getDatabase();
  if (!database) {
    return devFallback.updateChatVisiblityById({ chatId, visibility });
  }

  try {
    return await database
      .update(chat)
      .set({ visibility })
      .where(eq(chat.id, chatId))
      .returning();
  } catch (error) {
    console.error('Database error in updateChatVisiblityById:', error);
    return devFallback.updateChatVisiblityById({ chatId, visibility });
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: { id: string; differenceInHours: number }) {
  const database = getDatabase();
  if (!database) {
    return devFallback.getMessageCountByUserId({ id, differenceInHours });
  }

  try {
    const timeAgo = new Date(Date.now() - differenceInHours * 60 * 60 * 1000);
    const result = await database
      .select({ count: sql<number>`count(*)` })
      .from(message)
      .innerJoin(chat, eq(message.chatId, chat.id))
      .where(and(eq(chat.userId, id), gt(message.createdAt, timeAgo)));
    
    return result[0]?.count || 0;
  } catch (error) {
    console.error('Database error in getMessageCountByUserId:', error);
    return devFallback.getMessageCountByUserId({ id, differenceInHours });
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  const database = getDatabase();
  if (!database) {
    return devFallback.createStreamId({ streamId, chatId });
  }

  try {
    await database
      .insert(stream)
      .values({ id: streamId, chatId, createdAt: new Date() });
  } catch (error) {
    console.error('Database error in createStreamId:', error);
    return devFallback.createStreamId({ streamId, chatId });
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  const database = getDatabase();
  if (!database) {
    return devFallback.getStreamIdsByChatId({ chatId });
  }

  try {
    const streams = await database
      .select({ id: stream.id })
      .from(stream)
      .where(eq(stream.chatId, chatId));
    
    return streams.map(s => s.id);
  } catch (error) {
    console.error('Database error in getStreamIdsByChatId:', error);
    return devFallback.getStreamIdsByChatId({ chatId });
  }
}
