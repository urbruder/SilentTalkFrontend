import { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../firebase-admin';
import { storage } from '../storage';

// Extend the Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        firebaseId: string;
        email: string;
      };
    }
  }
}

// Authentication middleware that verifies the Firebase token
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify the ID token
    const decodedToken = await verifyIdToken(idToken);
    
    // Get user from database using Firebase UID
    const user = await storage.getUserByFirebaseId(decodedToken.uid);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }
    
    // Add the user object to the request
    req.user = {
      id: user.id,
      firebaseId: user.firebaseId,
      email: user.email
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

// Optional authentication middleware - doesn't require auth but populates req.user if token exists
export async function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    // Verify the ID token
    const decodedToken = await verifyIdToken(idToken);
    
    // Get user from database using Firebase UID
    const user = await storage.getUserByFirebaseId(decodedToken.uid);
    
    if (user) {
      req.user = {
        id: user.id,
        firebaseId: user.firebaseId,
        email: user.email
      };
    }
    
    next();
  } catch (error) {
    // If token verification fails, continue without setting user
    next();
  }
}