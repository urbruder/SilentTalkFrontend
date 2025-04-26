import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { authMiddleware } from '../middleware/auth';
import { insertVoiceSettingSchema } from '@shared/schema';

const router = Router();

// Apply auth middleware to all settings routes
router.use(authMiddleware);

// Get user profile and preferences
router.get('/profile', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await storage.getUser(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePhotoUrl: user.profilePhotoUrl,
      preferences: user.preferences,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error while fetching user profile' });
  }
});

// Update user profile
router.patch('/profile', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate update data
    const updateSchema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      profilePhotoUrl: z.string().url().optional(),
      preferences: z.record(z.any()).optional(),
    });
    
    const validatedData = updateSchema.parse(req.body);
    
    // Update user
    const updatedUser = await storage.updateUser(req.user.id, validatedData);
    
    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      profilePhotoUrl: updatedUser.profilePhotoUrl,
      preferences: updatedUser.preferences,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.format() });
    }
    res.status(500).json({ error: 'Server error while updating user profile' });
  }
});

// Voice settings routes
// Create a voice setting
router.post('/voice-settings', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Validate request body
    const validatedData = insertVoiceSettingSchema.parse({
      ...req.body,
      userId: req.user.id,
    });
    
    // Create voice setting
    const voiceSetting = await storage.createVoiceSetting(validatedData);
    
    res.status(201).json(voiceSetting);
  } catch (error) {
    console.error('Error creating voice setting:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.format() });
    }
    res.status(500).json({ error: 'Server error while creating voice setting' });
  }
});

// Get all voice settings for the user
router.get('/voice-settings', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const voiceSettings = await storage.getUserVoiceSettings(req.user.id);
    res.json(voiceSettings);
  } catch (error) {
    console.error('Error fetching voice settings:', error);
    res.status(500).json({ error: 'Server error while fetching voice settings' });
  }
});

// Get a specific voice setting
router.get('/voice-settings/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const settingId = parseInt(req.params.id);
    if (isNaN(settingId)) {
      return res.status(400).json({ error: 'Invalid setting ID' });
    }
    
    const voiceSetting = await storage.getVoiceSetting(settingId);
    
    if (!voiceSetting) {
      return res.status(404).json({ error: 'Voice setting not found' });
    }
    
    // Verify the user owns this setting
    if (voiceSetting.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(voiceSetting);
  } catch (error) {
    console.error('Error fetching voice setting:', error);
    res.status(500).json({ error: 'Server error while fetching voice setting' });
  }
});

// Update a voice setting
router.patch('/voice-settings/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const settingId = parseInt(req.params.id);
    if (isNaN(settingId)) {
      return res.status(400).json({ error: 'Invalid setting ID' });
    }
    
    // Verify setting exists and belongs to user
    const voiceSetting = await storage.getVoiceSetting(settingId);
    if (!voiceSetting) {
      return res.status(404).json({ error: 'Voice setting not found' });
    }
    
    if (voiceSetting.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Validate update data
    const updateSchema = z.object({
      name: z.string().optional(),
      voiceType: z.string().optional(),
      language: z.string().optional(),
      rate: z.string().optional(),
      pitch: z.string().optional(),
      style: z.string().optional(),
    });
    
    const validatedData = updateSchema.parse(req.body);
    
    // Update voice setting
    const updatedSetting = await storage.updateVoiceSetting(settingId, validatedData);
    
    res.json(updatedSetting);
  } catch (error) {
    console.error('Error updating voice setting:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.format() });
    }
    res.status(500).json({ error: 'Server error while updating voice setting' });
  }
});

// Delete a voice setting
router.delete('/voice-settings/:id', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const settingId = parseInt(req.params.id);
    if (isNaN(settingId)) {
      return res.status(400).json({ error: 'Invalid setting ID' });
    }
    
    // Verify setting exists and belongs to user
    const voiceSetting = await storage.getVoiceSetting(settingId);
    if (!voiceSetting) {
      return res.status(404).json({ error: 'Voice setting not found' });
    }
    
    if (voiceSetting.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Delete voice setting
    await storage.deleteVoiceSetting(settingId);
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting voice setting:', error);
    res.status(500).json({ error: 'Server error while deleting voice setting' });
  }
});

export default router;