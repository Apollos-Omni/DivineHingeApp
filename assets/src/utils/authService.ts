import { LoginCredentials, RegisterInput, AuthSession, User } from '../types/auth.d';

export async function loginUserAPI(credentials: LoginCredentials): Promise<AuthSession> {
  // Replace with your real API logic
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function registerUserAPI(input: RegisterInput): Promise<AuthSession> {
  const response = await fetch('/api/register', {
    method: 'POST',
    body: JSON.stringify(input),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
}

export async function fetchUserProfile(token: string): Promise<User> {
  const response = await fetch('/api/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}
