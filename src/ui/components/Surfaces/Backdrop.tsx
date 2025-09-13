import React, { useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function Backdrop() {
  const tilt = useSharedValue(0);

  const s = useAnimatedStyle(() => ({
    transform: [{ translateY: tilt.value }],
  }));

  const startTilt = useCallback(() => {
    tilt.value = withTiming(10, { duration: 1200 });
  }, []);

  useEffect(() => {
    startTilt();
  }, [startTilt]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={["#0b0b0f", "#12121a", "#0b0b0f"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill} // ← replaces { position:'absolute', inset:0 }
      />

      <Animated.View style={[styles.blobPurple, s]} />
      <Animated.View style={[styles.blobBlue, s]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blobPurple: {
    position: "absolute",
    top: -120,
    left: -60,
    width: 360,
    height: 360,
    borderRadius: 999,
    backgroundColor: "rgba(139,92,246,0.18)",
  },
  blobBlue: {
    position: "absolute",
    bottom: -140,
    right: -80,
    width: 420,
    height: 420,
    borderRadius: 999,
    backgroundColor: "rgba(96,165,250,0.12)",
  },
});
