import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../lib/supabaseClient';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleRegister() {
    if (busy) return;
    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Please enter email and password.');
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) throw error;
      Alert.alert('Check your email', 'Confirm your email to finish registration.');
    } catch (e: any) {
      Alert.alert('Sign up failed', e?.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" keyboardType="email-address"
        autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888" secureTextEntry
        value={password} onChangeText={setPassword} />
      <TouchableOpacity style={[styles.button, busy && styles.buttonDisabled]} onPress={handleRegister} disabled={busy}>
        <Text style={styles.buttonText}>{busy ? 'Loading…' : 'Sign Up'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, color: '#7FFF00', fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
  input: { backgroundColor: '#222', color: '#FFF', padding: 14, marginBottom: 16, borderRadius: 8 },
  button: { backgroundColor: '#7FFF00', padding: 16, borderRadius: 8, marginBottom: 16 },
  buttonDisabled: { backgroundColor: '#4B7F00' },
  buttonText: { color: '#121212', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }
});

export default RegisterScreen;
