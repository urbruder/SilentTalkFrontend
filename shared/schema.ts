import { pgTable, text, serial, timestamp, jsonb, integer, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table to store user profiles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseId: text("firebase_id").notNull().unique(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profilePhotoUrl: text("profile_photo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  preferences: jsonb("preferences"),
});

// Conversations table to store user conversation history
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(), // "speech-to-text", "text-to-speech", "sign-language"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages table to store individual messages within conversations
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // "user" or "assistant"
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"), // For additional data like audio duration, confidence scores, etc.
});

// Custom gestures table to store user-defined sign language gestures
export const customGestures = pgTable("custom_gestures", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  gestureData: jsonb("gesture_data").notNull(), // Store serialized gesture recognition data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Voice settings table to store user-defined voice settings
export const voiceSettings = pgTable("voice_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  voiceType: text("voice_type").notNull(),
  language: text("language").notNull(),
  rate: text("rate").notNull(),
  pitch: text("pitch").notNull(),
  style: text("style"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversations),
  customGestures: many(customGestures),
  voiceSettings: many(voiceSettings),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const customGesturesRelations = relations(customGestures, ({ one }) => ({
  user: one(users, {
    fields: [customGestures.userId],
    references: [users.id],
  }),
}));

export const voiceSettingsRelations = relations(voiceSettings, ({ one }) => ({
  user: one(users, {
    fields: [voiceSettings.userId],
    references: [users.id],
  }),
}));

// Zod schemas for data validation
export const insertUserSchema = createInsertSchema(users).pick({
  firebaseId: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  profilePhotoUrl: true,
  preferences: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  title: true,
  type: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  content: true,
  sender: true,
  metadata: true,
});

export const insertCustomGestureSchema = createInsertSchema(customGestures).pick({
  userId: true,
  name: true,
  description: true,
  gestureData: true,
});

export const insertVoiceSettingSchema = createInsertSchema(voiceSettings).pick({
  userId: true,
  name: true,
  voiceType: true,
  language: true,
  rate: true,
  pitch: true,
  style: true,
});

// TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertCustomGesture = z.infer<typeof insertCustomGestureSchema>;
export type CustomGesture = typeof customGestures.$inferSelect;

export type InsertVoiceSetting = z.infer<typeof insertVoiceSettingSchema>;
export type VoiceSetting = typeof voiceSettings.$inferSelect;
