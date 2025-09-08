import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDeviceState } from '../../state/deviceState';
import { useNavigation } from '@react-navigation/native';

export const DevicesScreen: React.FC = () => {
  const nav = useNavigation();
  const { devices, addDevice, renameDevice, toggleLock, lockAll, unlockAll, removeDevice } = useDeviceState();
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    addDevice(name.trim());
    setName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Devices</Text>
      <Text style={styles.subtitle}>Manage your doors with divine precision.</Text>

      <View style={styles.row}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="New door name"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {devices.length > 0 && (
        <View style={styles.row}>
          <TouchableOpacity style={[styles.actionBtn]} onPress={lockAll}>
            <Text style={styles.actionText}>Lock All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#7FFF00' }]} onPress={unlockAll}>
            <Text style={[styles.actionText, { color: '#121212' }]}>Unlock All</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={devices}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSub}>{item.isLocked ? 'Locked' : 'Unlocked'}</Text>
            </View>
            <TouchableOpacity
              style={[styles.smallBtn, { backgroundColor: item.isLocked ? '#7FFF00' : '#444' }]}
              onPress={() => toggleLock(item.id)}
            >
              <Text style={[styles.smallText, { color: item.isLocked ? '#121212' : '#eee' }]}>
                {item.isLocked ? 'Unlock' : 'Lock'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => {
                Alert.prompt('Rename Device', 'Enter a new name', (text) => {
                  if (text) renameDevice(item.id, text);
                });
              }}
            >
              <Text style={styles.smallText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#ff5555' }]} onPress={() => removeDevice(item.id)}>
              <Text style={[styles.smallText, { color: '#121212' }]}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  title: { fontSize: 26, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 14, color: '#cfcfcf', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 8 },
  input: { flex: 1, backgroundColor: '#1b1b1b', color: '#fff', padding: 12, borderRadius: 10 },
  addBtn: { backgroundColor: '#7FFF00', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
  addBtnText: { color: '#121212', fontWeight: '800' },
  card: { backgroundColor: '#1a1624', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },
  cardSub: { color: '#cfc5ff', marginTop: 2 },
  smallBtn: { backgroundColor: '#2a2a2a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  smallText: { color: '#eee', fontWeight: '700' },
  actionBtn: { backgroundColor: '#2a2a2a', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  actionText: { color: '#eee', fontWeight: '800' },
});
