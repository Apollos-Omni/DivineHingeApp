import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface Props {
  isOpen: boolean;
  isLocked: boolean;
}

export const HingeStatus: React.FC<Props> = ({ isOpen, isLocked }) => {
  // For brevity, no animation logic here, but extend with Animated API

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        Door is {isOpen ? "Open" : "Closed"} and{" "}
        {isLocked ? "Locked 🔒" : "Unlocked 🔓"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#222",
    borderRadius: 8,
    marginVertical: 8,
  },
  statusText: {
    color: "#EEE",
    fontWeight: "600",
    fontSize: 16,
  },
});
// Placeholder for HingeStatus.tsx
