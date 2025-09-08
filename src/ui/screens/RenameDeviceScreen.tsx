import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDeviceState } from '../../state/deviceState';

type Params = { id: string; name?: string };

const RenameDeviceScreen: React.FC = () => {
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const { renameDevice } = useDeviceState();

  const { id, name } = ((route && route.params) || {}) as Params;
  const [value, setValue] = useState<string>(name ?? '');

  useEffect(() => {
    if (!id) {
      if (typeof nav.replace === 'function') {
        nav.replace('Devices');
      } else {
        nav.navigate('Devices');
      }
    }
  }, [id, nav]);

  if (!id) return null;

  function onSave() {
    const next = value.trim();
    if (!next) {
      Alert.alert('Name required', 'Please enter a non-empty name.');
      return;
    }
    try {
      renameDevice(id, next);
      if (nav.canGoBack?.()) {
        nav.goBack();
      } else if (typeof nav.replace === 'function') {
        nav.replace('Devices');
      } else {
        nav.navigate('Devices');
      }
    } catch {
      Alert.alert('Rename failed', 'Please try again.');
    }
  }

  function onCancel() {
    if (nav.canGoBack?.()) {
      nav.goBack();
    } else if (typeof nav.replace === 'function') {
      nav.replace('Devices');
    } else {
      nav.navigate('Devices');
    }
  }

  const isDisabled =
    value.trim().length === 0 || value.trim() === (name ?? '').trim();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rename Device</Text>
      <Text style={styles.subtitle}>Give your door a clear, memorable name.</Text>

      <Text style={styles.label}>New name</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="e.g., Front Door"
        placeholderTextColor="#9aa0a6"
        style={styles.input}
        autoFocus
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={onSave}
      />

      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onCancel}>
          <Text style={[styles.btnText, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, isDisabled ? styles.btnDisabled : styles.saveBtn]}
          onPress={onSave}
          disabled={isDisabled}
        >
          <Text style={[styles.btnText, isDisabled ? styles.disabledText : styles.saveText]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#ffffff' },
  subtitle: { fontSize: 14, color: '#cfcfcf', marginTop: 4, marginBottom: 16 },
  label: { fontSize: 12, color: '#b0b0b0', marginBottom: 6 },
  input: {
    backgroundColor: '#1b1b1b',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: { backgroundColor: '#2a2a2a' },
  saveBtn: { backgroundColor: '#7FFF00' },
  btnDisabled: { backgroundColor: '#3a3a3a' },
  btnText: { fontWeight: '800' },
  cancelText: { color: '#eeeeee' },
  saveText: { color: '#121212' },
  disabledText: { color: '#9aa0a6' },
});

export default RenameDeviceScreen;
