import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../auth/AuthProvider';

export const SettingsScreen: React.FC = () => {
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      // TODO: Navigate to Login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 24 },
  title: { fontSize: 28, color: '#7FFF00', fontWeight: 'bold', marginBottom: 24 },
  button: {
    backgroundColor: '#FF3333',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
});
// Placeholder for SettingsScreen.tsx
