import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authRoutes from "./routes/auth";
import conversationRoutes from "./routes/conversations";
import customGestureRoutes from "./routes/custom-gestures";
import userSettingsRoutes from "./routes/user-settings";
import { optionalAuthMiddleware } from "./middleware/auth";

// Middleware to handle API errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    status: err.status || 500
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply optional auth middleware to all routes
  app.use(optionalAuthMiddleware);
  
  // Register API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/conversations', conversationRoutes);
  app.use('/api/custom-gesture', customGestureRoutes);
  app.use('/api/user-settings', userSettingsRoutes);
  
  // Basic health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Apply error handling middleware
  app.use(errorHandler);
  
  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
