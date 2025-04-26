import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { authMiddleware } from '../middleware/auth';
import { insertCustomGestureSchema } from '@shared/schema';

const router = Router();

// Apply auth middleware to all custom gesture routes
router.use(authMiddleware);

// Create a new custom gesture
router.post('/', async (req: Request, res: Response) => {
  try {
    // Make sure user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate request body
    const validatedData = insertCustomGestureSchema.parse({
      ...req.body,
      userId: req.user.id, // Ensure the gesture is linked to the authenticated user
    });
    
    // Create custom gesture
    const gesture = await storage.createCustomGesture(validatedData);
    
    res.status(201).json(gesture);
  } catch (error) {
    console.error('Error creating custom gesture:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.format() });
    }
    res.status(500).json({ error: 'Server error while creating custom gesture' });
  }
});

// Get all custom gestures for the authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const gestures = await storage.getUserCustomGestures(req.user.id);
    res.json(gestures);
  } catch (error) {
    console.error('Error fetching custom gestures:', error);
    res.status(500).json({ error: 'Server error while fetching custom gestures' });
  }
});

// Get a specific custom gesture by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const gestureId = parseInt(req.params.id);
    if (isNaN(gestureId)) {
      return res.status(400).json({ error: 'Invalid gesture ID' });
    }
    
    const gesture = await storage.getCustomGesture(gestureId);
    
    if (!gesture) {
      return res.status(404).json({ error: 'Custom gesture not found' });
    }
    
    // Verify the user owns this gesture
    if (gesture.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(gesture);
  } catch (error) {
    console.error('Error fetching custom gesture:', error);
    res.status(500).json({ error: 'Server error while fetching custom gesture' });
  }
});

// Update a custom gesture
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const gestureId = parseInt(req.params.id);
    if (isNaN(gestureId)) {
      return res.status(400).json({ error: 'Invalid gesture ID' });
    }
    
    // Verify gesture exists and belongs to user
    const gesture = await storage.getCustomGesture(gestureId);
    if (!gesture) {
      return res.status(404).json({ error: 'Custom gesture not found' });
    }
    
    if (gesture.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Validate update data
    const updateSchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      gestureData: z.any().optional(),
    });
    
    const validatedData = updateSchema.parse(req.body);
    
    // Update gesture
    const updatedGesture = await storage.updateCustomGesture(gestureId, validatedData);
    
    res.json(updatedGesture);
  } catch (error) {
    console.error('Error updating custom gesture:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.format() });
    }
    res.status(500).json({ error: 'Server error while updating custom gesture' });
  }
});

// Delete a custom gesture
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const gestureId = parseInt(req.params.id);
    if (isNaN(gestureId)) {
      return res.status(400).json({ error: 'Invalid gesture ID' });
    }
    
    // Verify gesture exists and belongs to user
    const gesture = await storage.getCustomGesture(gestureId);
    if (!gesture) {
      return res.status(404).json({ error: 'Custom gesture not found' });
    }
    
    if (gesture.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Delete gesture
    await storage.deleteCustomGesture(gestureId);
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting custom gesture:', error);
    res.status(500).json({ error: 'Server error while deleting custom gesture' });
  }
});

export default router;