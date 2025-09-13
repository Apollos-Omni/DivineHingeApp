import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { tokens } from "@/theme"; // or "../../theme" if you didn't set "@"
const { colors, shadows, radii } = tokens;

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export default function GradientButton({
  title,
  onPress,
  style,
  disabled,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}
    >
      <LinearGradient
        colors={[colors.primaryAlt, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: radii["2xl"],
            alignItems: "center",
          },
          shadows.glow,
        ]}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "800" }}>
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
