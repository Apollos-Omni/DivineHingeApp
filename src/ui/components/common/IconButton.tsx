import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { colors, radii } from "../../../theme/tokens";
import { Text } from "react-native"; // replace with vector icon if you prefer

type Props = { label?: string; onPress?: () => void; style?: ViewStyle };
export default function IconButton({ label = "●", onPress, style }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{
      width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center",
      backgroundColor: pressed ? colors.surfaceAlt : colors.surface, borderWidth: 1, borderColor: colors.line
    }, style]}>
      <Text style={{ color: colors.text, fontWeight: "800" }}>{label}</Text>
    </Pressable>
  );
}
