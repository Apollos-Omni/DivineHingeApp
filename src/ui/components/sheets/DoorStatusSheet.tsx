// src/ui/components/doors/DoorStatusSheet.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  Platform,
  AccessibilityInfo,
  StyleSheet,
  LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
  Easing,
  runOnJS,
  interpolate,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import GradientButton from "../../components/common/GradientButton";

type DoorStatus = "locked" | "unlocked" | "ajar";

type Props = {
  visible: boolean;
  onClose: () => void;
  doorId?: string;
  doorName?: string;
  status?: DoorStatus;
  busy?: boolean;
  onLock?: () => void;
  onUnlock?: () => void;
  onToggle?: () => void;
  /** Spoken feedback when actions fire (default true) */
  speakFeedback?: boolean;
};

const colors = {
  bg: "#0b0b0f",
  surface: "#12121a",
  line: "#2c2c40",
  text: "#f1f3f8",
  sub: "#b7bece",
  danger: "#ef4444",
  success: "#22c55e",
  warn: "#f59e0b",
  aura1: "#8b5cf6",
  aura2: "#22d3ee",
};

const SPRING = { damping: 20, stiffness: 220, mass: 0.5 };

export default function DoorStatusSheet({
  visible,
  onClose,
  doorId,
  doorName = "Door",
  status = "locked",
  busy = false,
  onLock,
  onUnlock,
  onToggle,
  speakFeedback = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const [sheetH, setSheetH] = useState(0);
  const reducedMotionRef = useRef(false);

  // --- accessibility: reduce motion ---
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (mounted) reducedMotionRef.current = !!v;
    });
    return () => {
      mounted = false;
    };
  }, []);

  // --- reanimated values ---
  const closedY = useSharedValue(0); // will be set after layout
  const y = useSharedValue(0);
  const backdrop = useSharedValue(0); // 0..1

  // compute colors/labels once
  const { tone, label } = useMemo(() => {
    switch (status) {
      case "locked":
        return { tone: colors.danger, label: "Locked" };
      case "unlocked":
        return { tone: colors.success, label: "Unlocked" };
      default:
        return { tone: colors.warn, label: "Ajar" };
    }
  }, [status]);

  // measure sheet height to know where "closed" sits
  const onSheetLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      if (h && h !== sheetH) {
        setSheetH(h);
        // closed position slightly below the screen bottom for overshoot
        closedY.value = h + insets.bottom + 24;
        // place offscreen if not visible yet
        if (!visible) {
          y.value = closedY.value;
          backdrop.value = 0;
        }
      }
    },
    [sheetH, insets.bottom, visible, closedY, y, backdrop]
  );

  // show/hide transitions
  useEffect(() => {
    if (!sheetH) return;
    const reduce = reducedMotionRef.current;
    const showAnim = () => {
      y.value = reduce ? 0 : withSpring(0, SPRING);
      backdrop.value = withTiming(1, { duration: reduce ? 0 : 180, easing: Easing.out(Easing.quad) });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };
    const hideAnim = () => {
      y.value = reduce ? closedY.value : withTiming(closedY.value, { duration: 220, easing: Easing.inOut(Easing.quad) });
      backdrop.value = withTiming(0, { duration: reduce ? 0 : 160, easing: Easing.out(Easing.quad) });
    };

    if (visible) showAnim();
    else hideAnim();
  }, [visible, sheetH, y, closedY, backdrop]);

  // Android back button closes sheet when open
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  // drag gesture
  const drag = useMemo(
    () =>
      Gesture.Pan()
        .onChange((e) => {
          const next = Math.max(0, Math.min(closedY.value, y.value + e.changeY));
          y.value = next;
          backdrop.value = 1 - next / closedY.value;
        })
        .onEnd(() => {
          const threshold = closedY.value * 0.35;
          if (y.value > threshold) {
            y.value = withTiming(closedY.value, { duration: 200, easing: Easing.out(Easing.cubic) });
            backdrop.value = withTiming(0, { duration: 160 });
            runOnJS(onClose)();
          } else {
            y.value = withSpring(0, SPRING);
            backdrop.value = withTiming(1, { duration: 120 });
          }
        }),
    [y, closedY, backdrop, onClose]
  );

  // animated styles
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  const auraStyle = useAnimatedStyle(() => {
    const opacity = interpolate(backdrop.value, [0, 1], [0, 0.8]);
    return { opacity };
  });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(backdrop.value, [0, 1], [0, 1]),
  }));

  // action helpers (haptics + optional speech)
  const speak = useCallback(
    (text: string) => {
      if (speakFeedback) {
        Speech.stop();
        Speech.speak(text, { pitch: 1.0, rate: Platform.select({ ios: 0.47, android: 0.9, default: 1 }) });
      }
    },
    [speakFeedback]
  );

  const act = useCallback(
    async (kind: "lock" | "unlock" | "toggle") => {
      if (busy) return;
      if (kind === "lock") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        speak("Door locked");
        onLock?.();
      } else if (kind === "unlock") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        speak("Door unlocked");
        onUnlock?.();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        speak("Door toggled");
        onToggle?.();
      }
    },
    [busy, onLock, onUnlock, onToggle, speak]
  );

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose} statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[StyleSheet.absoluteFill, backdropStyle]}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessible accessibilityRole="button" accessibilityLabel="Close door status sheet" />
      </Animated.View>

      {/* Bottom Sheet with drag handle, aura border, safe-area padding */}
      <GestureDetector gesture={drag}>
        <Animated.View
          onLayout={onSheetLayout}
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              paddingBottom: Math.max(insets.bottom, 12),
            },
            sheetStyle,
          ]}
        >
          {/* Aura border */}
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { bottom: -2 }, auraStyle]}>
            <LinearGradient
              colors={[colors.aura1, colors.aura2]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ position: "absolute", left: 12, right: 12, top: -2, bottom: -2, borderRadius: 28, opacity: 0.35 }}
            />
          </Animated.View>

          {/* Content Card */}
          <View
            style={{
              marginHorizontal: 12,
              backgroundColor: colors.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderWidth: 1,
              borderColor: colors.line,
              overflow: "hidden",
            }}
          >
            {/* Handle */}
            <View style={{ alignItems: "center", paddingTop: 8, paddingBottom: 6 }}>
              <View style={{ width: 45, height: 5, borderRadius: 999, backgroundColor: "#3a3a52" }} />
            </View>

            {/* Header */}
            <View style={{ paddingHorizontal: 16, paddingBottom: 10, paddingTop: 2 }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: "800" }}>
                {doorName} {doorId ? `• #${doorId}` : ""}
              </Text>
              <Text style={{ color: colors.sub, marginTop: 4 }}>
                Status: <Text style={{ color: labelColor(tone), fontWeight: "800" }}>{label}</Text>
              </Text>
            </View>

            {/* Body */}
            {busy ? (
              <View style={{ paddingVertical: 18, alignItems: "center" }}>
                <ActivityIndicator color={tone} />
                <Text style={{ color: colors.sub, marginTop: 8 }}>Talking to hinge…</Text>
              </View>
            ) : (
              <View style={{ padding: 16, gap: 10 }}>
                {status !== "locked" && (
                  <GradientButton title="Lock" onPress={() => act("lock")} style={{ opacity: busy ? 0.6 : 1 }} />
                )}
                {status !== "unlocked" && (
                  <GradientButton title="Unlock" onPress={() => act("unlock")} style={{ opacity: busy ? 0.6 : 1 }} />
                )}
                <GradientButton title="Toggle" onPress={() => act("toggle")} />
              </View>
            )}

            {/* Footer */}
            <Pressable onPress={onClose} style={{ alignSelf: "center", marginBottom: 10, padding: 8 }}>
              <Text style={{ color: colors.sub }}>Close</Text>
            </Pressable>
          </View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

function labelColor(base: string) {
  // Slightly brighten label tones for readability
  return base;
}
