// client/src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged,sendEmailVerification, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, getIdToken,updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// ✅ Authentication functions

// Sign in with email & password
export const signInWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};




export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  if (auth.currentUser) {
    if (displayName) {
      await updateProfile(auth.currentUser, { displayName });
    }
    await sendEmailVerification(auth.currentUser); // ✅ send verification
  }

  return result.user;
};

// Google sign-in
const provider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

// Reset password
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

// Sign out
export const logOut = async () => {
  await signOut(auth);
};

// Subscribe to auth changes
export const subscribeToAuthChanges = (callback: (user: any | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get ID token
export const getCurrentUserIdToken = async () => {
  const user = auth.currentUser;
  return user ? await getIdToken(user) : null;
};
