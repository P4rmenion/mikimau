'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { refreshAccess, getAdminStatus, setAccessToken } from '@actions/auth';
import { AuthContextType } from '@lib/definitions';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [access, setAccess] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkAdminStatus() {
      const adminStatus = await getAdminStatus(access);
      setIsAdmin(adminStatus);
    }

    checkAdminStatus();
  }, [access]);

  // Refresh token every 10 minutes
  useEffect(() => {
    async function refreshAuth() {
      setLoading(true);

      try {
        // Refresh the access token only if refresh token exists
        const token = await refreshAccess().catch(() => {
          setAccess(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        });

        const adminStatus = await getAdminStatus(token);

        // Update cookies
        await setAccessToken(token);

        // Update state
        setAccess(token);
        setIsAdmin(adminStatus);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        setAccess(null);
        setIsAdmin(false);
        setLoading(false);
      }
    }

    refreshAuth();
    const interval = setInterval(refreshAuth, 10 * 60 * 1000); // Refresh every 10 min
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ access, setAccess, isAdmin, setIsAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
}
