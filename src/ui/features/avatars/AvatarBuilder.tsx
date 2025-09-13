import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { tokens } from "@/theme"; // or "../../theme" if you didn't set "@"
const { colors, spacing, shadows, radii } = tokens;
import GradientButton from "../../../ui/components/common/GradientButton";
import GlassCard from "../../../ui/components/common/GlassCard";

export default function AvatarBuilder() {
  const [name, setName] = useState("Apollos");
  const [color, setColor] = useState("#8b5cf6");

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 22,
          fontWeight: "800",
          marginBottom: spacing.md,
        }}
      >
        Avatar Builder
      </Text>
      <GlassCard>
        <Text style={{ color: colors.subtext, marginBottom: 8 }}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your avatar name"
          placeholderTextColor={colors.subtext}
          style={{
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.line,
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        />
        <Text style={{ color: colors.subtext, marginBottom: 8 }}>Color</Text>
        <TextInput
          value={color}
          onChangeText={setColor}
          placeholder="#8b5cf6"
          placeholderTextColor={colors.subtext}
          style={{
            color: colors.text,
            borderWidth: 1,
            borderColor: colors.line,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
          }}
        />
        <GradientButton
          title="Save"
          onPress={() => {
            /* TODO: persist to profile */
          }}
        />
      </GlassCard>
    </View>
  );
}
