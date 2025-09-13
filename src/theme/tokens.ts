// src/theme/tokens.ts

// ── Types
export type Colors = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  line: string;

  text: string;
  textSub: string; // preferred
  subtext: string; // alias (kept for older code)

  primary: string;
  primaryAlt: string;

  success: string;
  warn: string;
  danger: string;

  glow: string; // rgba ok
};

export type Radii = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
};

export type Spacing = {
  xs: number; sm: number; md: number; lg: number; xl: number; '2xl': number;
};

export type Shadows = {
  soft: {
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
    elevation: number;
  };
  glow: {
    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: { width: number; height: number };
    elevation: number;
  };
};

export type Motion = {
  fast: number;
  base: number;
  slow: number;
};

// ── Values (single source of truth)
const baseColors: Colors = {
  bg: '#0b0b0f',
  surface: '#12121a',
  surfaceAlt: '#1b1b26',
  line: '#2c2c40',

  text: '#f1f3f8',
  textSub: '#b7bece',
  subtext: '#b7bece',  // alias for legacy usages

  primary: '#8b5cf6',
  primaryAlt: '#6d28d9',

  success: '#22c55e',
  warn: '#f59e0b',
  danger: '#ef4444',

  glow: 'rgba(139,92,246,0.35)',
};

const radius: Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
};

const spacing: Spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 32,
};

const shadows: Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  glow: {
    shadowColor: baseColors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
};

const motion: Motion = {
  fast: 140,
  base: 220,
  slow: 420,
};

// ── Exports
export const color = baseColors;          // singular
export const colors = baseColors;         // plural alias (so tokens.colors.* works)
export const radii: Radii = radius;
export const tokens = {
  color,
  colors: color, // alias preserved
  radii,
  radius,
  spacing,
  shadows,
  motion,
} as const;

export type Tokens = typeof tokens;
export default tokens;
