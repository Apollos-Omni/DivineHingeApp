// src/utils/validators.ts
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidUsername = (username: string): boolean =>
  /^[a-zA-Z0-9_]{3,20}$/.test(username);

export const isValidPassword = (password: string): boolean =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

export const isNonEmptyString = (value: string): boolean =>
  typeof value === "string" && value.trim().length > 0;
// Placeholder for validators.ts
