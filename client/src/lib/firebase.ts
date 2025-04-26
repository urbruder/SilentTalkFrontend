// This is a mock version of Firebase authentication
// It allows us to develop the auth UI without needing real Firebase credentials

// Mock User type to match Firebase's User interface
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  getIdToken: () => Promise<string>;
}

// Mock storage for our "authenticated" user
let currentUser: User | null = null;
let authStateListeners: Array<(user: User | null) => void> = [];

// Notify all listeners of auth state changes
const notifyAuthStateChange = () => {
  authStateListeners.forEach(listener => listener(currentUser));
};

// Create a mock user
const createMockUser = (email: string, displayName?: string): User => {
  return {
    uid: `mock-uid-${Math.random().toString(36).substring(2, 10)}`,
    email: email,
    displayName: displayName || email.split('@')[0],
    photoURL: null,
    emailVerified: true,
    getIdToken: async () => `mock-token-${Math.random().toString(36).substring(2, 10)}`
  };
};

// Sign in with Google (popup)
export const signInWithGoogle = async () => {
  try {
    // Simulate a delay for network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a mock user with a Google-like email
    currentUser = createMockUser('user@gmail.com', 'Google User');
    
    // Notify listeners
    notifyAuthStateChange();
    
    return currentUser;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign in with Google (redirect)
export const signInWithGoogleRedirect = () => {
  // In a real app, this would redirect. Here we'll just simulate the sign in
  setTimeout(() => {
    currentUser = createMockUser('redirect@gmail.com', 'Redirect User');
    notifyAuthStateChange();
  }, 500);
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    // Simulate a delay for network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email already exists (mock validation)
    if (email === 'exists@example.com') {
      throw new Error('auth/email-already-in-use');
    }
    
    // Create a mock user
    currentUser = createMockUser(email, displayName);
    
    // Notify listeners
    notifyAuthStateChange();
    
    return currentUser;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    // Simulate a delay for network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock validation
    if (email !== 'test@example.com' && password !== 'password123') {
      throw new Error('auth/user-not-found');
    }
    
    // Create a mock user
    currentUser = createMockUser(email);
    
    // Notify listeners
    notifyAuthStateChange();
    
    return currentUser;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    // Simulate a delay for network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simply return success, no actual email is sent
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    // Simulate a delay for network request
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Clear current user
    currentUser = null;
    
    // Notify listeners
    notifyAuthStateChange();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Listen for auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  // Add the callback to our listeners
  authStateListeners.push(callback);
  
  // Initial call with current auth state
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    authStateListeners = authStateListeners.filter(listener => listener !== callback);
  };
};

// Get current user
export const getCurrentUser = () => {
  return currentUser;
};

// Get current user's ID token
export const getCurrentUserIdToken = async () => {
  if (!currentUser) {
    return null;
  }
  
  try {
    return await currentUser.getIdToken();
  } catch (error) {
    console.error("Error getting ID token:", error);
    return null;
  }
};

// Mock Firestore for compatibility
export const db = {
  collection: () => ({
    doc: () => ({
      get: async () => ({ exists: true, data: () => ({}) }),
      set: async () => ({}),
    }),
  }),
};

// Mock Auth object for compatibility
export const auth = {
  currentUser,
  onAuthStateChanged: subscribeToAuthChanges,
};

export default {
  auth,
  db,
};