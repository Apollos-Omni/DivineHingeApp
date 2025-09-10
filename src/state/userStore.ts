import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthSession, User as AuthUser, AuthStatus, LoginCredentials, RegisterInput } from '../types/auth.d';
import { loginUserAPI, registerUserAPI, fetchUserProfile } from '../utils/authService';
import type { AppUser, ActiveVision } from '../types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistOptions, PersistStorage } from 'zustand/middleware';
type Persisted = Pick<UserState, 'user' | 'session' | 'status' | 'error'>;

// Constants for karma limits
// Expose constants
export const KARMA_MIN = 0;
export const KARMA_MAX = Number.MAX_SAFE_INTEGER;

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const sanitizeDelta = (delta: unknown): number | null => {
const num = typeof delta === 'number' ? delta : Number(delta);
if (!Number.isFinite(num) || Number.isNaN(num)) return null;
return num;
};

// Normalize the auth user into an AppUser the UI expects.
const AppUser = (u: AuthUser): AppUser => ({
...(u as AuthUser),
karma: Number((u as any).karma ?? 0) || 0, // why: UI relies on numeric karma
activeVision: (((u as any).activeVision ?? null) as ActiveVision | null) ?? null,
});

// Normalize token from heterogeneous AuthSession shapes
const getSessionToken = (s: AuthSession): string => {
const t = (s as any).token
?? (s as any).accessToken
?? (s as any).access_token
?? (s as any).jwt
?? (s as any).idToken
?? (s as any).id_token;
if (typeof t !== 'string' || t.length === 0) {
throw new Error('Session is missing a token');
}
return t;
};

interface UserState {
  user: AppUser | null;
  session: AuthSession | null;
  status: AuthStatus;
  error?: string;
  setUser: (user: AppUser | null) => void;
  setActiveVision: (vision: ActiveVision | null) => void;
  updateUserKarma: (delta: number) => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const initialState: Pick<UserState, 'user' | 'session' | 'status' | 'error'> = {
user: null,
session: null,
status: 'idle' as AuthStatus,
error: undefined,
};

// Safe storage for web/SSR; for native swap to expo-secure-store storage.
const storage = createJSONStorage<UserState>(() => {
try {
return localStorage;
} catch {
// SSR fallback shim
return {
getItem: () => null,
setItem: () => void 0,
removeItem: () => void 0,
clear: () => void 0,
key: () => null,
length: 0,
} as unknown as Storage;
}
});

export const useUserStore = create<UserState>()(
  persist<UserState>( 
    (set, get) => ({
      user: null,
      session: null,
      status: 'signed_out' as AuthStatus,
      error: undefined,
      
      setUser: (user) => set({ user }),


setActiveVision: (vision: any) => {
const curr = get().user;
if (!curr) return;
set({ user: { ...curr, activeVision: vision ?? null } });
},


updateUserKarma: (delta: any) => {
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
set({ session, user: AppUser(profile), status: 'authenticated' });
} catch (err) {
const msg = err instanceof Error ? err.message : 'Login failed';
set({ status: 'error', error: msg });
}
},

register: async (input) => {
set({ status: 'loading', error: undefined });
try {
const session = await registerUserAPI(input);
const token = getSessionToken(session);
const profile = await fetchUserProfile(token);
set({ session, user: AppUser(profile), status: 'authenticated' });
} catch (err) {
const msg = err instanceof Error ? err.message : 'Registration failed';
set({ status: 'error', error: msg });
}
},

      logout: () => {
        set({ user: null, session: null, status: 'idle' });
      },

refreshProfile: async () => {
const session = get().session;
if (!session) return;
try {
const token = getSessionToken(session);
const profile = await fetchUserProfile(token);
set({ user: AppUser(profile) });
} catch {
set({ ...initialState, status: 'error' });
}
},
    }),
    
// 2) Annotate persist with TWO generics: <FullState, PersistedState>
const persistOptions: PersistOptions<UserState, Partial<UserState>> = {
  name: 'user-store',
  storage,
  // Return exactly the Partial<UserState> you want to persist
  partialize: (state): Partial<UserState> => ({
    user: state.user,
    session: state.session,
    status: state.status,
    error: state.error,
  }),
  version: 1,
}  as PersistOptions<UserState, Persisted>;

    persistOptions
  

export type { UserState };

export default useUserStore;
