import type { User } from './schema';
import { generateUUID } from '../utils';
import { generateHashedPassword } from './utils';

// In-memory store for development when database is not available
const devUsers: Map<string, User> = new Map();
const devChats: Map<string, any> = new Map();

export const devFallback = {
  async getUser(email: string): Promise<Array<User>> {
    const users = Array.from(devUsers.values()).filter(u => u.email === email);
    return users;
  },

  async createUser(email: string, password: string) {
    const id = generateUUID();
    const hashedPassword = generateHashedPassword(password);
    const user: User = {
      id,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };
    devUsers.set(id, user);
    return user;
  },

  async createGuestUser() {
    const id = generateUUID();
    const email = `guest-${Date.now()}`;
    const password = generateHashedPassword(generateUUID());
    const user: User = {
      id,
      email,
      password,
      createdAt: new Date(),
    };
    devUsers.set(id, user);
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

  // Add other methods as needed
  async getChatsByUserId() {
    return { chats: [], hasMore: false };
  },

  async getChatById() {
    return null;
  },

  async saveMessages() {
    return [];
  },

  async getMessagesByChatId() {
    return [];
  },

  async voteMessage() {
    return {};
  },

  async getVotesByChatId() {
    return [];
  },

  async saveDocument() {
    return [{}];
  },

  async getDocumentsById() {
    return [];
  },

  async getDocumentById() {
    return null;
  },

  async deleteDocumentsByIdAfterTimestamp() {
    return [];
  },

  async saveSuggestions() {
    return [];
  },

  async getSuggestionsByDocumentId() {
    return [];
  },

  async getMessageById() {
    return [];
  },

  async deleteMessagesByChatIdAfterTimestamp() {
    return {};
  },

  async updateChatVisiblityById() {
    return {};
  },

  async getMessageCountByUserId() {
    return 0;
  },

  async createStreamId() {
    return;
  },

  async getStreamIdsByChatId() {
    return [];
  },

  async deleteChatById() {
    const chat = devChats.get(arguments[0].id);
    if (chat) {
      devChats.delete(arguments[0].id);
    }
    return chat;
  },
};
