import { User } from '../types/auth';

// Simulated login call
export async function login(email: string, password: string): Promise<User> {
  // TODO: Replace with real auth call (Firebase or Supabase)
  if (email === 'apollo@example.com' && password === 'Divine123') {
    return {
      id: 'user-1',
      email,
      displayName: 'Apollos',
      roles: ['admin'],
    };
  }
  throw new Error('Invalid credentials');
}

export async function logout(): Promise<void> {
  // TODO: Implement logout from auth provider
  return;
}

export async function getCurrentUser(): Promise<User | null> {
  // TODO: Check persisted session or token
  return null;
}
// Placeholder for login.ts
