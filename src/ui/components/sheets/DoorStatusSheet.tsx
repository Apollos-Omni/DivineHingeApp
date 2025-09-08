import React, { useEffect } from "react";
import { Modal, Pressable, View, Text, ActivityIndicator } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import GradientButton from "../../components/common/GradientButton";

const colors = {
  bg: "#0b0b0f", surface: "#12121a", line: "#2c2c40", text: "#f1f3f8",
  sub: "#b7bece", danger: "#ef4444", success: "#22c55e", warn: "#f59e0b",
};

type DoorStatus = "locked"|"unlocked"|"ajar";
type Props = {
  visible: boolean;
  onClose: () => void;
  doorId: string | undefined;
  doorName?: string;
  status?: DoorStatus;
  busy?: boolean;
  onLock?: () => void;
  onUnlock?: () => void;
  onToggle?: () => void;
};

export default function DoorStatusSheet({
  visible, onClose, doorId, doorName = "Door", status = "locked",
  busy = false, onLock, onUnlock, onToggle
}: Props) {
  const y = useSharedValue(500);
  useEffect(() => {
    y.value = withTiming(visible ? 0 : 500, { duration: 240, easing: Easing.out(Easing.cubic) });
  }, [visible]);
  const s = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  const color = status === "locked" ? colors.danger : status === "unlocked" ? colors.success : colors.warn;
  const label = status === "locked" ? "Locked" : status === "unlocked" ? "Unlocked" : "Ajar";

  const Btn = ({ title, onPress, disabled }: {title:string; onPress?:()=>void; disabled?:boolean}) => (
    <GradientButton title={title} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onPress?.(); }} style={{ opacity: disabled ? 0.6 : 1 }} />
  );

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex:1, backgroundColor:"rgba(0,0,0,0.35)" }} />
      <Animated.View style={[{
        position:"absolute", left:0, right:0, bottom:0, backgroundColor: colors.surface,
        borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, borderTopWidth:1, borderColor: colors.line
      }, s]}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight:"800", marginBottom: 4 }}>{doorName}</Text>
        <Text style={{ color, fontWeight: "800", marginBottom: 12 }}>Status: {label}</Text>

        {busy ? (
          <View style={{ paddingVertical: 16, alignItems: "center" }}>
            <ActivityIndicator color={color} />
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {status !== "locked"   && <Btn title="Lock"   onPress={onLock} />}
            {status !== "unlocked" && <Btn title="Unlock" onPress={onUnlock} />}
            <Btn title="Toggle" onPress={onToggle} />
          </View>
        )}

        <Pressable onPress={onClose} style={{ alignSelf:"center", marginTop: 12 }}>
          <Text style={{ color: colors.sub }}>Close</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}
