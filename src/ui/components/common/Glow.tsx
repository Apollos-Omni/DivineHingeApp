import React from "react";
import { View } from "react-native";

export default function Glow({ size = 220, opacity = 0.35, color = "rgba(139,92,246,0.35)" }: { size?: number; opacity?: number; color?: string }) {
  return (
    <View style={{
      position: "absolute", width: size, height: size, borderRadius: size/2, backgroundColor: color, opacity
      // Note: RN ignores blur filter; this helps on web builds though
    }} />
  );
}
