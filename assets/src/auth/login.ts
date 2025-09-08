import { User } from '../types/auth.d';

// Initial hardcoded user
const users: User[] = [
  { id: 'user-1', email: 'apollo@example.com', displayName: 'Apollos', roles: ['admin'] },
];

// Store currently logged-in user (simulation)
let currentUser: User | null = null;

/**
 * Login function
 */
export async function login(email: string, password: string): Promise<User> {
  // Find user by email
  const foundUser = users.find(u => u.email === email.trim());

  if (foundUser) {
    // For simulation, accept any password for registered users
    currentUser = foundUser;
    return foundUser;
  }

  throw new Error('Invalid credentials');
}

/**
 * Register a new user
 */
export async function register(email: string, password: string, displayName: string): Promise<User> {
  // Check if email is already registered
  if (users.find(u => u.email === email.trim())) {
    throw new Error('Email already registered');
  }

  const newUser: User = {
    id: `user-${users.length + 1}`,
    email: email.trim(),
    displayName,
    roles: ['user'],
  };

  users.push(newUser);
  currentUser = newUser; // Automatically log in new user
  return newUser;
}

/**
 * Logout function
 */
export async function logout(): Promise<void> {
  currentUser = null;
}

/**
 * Get the currently logged-in user
 */
export async function getCurrentUser(): Promise<User | null> {
  return currentUser;
}
