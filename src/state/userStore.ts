// src/state/userStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type {
  AuthSession,
  User as AuthUser,
  AuthStatus,
  LoginCredentials,
  RegisterInput,
} from '../types/auth.d';
import { loginUserAPI, registerUserAPI, fetchUserProfile } from '../utils/authService';
import type { AppUser, ActiveVision } from '../types/user';

// ─────────────────────────────────────────────────────────────────────────────
// Public constants
export const KARMA_MIN = 0;
export const KARMA_MAX = Number.MAX_SAFE_INTEGER;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const sanitizeDelta = (delta: unknown): number | null => {
  const num = typeof delta === 'number' ? delta : Number(delta);
  return Number.isFinite(num) ? num : null;
};

// Normalize the auth user into an AppUser the UI expects
const toAppUser = (u: AuthUser): AppUser => ({
  ...(u as AuthUser),
  karma: Number((u as any).karma ?? 0) || 0,
  activeVision: (((u as any).activeVision ?? null) as ActiveVision | null) ?? null,
});

// Normalize token from heterogeneous AuthSession shapes
const getSessionToken = (s: AuthSession): string => {
  const t =
    (s as any).token ??
    (s as any).accessToken ??
    (s as any).access_token ??
    (s as any).jwt ??
    (s as any).idToken ??
    (s as any).id_token;

  if (typeof t !== 'string' || !t) throw new Error('Session is missing a token');
  return t;
};

// ─────────────────────────────────────────────────────────────────────────────
// Store types
export interface UserState {
  user: AppUser | null;
  session: AuthSession | null;
  status: AuthStatus; // e.g. 'idle' | 'loading' | 'authenticated' | 'error' | 'signed_out'
  error?: string;

  setUser: (user: AppUser | null) => void;
  setActiveVision: (vision: ActiveVision | null) => void;
  updateUserKarma: (delta: number) => void;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

// RN-safe JSON storage typed to the FULL store (matches your zustand signature)
const storage = createJSONStorage<UserState>(() => AsyncStorage);

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      status: 'idle' as AuthStatus,
      error: undefined,

      setUser: (user) => set({ user }),

      setActiveVision: (vision) => {
        const curr = get().user;
        if (!curr) return;
        set({ user: { ...curr, activeVision: vision ?? null } });
      },

      updateUserKarma: (delta) => {
        const curr = get().user;
        if (!curr) return;
        const sanitized = sanitizeDelta(delta);
        if (sanitized === null) return;
        const next = clamp((curr.karma ?? 0) + sanitized, KARMA_MIN, KARMA_MAX);
        set({ user: { ...curr, karma: next } });
      },

      login: async (credentials) => {
        set({ status: 'loading', error: undefined });
        try {
          const session = await loginUserAPI(credentials);
          const token = getSessionToken(session);
          const profile = await fetchUserProfile(token);
          set({ session, user: toAppUser(profile), status: 'authenticated' });
        } catch (err) {
          set({ status: 'error', error: err instanceof Error ? err.message : 'Login failed' });
        }
      },

      register: async (input) => {
        set({ status: 'loading', error: undefined });
        try {
          const session = await registerUserAPI(input);
          const token = getSessionToken(session);
          const profile = await fetchUserProfile(token);
          set({ session, user: toAppUser(profile), status: 'authenticated' });
        } catch (err) {
          set({ status: 'error', error: err instanceof Error ? err.message : 'Registration failed' });
        }
      },

      logout: () => set({ user: null, session: null, status: 'idle' as AuthStatus }),

      refreshProfile: async () => {
        const session = get().session;
        if (!session) return;
        try {
          const token = getSessionToken(session);
          const profile = await fetchUserProfile(token);
          set({ user: toAppUser(profile) });
        } catch {
          set({
            user: null,
            session: null,
            status: 'error' as AuthStatus,
            error: 'Failed to refresh profile',
          });
        }
      },
    }),
    {
      name: 'user-store',
      storage,  // PersistStorage<UserState, unknown>
      version: 1,
      // No partialize: we persist the whole store; functions won't be serialized
    }
  )
);

export type { AppUser, ActiveVision };
export default useUserStore;
