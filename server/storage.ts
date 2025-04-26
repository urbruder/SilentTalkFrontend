import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  conversations,
  messages,
  customGestures,
  voiceSettings,
  type User,
  type InsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type CustomGesture,
  type InsertCustomGesture,
  type VoiceSetting,
  type InsertVoiceSetting
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User>;

  // Conversation operations
  getConversation(id: number): Promise<Conversation | undefined>;
  getUserConversations(userId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, data: Partial<InsertConversation>): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;

  // Message operations
  getMessage(id: number): Promise<Message | undefined>;
  getConversationMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessage(id: number): Promise<void>;

  // Custom gesture operations
  getCustomGesture(id: number): Promise<CustomGesture | undefined>;
  getUserCustomGestures(userId: number): Promise<CustomGesture[]>;
  createCustomGesture(gesture: InsertCustomGesture): Promise<CustomGesture>;
  updateCustomGesture(id: number, data: Partial<InsertCustomGesture>): Promise<CustomGesture>;
  deleteCustomGesture(id: number): Promise<void>;

  // Voice settings operations
  getVoiceSetting(id: number): Promise<VoiceSetting | undefined>;
  getUserVoiceSettings(userId: number): Promise<VoiceSetting[]>;
  createVoiceSetting(setting: InsertVoiceSetting): Promise<VoiceSetting>;
  updateVoiceSetting(id: number, data: Partial<InsertVoiceSetting>): Promise<VoiceSetting>;
  deleteVoiceSetting(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseId, firebaseId));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Conversation operations
  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return db.select().from(conversations).where(eq(conversations.userId, userId));
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [createdConversation] = await db.insert(conversations).values(conversation).returning();
    return createdConversation;
  }

  async updateConversation(id: number, data: Partial<InsertConversation>): Promise<Conversation> {
    const [updatedConversation] = await db
      .update(conversations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return updatedConversation;
  }

  async deleteConversation(id: number): Promise<void> {
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  // Message operations
  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [createdMessage] = await db.insert(messages).values(message).returning();
    return createdMessage;
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }

  // Custom gesture operations
  async getCustomGesture(id: number): Promise<CustomGesture | undefined> {
    const [gesture] = await db.select().from(customGestures).where(eq(customGestures.id, id));
    return gesture;
  }

  async getUserCustomGestures(userId: number): Promise<CustomGesture[]> {
    return db.select().from(customGestures).where(eq(customGestures.userId, userId));
  }

  async createCustomGesture(gesture: InsertCustomGesture): Promise<CustomGesture> {
    const [createdGesture] = await db.insert(customGestures).values(gesture).returning();
    return createdGesture;
  }

  async updateCustomGesture(id: number, data: Partial<InsertCustomGesture>): Promise<CustomGesture> {
    const [updatedGesture] = await db
      .update(customGestures)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(customGestures.id, id))
      .returning();
    return updatedGesture;
  }

  async deleteCustomGesture(id: number): Promise<void> {
    await db.delete(customGestures).where(eq(customGestures.id, id));
  }

  // Voice settings operations
  async getVoiceSetting(id: number): Promise<VoiceSetting | undefined> {
    const [setting] = await db.select().from(voiceSettings).where(eq(voiceSettings.id, id));
    return setting;
  }

  async getUserVoiceSettings(userId: number): Promise<VoiceSetting[]> {
    return db.select().from(voiceSettings).where(eq(voiceSettings.userId, userId));
  }

  async createVoiceSetting(setting: InsertVoiceSetting): Promise<VoiceSetting> {
    const [createdSetting] = await db.insert(voiceSettings).values(setting).returning();
    return createdSetting;
  }

  async updateVoiceSetting(id: number, data: Partial<InsertVoiceSetting>): Promise<VoiceSetting> {
    const [updatedSetting] = await db
      .update(voiceSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(voiceSettings.id, id))
      .returning();
    return updatedSetting;
  }

  async deleteVoiceSetting(id: number): Promise<void> {
    await db.delete(voiceSettings).where(eq(voiceSettings.id, id));
  }
}

export const storage = new DatabaseStorage();
