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
  name?: string;
  email: string;
  avatarUrl?: string;
  roles: string;
  preferences?: Record<string, any>;
  displayName?: string; // ← add this
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "error";
