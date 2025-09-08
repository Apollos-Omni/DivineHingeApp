// src/utils/constants.ts
export const DEFAULT_AVATAR = '/assets/default-avatar.png';

export const VISION_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export const USER_ROLES = {
  CITIZEN: 'citizen',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  ARCHITECT: 'architect',
} as const;

export const TRUST_TIERS = ['bronze', 'silver', 'gold', 'platinum'] as const;

export const SUPPORTED_COUNTRIES = [
  'United States',
  'Canada',
  'Mexico',
  'Brazil',
  'Germany',
  'India',
  'Nigeria',
  'Japan',
  'South Korea',
  'United Kingdom',
];
// Placeholder for constants.ts
