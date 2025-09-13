export type Mode = "light" | "dark";

export const Colors = {
  light: {
    bg: "#FFFFFF",
    surface: "#F9FAFB",
    text: "#0B0B0E",
    subtleText: "#4B5563",
    primary: "#6E44FF",
    primaryOn: "#FFFFFF",
    border: "#E5E7EB",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#06B6D4",
  },
  dark: {
    bg: "#0F0F12",
    surface: "#111827",
    text: "#FFFFFF",
    subtleText: "#9CA3AF",
    primary: "#9A82FF",
    primaryOn: "#0B0B0E",
    border: "#1F2937",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#06B6D4",
  },
} as const;
