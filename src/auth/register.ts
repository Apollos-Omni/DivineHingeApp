import type { User as AuthUser } from "../types/auth.d";

export async function register(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  // TODO: call your real auth backend (e.g., supabase.auth.signUp)
  const user: AuthUser = {
    id: "user-new",
    email,
    roles: "user",       // string, not string[]
    name: displayName,  // ← satisfy required 'name'
  };

  return user;
}
