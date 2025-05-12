// taskilo/src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth'; // Changed this import
import axios from 'axios';

const UserContext = createContext<any>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const cognitoUser = await getCurrentUser(); // Changed this line
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${cognitoUser.userId}` // Changed to userId
        );
        setUser(response.data);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);