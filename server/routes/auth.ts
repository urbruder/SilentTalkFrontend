import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { getUserByUid } from '../firebase-admin';
import { insertUserSchema } from '@shared/schema';

const router = Router();

// User sign-up schema
const signUpSchema = z.object({
  firebaseId: z.string(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profilePhotoUrl: z.string().url().optional(),
});

// Register a new user
router.post('/signup', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = signUpSchema.parse(req.body);
    
    // Check if user already exists by firebase ID
    const existingUser = await storage.getUserByFirebaseId(validatedData.firebaseId);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Check if username is taken
    const existingUsername = await storage.getUserByUsername(validatedData.username);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    // Create new user in database
    const newUser = await storage.createUser({
      firebaseId: validatedData.firebaseId,
      username: validatedData.username,
      email: validatedData.email,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      profilePhotoUrl: validatedData.profilePhotoUrl,
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      }
    });
  } catch (error) {
    console.error('Sign-up error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.format() });
    }
    res.status(500).json({ error: 'Server error during sign up' });
  }
});

// User login (verifies Firebase ID token and returns user info)
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { firebaseId } = req.body;
    
    if (!firebaseId) {
      return res.status(400).json({ error: 'Firebase ID is required' });
    }
    
    // Check if user exists in our database
    const user = await storage.getUserByFirebaseId(firebaseId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return user data
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePhotoUrl: user.profilePhotoUrl,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;