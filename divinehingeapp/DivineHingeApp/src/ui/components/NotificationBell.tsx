import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  count: number;
  onPress: () => void;
}

export const NotificationBell: React.FC<Props> = ({ count, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Ionicons name="notifications" size={28} color="#fff" />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { padding: 8 },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF3333',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
// Placeholder for NotificationBell.tsx
