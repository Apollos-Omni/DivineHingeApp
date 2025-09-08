import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDeviceState } from '../../state/deviceState';

type Params = { id: string; name: string };

export const RenameDeviceScreen: React.FC = () => {
  const route = useRoute<any>();
  const nav = useNavigation();
  const { renameDevice } = useDeviceState();
  const { id, name } = (route.params || {}) as Params;
  const [value, setValue] = useState(name ?? '');

  // If user lands here without a valid device, kick back to Home
  useEffect(() => {
    if (!id) {
      (nav as any).replace('Home');
    }
  }, [id]);

  if (!id) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rename Device</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Door name"
        placeholderTextColor="#aaa"
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => {
          if (id && value.trim()) {
            renameDevice(id, value.trim());
            nav.goBack();
          }
        }}
        style={styles.saveBtn}
      >
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => nav.goBack()} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  title: { color: '#fff', fontWeight: '900', fontSize: 22, marginBottom: 12 },
  input: { backgroundColor: '#1b1b1b', color: '#fff', padding: 12, borderRadius: 10 },
  saveBtn: { backgroundColor: '#7FFF00', padding: 14, borderRadius: 10, marginTop: 16, alignItems: 'center' },
  saveText: { color: '#121212', fontWeight: '900' },
  cancelBtn: { padding: 12, alignItems: 'center', marginTop: 8 },
  cancelText: { color: '#cfcfcf', fontWeight: '700' },
});
