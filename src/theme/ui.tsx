import React, { createContext, useContext, useMemo } from "react";
import { Text as RNText, TextProps } from "react-native";
import { colors, spacing } from "./tokens";

type Theme = { colors: typeof colors; spacing: typeof spacing };
const Ctx = createContext<Theme>({ colors, spacing });
export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(() => ({ colors, spacing }), []);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

type TVariant = "title" | "subtitle" | "body" | "caption" | "mono";
export function T({ variant="body", style, children, ...p }: TextProps & {variant?: TVariant}) {
  const base = { color: colors.text };
  const map: Record<TVariant, any> = {
    title:    { fontSize: 22, fontWeight: "800", letterSpacing: 0.2 },
    subtitle: { fontSize: 14, color: colors.subtext },
    body:     { fontSize: 16 },
    caption:  { fontSize: 12, color: colors.subtext },
    mono:     { fontFamily: "System", fontVariant: ["tabular-nums"], letterSpacing: 0.2 },
  };
  return <RNText {...p} style={[base, map[variant], style]}>{children}</RNText>;
}
