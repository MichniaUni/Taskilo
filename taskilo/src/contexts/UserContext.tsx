
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import axios from 'axios';

// Create a context to hold user information globally
const UserContext = createContext<any>(null);

/**
 * UserProvider - Provides user data to all child components
 * Fetches the currently signed-in Cognito user and retrieves extended profile info via API
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
  // Local state for user info and loading status
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user data on first render
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Get the currently authenticated Cognito user
        const cognitoUser = await getCurrentUser();
         // Fetch extended user data from your API using the user ID
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${cognitoUser.userId}`
        );
        // Store the user data in state
        setUser(response.data);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false); // Whether successful or failed, loading is done
      }
    };
    loadUser();
  }, []);

  return (
    // Provide user and loading state to all consumers of the context
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}
/**
 * useUser - Custom hook to access user context
 */
export const useUser = () => useContext(UserContext);