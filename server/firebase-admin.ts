import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK with default credentials (environment variables)
// In production, set GOOGLE_APPLICATION_CREDENTIALS env var to your service account key path
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    // When deployed in Google Cloud, this will use the default credentials
    // Otherwise, service account credentials set in environment variables are used
  });
}

export const auth = admin.auth();
export const firestore = admin.firestore();

// Verify Firebase ID token
export async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  try {
    return await auth.verifyIdToken(idToken);
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw error;
  }
}

// Get user by uid
export async function getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
  try {
    return await auth.getUser(uid);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Create a Firebase user programmatically (for admin purposes)
export async function createFirebaseUser(
  email: string, 
  password: string, 
  displayName: string
): Promise<admin.auth.UserRecord> {
  try {
    return await auth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export default admin;