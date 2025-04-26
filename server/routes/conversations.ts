import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { authMiddleware } from '../middleware/auth';
import { insertConversationSchema, insertMessageSchema } from '@shared/schema';

const router = Router();

// Apply auth middleware to all conversation routes
router.use(authMiddleware);

// Create new conversation
router.post('/', async (req: Request, res: Response) => {
  try {
    // Make sure user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate request body
    const validatedData = insertConversationSchema.parse({
      ...req.body,
      userId: req.user.id, // Ensure the conversation is linked to the authenticated user
    });
    
    // Create conversation
    const conversation = await storage.createConversation(validatedData);
    
    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.format() });
    }
    res.status(500).json({ error: 'Server error while creating conversation' });
  }
});

// Get all conversations for the authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const conversations = await storage.getUserConversations(req.user.id);
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Server error while fetching conversations' });
  }
});

// Get a specific conversation by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const conversationId = parseInt(req.params.id);
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }
    
    const conversation = await storage.getConversation(conversationId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Verify the user owns this conversation
    if (conversation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get messages for this conversation
    const messages = await storage.getConversationMessages(conversationId);
    
    res.json({
      ...conversation,
      messages,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Server error while fetching conversation' });
  }
});

// Update a conversation
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const conversationId = parseInt(req.params.id);
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }
    
    // Verify conversation exists and belongs to user
    const conversation = await storage.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    if (conversation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Validate update data
    const updateSchema = z.object({
      title: z.string().optional(),
    });
    
    const validatedData = updateSchema.parse(req.body);
    
    // Update conversation
    const updatedConversation = await storage.updateConversation(conversationId, validatedData);
    
    res.json(updatedConversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.format() });
    }
    res.status(500).json({ error: 'Server error while updating conversation' });
  }
});

// Delete a conversation
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const conversationId = parseInt(req.params.id);
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }
    
    // Verify conversation exists and belongs to user
    const conversation = await storage.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    if (conversation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Delete conversation
    await storage.deleteConversation(conversationId);
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Server error while deleting conversation' });
  }
});

// Add a message to a conversation
router.post('/:id/messages', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const conversationId = parseInt(req.params.id);
    if (isNaN(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }
    
    // Verify conversation exists and belongs to user
    const conversation = await storage.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    if (conversation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Validate message data
    const messageData = {
      ...req.body,
      conversationId,
    };
    
    const validatedData = insertMessageSchema.parse(messageData);
    
    // Create message
    const message = await storage.createMessage(validatedData);
    
    // Update conversation's updatedAt timestamp
    await storage.updateConversation(conversationId, {});
    
    res.status(201).json(message);
  } catch (error) {
    console.error('Error adding message:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.format() });
    }
    res.status(500).json({ error: 'Server error while adding message' });
  }
});

export default router;