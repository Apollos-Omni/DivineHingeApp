import React, { useRef, useState, useCallback } from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from "react-native-reanimated";
import TouchMoveSurface from "../components/TouchMoveSurface";
// import VirtualJoystick from '../components/VirtualJoystick'; // optional

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

type ControlMode = "touch" | "joystick";

export default function GameMode() {
  const [controlMode, setControlMode] = useState<ControlMode>("touch");

  // World
  const worldW = SCREEN_W;
  const worldH = SCREEN_H;

  // Player state
  const px = useSharedValue(worldW * 0.5);
  const py = useSharedValue(worldH * 0.5);
  const vx = useSharedValue(0);
  const vy = useSharedValue(0);

  // Physics tuning
  const MAX_SPEED = 260; // px/sec
  const ACCEL = 420; // px/sec^2
  const FRICTION = 500; // px/sec^2 (when no target)
  const RADIUS = 18;

  // Control inputs
  const targetRef = useRef<{ x: number; y: number; active: boolean }>({
    x: px.value,
    y: py.value,
    active: false,
  });
  const joyRef = useRef({ dx: 0, dy: 0, mag: 0 });

  // TOUCH: update target while finger is down
  const setTarget = useCallback((x: number, y: number) => {
    targetRef.current.x = x;
    targetRef.current.y = y;
    targetRef.current.active = true;
  }, []);
  const endTarget = useCallback(() => {
    // keep moving if we want tap-to-move until near target; or stop immediately by deactivating:
    targetRef.current.active = false;
  }, []);

  // Optional joystick handler
  const onStick = useCallback((dx: number, dy: number, mag: number) => {
    joyRef.current = { dx, dy, mag };
    if (mag > 0.02) {
      // deactivate touch target if user grabs joystick
      targetRef.current.active = false;
    }
  }, []);

  // Game loop
  useFrameCallback((frameInfo) => {
    const dt = Math.min(
      0.032,
      frameInfo.timeSincePreviousFrame != null
        ? frameInfo.timeSincePreviousFrame / 1000
        : 0.016,
    );

    let ax = 0,
      ay = 0;

    if (controlMode === "touch") {
      const { x, y, active } = targetRef.current;
      if (active) {
        // Vector to target
        const dx = x - px.value;
        const dy = y - py.value;
        const dist = Math.hypot(dx, dy);

        // Slow down as we arrive; approach with proportional accel
        if (dist > 2) {
          const nx = dx / dist;
          const ny = dy / dist;
          // scale accel by distance (capped)
          const k = Math.min(1, dist / 200);
          ax = nx * ACCEL * k;
          ay = ny * ACCEL * k;
        } else {
          // close enough
          targetRef.current.active = false;
        }
      }
    } else {
      // joystick mode
      const { dx, dy, mag } = joyRef.current;
      ax = dx * ACCEL * mag;
      ay = dy * ACCEL * mag;
    }

    // apply acceleration
    vx.value += ax * dt;
    vy.value += ay * dt;

    // friction when no active control
    const usingInput =
      controlMode === "touch"
        ? targetRef.current.active
        : joyRef.current.mag > 0.02;
    if (!usingInput) {
      const s = Math.hypot(vx.value, vy.value);
      if (s > 0) {
        const decel = Math.min(FRICTION * dt, s);
        vx.value *= (s - decel) / s;
        vy.value *= (s - decel) / s;
      }
    }

    // clamp speed
    const speed = Math.hypot(vx.value, vy.value);
    if (speed > MAX_SPEED) {
      const f = MAX_SPEED / speed;
      vx.value *= f;
      vy.value *= f;
    }

    // integrate
    px.value += vx.value * dt;
    py.value += vy.value * dt;

    // bounds
    if (px.value < RADIUS) {
      px.value = RADIUS;
      vx.value = -vx.value * 0.2;
    }
    if (px.value > worldW - RADIUS) {
      px.value = worldW - RADIUS;
      vx.value = -vx.value * 0.2;
    }
    if (py.value < RADIUS + 40) {
      py.value = RADIUS + 40;
      vy.value = -vy.value * 0.2;
    }
    if (py.value > worldH - RADIUS - 100) {
      py.value = worldH - RADIUS - 100;
      vy.value = -vy.value * 0.2;
    }
  });

  const playerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: px.value - RADIUS },
      { translateY: py.value - RADIUS },
    ],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0b0f" }}>
      {/* Header */}
      <View
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          right: 16,
          zIndex: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
          Game Mode
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable onPress={() => setControlMode("touch")}>
            <Text
              style={{
                color: controlMode === "touch" ? "#8b5cf6" : "#b7bece",
                fontWeight: "700",
              }}
            >
              Touch
            </Text>
          </Pressable>
          {/* Toggle kept for flexibility; remove if you don't want joystick at all
          <Pressable onPress={() => setControlMode('joystick')}>
            <Text style={{ color: controlMode === 'joystick' ? '#8b5cf6' : '#b7bece', fontWeight: '700' }}>Joystick</Text>
          </Pressable> */}
        </View>
      </View>

      {/* World + Controls */}
      {controlMode === "touch" ? (
        <TouchMoveSurface onTarget={setTarget} onEnd={endTarget}>
          {/* Player */}
          <Animated.View
            style={[
              {
                position: "absolute",
                width: RADIUS * 2,
                height: RADIUS * 2,
                borderRadius: RADIUS,
                backgroundColor: "#8b5cf6",
                shadowColor: "#8b5cf6",
                shadowOpacity: 0.6,
                shadowRadius: 16,
              },
              playerStyle,
            ]}
          />
        </TouchMoveSurface>
      ) : (
        <>
          {/* Player */}
          <Animated.View
            style={[
              {
                position: "absolute",
                width: RADIUS * 2,
                height: RADIUS * 2,
                borderRadius: RADIUS,
                backgroundColor: "#8b5cf6",
              },
              playerStyle,
            ]}
          />
          {/* <View style={{ position: 'absolute', left: 16, bottom: 16 }}>
            <VirtualJoystick onChange={onStick} />
          </View> */}
        </>
      )}
    </View>
  );
}
