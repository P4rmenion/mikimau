'use client';

import { refreshAccess } from '@actions/auth';
import { isJWTExpired } from '@lib/utils';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provides authentication context to its children components.
 * Initializes and manages the access token state, loading it from localStorage on startup.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components that will have access to the AuthContext.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // Load token from localStorage when the app starts.
  useEffect(() => {
    const storedToken = localStorage.getItem('access');

    if (storedToken) {
      setAccessToken(storedToken);
      const { is_admin }: { is_admin: boolean } = jwtDecode(storedToken);
      setIsAdmin(is_admin);
    } else {
      setAccessToken(null);
    }
  }, []);

  // Update localStorage in case the token changes.
  useEffect(() => {
    if (accessToken) localStorage.setItem('access', accessToken);
    else localStorage.removeItem('access');
  }, [accessToken]);

  // Refresh token if it's expired
  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const newToken = await refreshAccess();
        setAccessToken(newToken);
        localStorage.setItem('access', newToken);
      } catch (error) {
        console.error('Failed to refresh token:', error);
        router.push('/login');
      }
    };

    setInterval(() => {
      if (accessToken && isJWTExpired(accessToken)) fetchAccessToken();
    }, 10000);
  }, [accessToken, router]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
}
