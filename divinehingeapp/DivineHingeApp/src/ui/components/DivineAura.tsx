import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  intensity?: number; // 0 to 1, default 0.5
}

export const DivineAura: React.FC<Props> = ({ intensity = 0.5 }) => {
  return <View style={[styles.aura, { opacity: intensity }]} />;
};

const styles = StyleSheet.create({
  aura: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#7FFF00',
    shadowColor: '#7FFF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    zIndex: -1,
  },
});
// Placeholder for DivineAura.tsx
