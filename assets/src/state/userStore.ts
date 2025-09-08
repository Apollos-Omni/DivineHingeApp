import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthSession, User, AuthStatus, LoginCredentials, RegisterInput } from '../types/auth.d';
import { loginUserAPI, registerUserAPI, fetchUserProfile } from '../utils/authService';

interface UserState {
  user: User | null;
  session: AuthSession | null;
  status: AuthStatus;
  error?: string;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      status: 'idle',
      error: undefined,

      login: async (credentials: LoginCredentials) => {
        set({ status: 'loading', error: undefined });
        try {
          const session = await loginUserAPI(credentials);
          const profile = await fetchUserProfile(session.token);
          set({ session, user: profile, status: 'authenticated' });
        } catch (err: any) {
          set({ status: 'error', error: err.message || 'Login failed' });
        }
      },

      register: async (input: RegisterInput) => {
        set({ status: 'loading', error: undefined });
        try {
          const session = await registerUserAPI(input);
          const profile = await fetchUserProfile(session.token);
          set({ session, user: profile, status: 'authenticated' });
        } catch (err: any) {
          set({ status: 'error', error: err.message || 'Registration failed' });
        }
      },

      logout: () => {
        set({ user: null, session: null, status: 'idle' });
      },

      refreshProfile: async () => {
        const session = get().session;
        if (!session) return;
        try {
          const profile = await fetchUserProfile(session.token);
          set({ user: profile });
        } catch {
          set({ user: null, session: null, status: 'error' });
        }
      },
    }),
    {
      name: 'user-storage', // persists to AsyncStorage or localStorage
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        status: state.status,
      }),
    }
  )
);
