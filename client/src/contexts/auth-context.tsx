import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { User, getCurrentUser, subscribeToAuthChanges } from "@/lib/firebase";

// Define the type for authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

// Provider component for the auth context
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a current user
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Subscribe to auth state changes
    const unsubscribe = subscribeToAuthChanges((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using the auth context
export function useAuth() {
  return useContext(AuthContext);
}