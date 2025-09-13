import React from "react";
import { View } from "react-native";
import Svg, { Polygon, Circle } from "react-native-svg";
import type { HomeLayout } from "../../../types/home";
import { colors } from "../../../theme/tokens";

export default function Minimap({
  layout,
  px,
  py,
}: {
  layout: HomeLayout;
  px: number;
  py: number;
}) {
  return (
    <View
      style={{
        width: 120,
        height: 120,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.line,
        backgroundColor: colors.surface,
      }}
    >
      <Svg width="100%" height="100%" viewBox="0 0 100 100">
        {layout.rooms.map((r) => (
          <Polygon
            key={r.id}
            points={r.polygon.map((p) => `${p.x * 100},${p.y * 100}`).join(" ")}
            fill="#1b1b26"
            stroke="#2c2c40"
            strokeWidth="1"
          />
        ))}
        <Circle cx={px * 100} cy={py * 100} r="2.8" fill={colors.primary} />
      </Svg>
    </View>
  );
}
