import { useAuth } from "./AuthProvider";

export function useUser() {
  const { user } = useAuth();
  return user;
}

export function useIsAdmin() {
  const { user } = useAuth();
  return user?.roles.includes("admin") ?? false;
}
// Placeholder for hooks.ts
