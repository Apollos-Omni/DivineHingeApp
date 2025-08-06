import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { register } from '../../auth/register';

export const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    try {
      await register(email.trim(), password, displayName.trim());
      Alert.alert('Success', 'Account created! Please log in.');
      // TODO: Navigate to Login
    } catch (error) {
      Alert.alert('Registration Failed', (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Divine Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        placeholderTextColor="#888"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Register'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: '#7FFF00',
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: '#FFF',
    padding: 14,
    marginBottom: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#7FFF00',
    padding: 16,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#4B7F00',
  },
  buttonText: {
    color: '#121212',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
// Placeholder for RegisterScreen.tsx
