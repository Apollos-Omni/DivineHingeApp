import React, { useMemo, useEffect } from "react";
import { Circle, G, Line, Rect } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

type Props = {
  cx: number;
  cy: number;
  angle: number;
  width: number;
  thickness: number;
  status: "locked" | "unlocked" | "ajar";
};

const ARect = Animated.createAnimatedComponent(Rect);
const ACircle = Animated.createAnimatedComponent(Circle);

export default function DoorGlyph({
  cx,
  cy,
  angle,
  width,
  thickness,
  status,
}: Props) {
  const color =
    status === "locked"
      ? "#ef4444"
      : status === "unlocked"
        ? "#22c55e"
        : "#f59e0b";

  // subtle pulse
  const pulse = useSharedValue(0.8);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.0, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [pulse]);

  const glowProps = useAnimatedProps(() => {
    return {
      opacity: pulse.value * 0.4 + 0.2,
      r: width * 1.4 * pulse.value,
    };
  }, [pulse, width]);

  // door body (a small bar)
  const doorProps = useMemo(() => {
    const w = width;
    const t = thickness;
    return { x: cx - w / 2, y: cy - t / 2, width: w, height: t, rx: t / 2 };
  }, [cx, cy, width, thickness]);

  return (
    <G rotation={angle} orgin={`${cx},${cy}`}>
      {/* glow */}
      <ACircle animatedProps={glowProps} cx={cx} cy={cy} fill={color} />
      {/* door bar */}
      <ARect {...doorProps} fill={color} />
      {/* handle (tiny line) */}
      <Line
        x1={cx + width * 0.3}
        y1={cy}
        x2={cx + width * 0.45}
        y2={cy}
        stroke="#fff"
        strokeWidth={1.5}
      />
    </G>
  );
}
