// src/auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Keep types loose so it compiles on either supabase-js v1 or v2
type SessionLike = { user: any } | null;

type Ctx = {
  user: any | null;
  session: SessionLike;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<Ctx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SessionLike>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // v2: getSession(). v1: session()
        const auth: any = supabase.auth as any;

        // Try v2 signature
        if (typeof auth.getSession === 'function') {
          const res = await auth.getSession();
          const current = res?.data?.session ?? null;
          if (mounted) setSession(current);
        }
        // Fallback to v1 signature
        else if (typeof auth.session === 'function') {
          const current = auth.session() ?? null;
          if (mounted) setSession(current);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // Subscribe to auth changes (both v1 & v2 expose onAuthStateChange)
    const auth: any = supabase.auth as any;
    const sub = typeof auth.onAuthStateChange === 'function'
      ? auth.onAuthStateChange((_evt: any, newSession: any) => {
          setSession(newSession ?? null);
        })
      : null;

    return () => {
      mounted = false;
      // v2 returns { data: { subscription } }, v1 returns { subscription }
      const s: any = sub;
      if (s?.data?.subscription?.unsubscribe) s.data.subscription.unsubscribe();
      else if (s?.subscription?.unsubscribe) s.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
  // v2 API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth: any = supabase.auth as any;

  let res;
  if (typeof auth.signInWithPassword === 'function') {
    res = await auth.signInWithPassword({ email, password });
  } else {
    res = await auth.signIn({ email, password }); // v1 fallback
  }

  console.log('[AUTH] signIn response:', JSON.stringify(res, null, 2));

  const { data, error } = res || {};
  if (error) throw error;

  // Immediately read session to verify
  if (typeof auth.getSession === 'function') {
    const after = await auth.getSession();
    console.log('[AUTH] getSession after login:', JSON.stringify(after, null, 2));
  } else if (typeof auth.session === 'function') {
    console.log('[AUTH] session() after login:', JSON.stringify(auth.session(), null, 2));
  }
};

  const logout = async () => {
    const auth: any = supabase.auth as any;
    if (typeof auth.signOut === 'function') await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
