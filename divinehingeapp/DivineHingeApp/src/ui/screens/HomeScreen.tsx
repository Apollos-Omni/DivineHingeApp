import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useHingeState } from '../../state/hingeState';
import { HingeStatus } from '../components/HingeStatus';
import { useAvatarState } from '../../state/avatarState';
import { AvatarBadge } from '../components/AvatarBadge';

export const HomeScreen: React.FC = () => {
  const doors = useHingeState((state) => state.doors);
  const avatar = useAvatarState((state) => state.avatar);

  useEffect(() => {
    // TODO: subscribe to real-time hinge updates via WebSocket or MQTT
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome Home</Text>

      {avatar && (
        <AvatarBadge
          avatarUrl="" // Hook to avatar image URI
          karmaLevel={avatar.karma}
          displayName="Apollos"
        />
      )}

      <Text style={styles.subtitle}>Doors Status</Text>
      {doors.length === 0 && <Text>No doors tracked yet.</Text>}

      {doors.map((door) => (
        <HingeStatus
          key={door.doorId}
          isOpen={door.isOpen}
          isLocked={door.isLocked}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#121212', minHeight: '100%' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#7FFF00', marginBottom: 16 },
  subtitle: { fontSize: 20, fontWeight: '600', color: '#CCC', marginVertical: 12 },
});
// Placeholder for HomeScreen.tsx
