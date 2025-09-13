import React from "react";
import { View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";
export default function GlassCard({ style, children, ...rest }: ViewProps) {
  return (
    <View
      style={[
        {
          borderRadius: 20,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#2c2c40",
        },
        style,
      ]}
      {...rest}
    >
      <BlurView
        intensity={18}
        tint="dark"
        style={{ padding: 16, backgroundColor: "rgba(12,12,18,0.35)" }}
      >
        {children}
      </BlurView>
    </View>
  );
}
