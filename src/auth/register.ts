import { User } from '../types/auth';

export async function register(email: string, password: string, displayName: string): Promise<User> {
  // TODO: Create user in auth backend & return user object
  return {
    id: 'user-new',
    email,
    displayName,
    roles: ['user'],
  };
}
// Placeholder for register.ts
