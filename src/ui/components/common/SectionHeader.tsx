import React from "react";
import { View, Text } from "react-native";
import { tokens } from "@/theme"; // or "../../theme" if you didn't set "@"
const { colors, spacing } = tokens;

export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ marginBottom: spacing.sm }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}>
        {title}
      </Text>
      {!!subtitle && (
        <Text style={{ color: colors.subtext, marginTop: 2 }}>{subtitle}</Text>
      )}
    </View>
  );
}
