import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useDeviceState } from '../../state/deviceState';

export const DevicesScreen: React.FC = () => {
  const { devices, addDevice, renameDevice, toggleLock, lockAll, unlockAll, removeDevice } = useDeviceState();

  const [name, setName] = useState('');
  const [renameState, setRenameState] = useState<{ id: string | null; value: string }>({
    id: null,
    value: '',
  });

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addDevice(trimmed);
    setName('');
  };

  const openRename = (id: string, currentName: string) => {
    setRenameState({ id, value: currentName });
  };

  const closeRename = () => {
    setRenameState({ id: null, value: '' });
  };

  const saveRename = () => {
    const id = renameState.id;
    const next = renameState.value.trim();
    if (!id || !next) return;
    renameDevice(id, next);
    closeRename();
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
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {devices.length > 0 && (
        <View style={styles.row}>
          <TouchableOpacity style={styles.actionBtn} onPress={lockAll}>
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
              onPress={() => openRename(item.id, item.name)}
            >
              <Text style={styles.smallText}>Rename</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.smallBtn, { backgroundColor: '#ff5555' }]}
              onPress={() => removeDevice(item.id)}
            >
              <Text style={[styles.smallText, { color: '#121212' }]}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Rename Modal (cross-platform) */}
      <Modal
        transparent
        animationType="fade"
        visible={!!renameState.id}
        onRequestClose={closeRename}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rename Device</Text>
            <Text style={styles.modalSub}>Enter a new name for this door.</Text>

            <TextInput
              value={renameState.value}
              onChangeText={(t) => setRenameState((s) => ({ ...s, value: t }))}
              placeholder="e.g., Front Door"
              placeholderTextColor="#9aa0a6"
              style={styles.modalInput}
              autoFocus
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={saveRename}
            />

            <View style={styles.modalRow}>
              <Pressable style={[styles.modalBtn, styles.modalCancel]} onPress={closeRename}>
                <Text style={[styles.modalBtnText, styles.modalCancelText]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalBtn,
                  renameState.value.trim() ? styles.modalSave : styles.modalDisabled,
                ]}
                onPress={saveRename}
                disabled={!renameState.value.trim()}
              >
                <Text
                  style={[
                    styles.modalBtnText,
                    renameState.value.trim() ? styles.modalSaveText : styles.modalDisabledText,
                  ]}
                >
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#1b1b1b',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: { color: '#fff', fontWeight: '800', fontSize: 18 },
  modalSub: { color: '#cfcfcf', marginTop: 4, marginBottom: 12 },
  modalInput: {
    backgroundColor: '#121212',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  modalRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancel: { backgroundColor: '#2a2a2a' },
  modalSave: { backgroundColor: '#7FFF00' },
  modalDisabled: { backgroundColor: '#3a3a3a' },
  modalBtnText: { fontWeight: '800' },
  modalCancelText: { color: '#eee' },
  modalSaveText: { color: '#121212' },
  modalDisabledText: { color: '#9aa0a6' },
});

export default DevicesScreen;
