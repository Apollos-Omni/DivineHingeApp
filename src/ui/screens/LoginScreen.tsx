import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../auth/AuthProvider';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (loading) return;
    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      // ⛔️ Do NOT navigate here.
      // RootNavigator/RootStack will re-render to the Home stack when user becomes truthy.
    } catch (error) {
      Alert.alert('Login Failed', (error as Error).message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Divine Hinge Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        autoComplete="email"
        textContentType="emailAddress"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoComplete="password"
        textContentType="password"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Register link — keep this, it’s fine */}
      {/* Make sure your navigator has a "Register" screen in the auth stack */}
      {/* and you're not attempting to navigate to "Home" here either */}
      <TouchableOpacity onPress={() => {/* navigation handled by Auth stack; optional */}}>
        <Text style={styles.registerText}>Don't have an account? Register here</Text>
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
    marginBottom: 16,
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
  registerText: {
    color: '#7FFF00',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
});
