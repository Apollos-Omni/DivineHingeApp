export const colors = {
  bg: "#0b0b0f",
  surface: "#12121a",
  surfaceAlt: "#1b1b26",
  line: "#2c2c40",
  text: "#f1f3f8",
  subtext: "#b7bece",
  primary: "#8b5cf6",
  primaryAlt: "#6d28d9",
  success: "#22c55e",
  warn: "#f59e0b",
  danger: "#ef4444",
  glow: "rgba(139,92,246,0.35)",
};

export const radii = {
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
};

export const spacing = {
  xs: 6, sm: 10, md: 14, lg: 18, xl: 24, '2xl': 32,
};

export const shadows = {
  soft: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  }
};

export const motion = {
  fast: 140,
  base: 220,
  slow: 420,
};
