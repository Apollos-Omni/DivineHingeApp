// src/theme/index.ts
import { useColorScheme } from 'react-native';
import { Colors as Palette, type Mode } from './colors';

// Quick hook for light/dark palette from ./colors
export const useThemeColors = () => {
  const scheme = (useColorScheme() ?? 'light') as Mode;
  return Palette[scheme];
};

// Re-export ALL token values & types (spacing, radii, shadows, motion, colors, etc.)
export * from './tokens';
export { default as tokens } from './tokens';

// Avoid name clashes: give ./colors distinct names when re-exported via the barrel
export { Colors as Palette } from './colors';
export type { Mode, Colors as PaletteColors } from './colors';

// If you want distinct names for token types too:
export type { Tokens, Colors as TokenColors, Radii, Spacing, Shadows, Motion } from './tokens';

// Typography (if present)
export * from './typography';
