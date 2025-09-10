// src/auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type AuthCtx = {
  user: any | null;
  session: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initial session + subscription (Supabase v2; cast to any to avoid TS drift)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await (supabase.auth as any).getSession();
        if (!mounted) return;
        const s = data?.session ?? null;
        setSession(s);
        setUser(s?.user ?? null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = (supabase.auth as any).onAuthStateChange(
      (_evt: any, payload: any) => {
        const s = payload?.session ?? null;
        setSession(s);
        setUser(s?.user ?? null);
      }
    );

    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  const login: AuthCtx['login'] = async (email, password) => {
    const { error } = await (supabase.auth as any).signInWithPassword({ email, password });
    return { error: error?.message };
  };

  const register: AuthCtx['register'] = async (email, password) => {
    const { error } = await (supabase.auth as any).signUp({ email, password });
    return { error: error?.message };
  };

const logout = async () => {
  const auth: any = (supabase as any).auth;
  if (typeof auth.signOut === 'function') {
    await auth.signOut();        // v2
  } else if (typeof auth.signout === 'function') {
    await auth.signout();        // ultra-legacy fallback
  }
};

  const value = useMemo(
    () => ({ user, session, loading, login, register, logout }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
