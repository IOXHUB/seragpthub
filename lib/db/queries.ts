import 'server-only';

import type { User, Chat, DBMessage, Suggestion } from './schema';
import type { ArtifactKind } from '@/components/artifact';
import type { VisibilityType } from '@/components/visibility-selector';
import { devFallback } from './dev-fallback';

// Using in-memory fallback for all database operations
console.log('🔄 Database: Using in-memory fallback for all operations');

export async function getUser(email: string): Promise<Array<User>> {
  return devFallback.getUser(email);
}

export async function createUser(email: string, password: string) {
  return devFallback.createUser(email, password);
}

export async function createGuestUser() {
  return devFallback.createGuestUser();
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
  return devFallback.saveChat({ id, userId, title, visibility });
}

export async function deleteChatById({ id }: { id: string }) {
  return devFallback.deleteChatById({ id });
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
  return devFallback.getChatsByUserId({ id, limit, startingAfter, endingBefore });
}

export async function getChatById({ id }: { id: string }) {
  return devFallback.getChatById({ id });
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  return devFallback.saveMessages({ messages });
}

export async function getMessagesByChatId({ id }: { id: string }) {
  return devFallback.getMessagesByChatId({ id });
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
  return devFallback.voteMessage({ chatId, messageId, type });
}

export async function getVotesByChatId({ id }: { id: string }) {
  return devFallback.getVotesByChatId({ id });
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
  return devFallback.saveDocument({ id, title, kind, content, userId });
}

export async function getDocumentsById({ id }: { id: string }) {
  return devFallback.getDocumentsById({ id });
}

export async function getDocumentById({ id }: { id: string }) {
  return devFallback.getDocumentById({ id });
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  return devFallback.deleteDocumentsByIdAfterTimestamp({ id, timestamp });
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  return devFallback.saveSuggestions({ suggestions });
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  return devFallback.getSuggestionsByDocumentId({ documentId });
}

export async function getMessageById({ id }: { id: string }) {
  return devFallback.getMessageById({ id });
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  return devFallback.deleteMessagesByChatIdAfterTimestamp({ chatId, timestamp });
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  return devFallback.updateChatVisiblityById({ chatId, visibility });
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: { id: string; differenceInHours: number }) {
  return devFallback.getMessageCountByUserId({ id, differenceInHours });
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  return devFallback.createStreamId({ streamId, chatId });
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  return devFallback.getStreamIdsByChatId({ chatId });
}
