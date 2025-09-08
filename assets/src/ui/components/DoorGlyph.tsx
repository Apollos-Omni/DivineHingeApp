import React from "react";
import { Circle, G, Line, Rect } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedProps, withRepeat, withTiming, Easing } from "react-native-reanimated";

type Props = {
  cx: number; cy: number; angle: number; width: number; thickness: number;
  status: "locked" | "unlocked" | "ajar";
};

const ARect = Animated.createAnimatedComponent(Rect);
const ACircle = Animated.createAnimatedComponent(Circle);

export default function DoorGlyph({ cx, cy, angle, width, thickness, status }: Props) {
  const color = status === "locked" ? "#ef4444" : status === "unlocked" ? "#22c55e" : "#f59e0b";
  const pulse = useSharedValue(0.8);
  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1.0, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const glowProps = useAnimatedProps(() => ({
    opacity: pulse.value * 0.4 + 0.2,
    r: (width * 1.4) * pulse.value,
  }));
  const doorProps = { x: cx - width/2, y: cy - thickness/2, width, height: thickness, rx: thickness/2 };

  return (
    <G rotation={angle} origin={`${cx},${cy}`}>
      <ACircle animatedProps={glowProps} cx={cx} cy={cy} fill={color} opacity={0.4} />
      <ARect {...doorProps} fill={color} />
      <Line x1={cx + width*0.3} y1={cy} x2={cx + width*0.45} y2={cy} stroke="#fff" strokeWidth={1.5} />
    </G>
  );
}
