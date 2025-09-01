import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';
import { login as loginApi, logout as logoutApi, getCurrentUser } from './login';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    async function initAuth() {
      const existingUser = await getCurrentUser();
      setUser(existingUser);
      setLoading(false);
    }
    initAuth();
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    const loggedInUser = await loginApi(email, password);
    setUser(loggedInUser);
    setLoading(false);
  }

  async function logout() {
    setLoading(true);
    await logoutApi();
    setUser(null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
// Placeholder for AuthProvider.tsx
