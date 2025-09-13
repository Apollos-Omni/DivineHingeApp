import React from "react";
import { View } from "react-native";
import Animated, {
  useDerivedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { colors } from "../../../theme/tokens";

export default function Character({
  x,
  y,
  r,
}: {
  x: number;
  y: number;
  r: number;
}) {
  // x,y are already pixels (from HousePlan2D). r is radius in px.
  const prev = React.useRef({ x, y });
  const angle = useDerivedValue(() => {
    const dx = x - prev.current.x,
      dy = y - prev.current.y;
    prev.current = { x, y };
    if (Math.abs(dx) + Math.abs(dy) < 0.001) return 0;
    return Math.atan2(dy, dx); // radians
  }, [x, y]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x - r },
      { translateY: y - r },
      { rotate: `${angle.value}rad` },
    ],
  }));

  return (
    <>
      {/* faint trailing dot */}
      <View
        style={{
          position: "absolute",
          left: x - r / 2,
          top: y - r / 2,
          width: r,
          height: r,
          borderRadius: 999,
          backgroundColor: "rgba(139,92,246,0.12)",
        }}
      />
      <Animated.View
        style={[
          {
            position: "absolute",
            width: r * 2,
            height: r * 2,
            borderRadius: 999,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        ]}
      >
        {/* direction chevron */}
        <View
          style={{
            width: r * 1.2,
            height: 2,
            backgroundColor: "#fff",
            borderRadius: 1,
            transform: [{ translateX: r * 0.6 }],
          }}
        />
      </Animated.View>
    </>
  );
}
