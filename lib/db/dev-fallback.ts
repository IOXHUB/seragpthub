import type { User } from './schema';
import { generateUUID } from '../utils';

// In-memory store for development when database is not available
const devUsers: Map<string, User> = new Map();
const devChats: Map<string, any> = new Map();

// Add a test chat for development
devChats.set('test-chat-1', {
  id: 'test-chat-1',
  userId: 'test-user-1',
  title: 'Test Chat',
  visibility: 'public',
  createdAt: new Date('2024-01-01')
});

export const devFallback = {
  async getUser(email: string): Promise<Array<User>> {
    const users = Array.from(devUsers.values()).filter(u => u.email === email);
    return users;
  },

  async createUser(email: string, password: string) {
    const id = generateUUID();
    const user: User = {
      id,
      email,
      password: 'fallback-password', // Simple password for fallback
    };
    devUsers.set(id, user);
    return user;
  },

  async createGuestUser() {
    const id = generateUUID();
    const email = `guest-${Date.now()}`;
    const user: User = {
      id,
      email,
      password: 'guest-password', // Simple password for fallback
    };
    devUsers.set(id, user);
    console.log('✅ Created guest user:', { id, email });
    return [{
      id: user.id,
      email: user.email,
    }];
  },

  async saveChat({ id, userId, title, visibility }: any) {
    const chat = {
      id,
      userId,
      title,
      visibility,
      createdAt: new Date(),
    };
    devChats.set(id, chat);
    return chat;
  },

  // Add all missing methods with proper implementations
  async getChatsByUserId({ id, limit }: any) {
    const userChats = Array.from(devChats.values()).filter(chat => chat.userId === id);
    const limitedChats = userChats.slice(0, limit);
    return {
      chats: limitedChats,
      hasMore: userChats.length > limit
    };
  },

  async getChatById({ id }: any) {
    return devChats.get(id) || null;
  },

  async saveMessages({ messages }: any) {
    return messages; // Just return as-is for fallback
  },

  async getMessagesByChatId({ id }: any) {
    return []; // Return empty for now
  },

  async voteMessage({ chatId, messageId, type }: any) {
    return { chatId, messageId, type };
  },

  async getVotesByChatId({ id }: any) {
    return [];
  },

  async saveDocument({ id, title, kind, content, userId }: any) {
    const doc = { id, title, kind, content, userId, createdAt: new Date() };
    return [doc];
  },

  async getDocumentsById({ id }: any) {
    return [];
  },

  async getDocumentById({ id }: any) {
    return null;
  },

  async deleteDocumentsByIdAfterTimestamp({ id, timestamp }: any) {
    return [];
  },

  async saveSuggestions({ suggestions }: any) {
    return suggestions;
  },

  async getSuggestionsByDocumentId({ documentId }: any) {
    return [];
  },

  async getMessageById({ id }: any) {
    return [];
  },

  async deleteMessagesByChatIdAfterTimestamp({ chatId, timestamp }: any) {
    return {};
  },

  async updateChatVisiblityById({ chatId, visibility }: any) {
    const chat = devChats.get(chatId);
    if (chat) {
      chat.visibility = visibility;
    }
    return {};
  },

  async getMessageCountByUserId({ id, differenceInHours }: any) {
    return 0;
  },

  async createStreamId({ streamId, chatId }: any) {
    return;
  },

  async getStreamIdsByChatId({ chatId }: any) {
    return [];
  },

  async deleteChatById({ id }: any) {
    const chat = devChats.get(id);
    if (chat) {
      devChats.delete(id);
    }
    return chat;
  },
};
