// src/auth/login.ts
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

/**
 * Sign in with email/password via
getSession(): { data: any; error: any; }|PromiseLike<{ data: any; error: any; }> {
throw new Error('Method not implemented.');
}
[x: string]: any;
signOut: any;
signOut(): { error: any; }|PromiseLike<{ error: any; }> {
throw new Error('Method not implemented.');
}
[x: string]: any; Supabase.
 * NOTE: Do not navigate here; let your RootNavigator react to auth state.
 */
export async function login(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/** Sign out current user. */
export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Get the currently authenticated user (or null). */
export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn("getCurrentUser error:", error.message);
  }
  return data?.session?.user ?? null;
}
