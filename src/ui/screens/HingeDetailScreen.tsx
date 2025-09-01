import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, FlatList } from 'react-native';
import { useHingeState } from '../../state/hingeState';
import { HingeStatus } from '../components/HingeStatus';

interface DoorLog {
  id: string;
  action: 'open' | 'close';
  status: 'locked' | 'unlocked';
  timestamp: number;
}

interface Props {
  doorId: string;
}

export const HingeDetailScreen: React.FC<Props> = ({ doorId }) => {
  const doors = useHingeState((state) => state.doors);
  const updateDoorStatus = useHingeState((state) => state.updateDoorStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [logs, setLogs] = useState<DoorLog[]>([]);

  useEffect(() => {
    const door = doors.find((d) => d.doorId === doorId);
    if (door) {
      setIsOpen(door.isOpen);
      setIsLocked(door.isLocked);
    }
    // TODO: subscribe to real-time hinge events for this door
  }, [doors, doorId]);

  function toggleOpen(value: boolean) {
    setIsOpen(value);
    updateDoorStatus(doorId, value, isLocked);
    // TODO: Send command to hardware via API
  }

  function toggleLock(value: boolean) {
    setIsLocked(value);
    updateDoorStatus(doorId, isOpen, value);
    // TODO: Send command to hardware via API
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Door {doorId} Control</Text>
      <HingeStatus isOpen={isOpen} isLocked={isLocked} />

      <View style={styles.toggleRow}>
        <Text style={styles.label}>Open</Text>
        <Switch value={isOpen} onValueChange={toggleOpen} />
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.label}>Locked</Text>
        <Switch value={isLocked} onValueChange={toggleLock} />
      </View>

      <Text style={styles.logsTitle}>Recent Activity</Text>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.logItem}>
            [{new Date(item.timestamp).toLocaleTimeString()}] Door was {item.action} and {item.status}
          </Text>
        )}
        ListEmptyComponent={<Text>No recent activity</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#7FFF00', marginBottom: 12 },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: { color: '#EEE', fontSize: 18 },
  logsTitle: { marginTop: 20, fontWeight: 'bold', color: '#CCC', fontSize: 18 },
  logItem: { color: '#AAA', marginBottom: 6, fontFamily: 'monospace' },
});
// Placeholder for HingeDetailScreen.tsx
