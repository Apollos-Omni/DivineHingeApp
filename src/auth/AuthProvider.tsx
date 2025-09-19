// src/auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as Linking from "expo-linking";
import { supabase } from "../lib/supabaseClient";

type AuthCtx = {
  user: any | null;
  session: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Deep link handler to finish PKCE/Magic Link exchange on native
    const handleUrl = async (url: string) => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(url);
        if (error) {
          console.warn("exchangeCodeForSession error:", error.message);
        }
      } catch (e) {
        console.warn("exchangeCodeForSession threw:", e);
      }
    };

    const urlListener = ({ url }: { url: string }) => handleUrl(url);
    const subLink = Linking.addEventListener("url", urlListener);

    // Handle cold start (app opened from a link)
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) await handleUrl(initialUrl);
    })();

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
      // @ts-ignore RN/Expo types differ on remove()
      subLink.remove?.();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const register = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(
    () => ({ user, session, loading, login, register, logout }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
