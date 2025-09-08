export interface AuthSession {
  userId: string;
  token: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  preferences?: Record<string, any>;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

