export const colors = {
  bg: '#0b0b0b', text: '#ffffff', primary: '#8b5cf6', accent: '#22c55e',
  danger: '#ef4444', warning: '#f59e0b', muted: '#9ca3af', card: '#111827', border: '#374151',
};
export const radii = { sm: 8, md: 12, lg: 16, xl: 24 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 };
export const shadows = { card: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8 } };
export const tokens = { colors, radii, spacing, shadows };
export type Tokens = typeof tokens;


