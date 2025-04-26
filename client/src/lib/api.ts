import { apiRequest } from './queryClient';
import type { Conversation, InsertConversation, Message, InsertMessage, CustomGesture, InsertCustomGesture, VoiceSetting, InsertVoiceSetting } from '@shared/schema';

// Conversation API
export async function getConversations(): Promise<Conversation[]> {
  return apiRequest('GET', '/api/conversations');
}

export async function getConversation(id: number): Promise<Conversation> {
  return apiRequest('GET', `/api/conversations/${id}`);
}

export async function createConversation(conversation: Omit<InsertConversation, 'userId'>): Promise<Conversation> {
  return apiRequest('POST', '/api/conversations', conversation);
}

export async function updateConversation(id: number, data: Partial<InsertConversation>): Promise<Conversation> {
  return apiRequest('PATCH', `/api/conversations/${id}`, data);
}

export async function deleteConversation(id: number): Promise<void> {
  return apiRequest('DELETE', `/api/conversations/${id}`);
}

// Message API
export async function getConversationMessages(conversationId: number): Promise<Message[]> {
  return apiRequest('GET', `/api/conversations/${conversationId}/messages`);
}

export async function createMessage(conversationId: number, message: Omit<InsertMessage, 'conversationId' | 'userId'>): Promise<Message> {
  return apiRequest('POST', `/api/conversations/${conversationId}/messages`, message);
}

// Custom Gesture API
export async function getCustomGestures(): Promise<CustomGesture[]> {
  return apiRequest('GET', '/api/custom-gestures');
}

export async function getCustomGesture(id: number): Promise<CustomGesture> {
  return apiRequest('GET', `/api/custom-gestures/${id}`);
}

export async function createCustomGesture(gesture: Omit<InsertCustomGesture, 'userId'>): Promise<CustomGesture> {
  return apiRequest('POST', '/api/custom-gestures', gesture);
}

export async function updateCustomGesture(id: number, data: Partial<InsertCustomGesture>): Promise<CustomGesture> {
  return apiRequest('PATCH', `/api/custom-gestures/${id}`, data);
}

export async function deleteCustomGesture(id: number): Promise<void> {
  return apiRequest('DELETE', `/api/custom-gestures/${id}`);
}

// Voice Settings API
export async function getVoiceSettings(): Promise<VoiceSetting[]> {
  return apiRequest('GET', '/api/user-settings/voice-settings');
}

export async function getVoiceSetting(id: number): Promise<VoiceSetting> {
  return apiRequest('GET', `/api/user-settings/voice-settings/${id}`);
}

export async function createVoiceSetting(setting: Omit<InsertVoiceSetting, 'userId'>): Promise<VoiceSetting> {
  return apiRequest('POST', '/api/user-settings/voice-settings', setting);
}

export async function updateVoiceSetting(id: number, data: Partial<InsertVoiceSetting>): Promise<VoiceSetting> {
  return apiRequest('PATCH', `/api/user-settings/voice-settings/${id}`, data);
}

export async function deleteVoiceSetting(id: number): Promise<void> {
  return apiRequest('DELETE', `/api/user-settings/voice-settings/${id}`);
}

// User Profile API
export async function getUserProfile() {
  return apiRequest('GET', '/api/user-settings/profile');
}

export async function updateUserProfile(data: {
  username?: string;
  displayName?: string; 
  preferredLanguage?: string;
  theme?: string;
}) {
  return apiRequest('PATCH', '/api/user-settings/profile', data);
}