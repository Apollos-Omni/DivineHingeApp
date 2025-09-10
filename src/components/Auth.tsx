// DivineHingeApp/src/components/Auth.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as QueryParams from 'expo-auth-session/build/QueryParams';

import { supabase } from '../lib/supabaseClient';

// Required for web OAuth flows; safe to call on native too
WebBrowser.maybeCompleteAuthSession();

// If you configured a custom scheme in app.config.ts (recommended), pass it like:
// const redirectTo = makeRedirectUri({ scheme: 'divinehinge' });
// Otherwise this makes a sensible default for Expo dev:
const redirectTo = makeRedirectUri();

async function createSessionFromUrl(url: string) {
  // Parse tokens returned in the deep link
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);

  const access_token = params['access_token'] as string | undefined;
  const refresh_token = params['refresh_token'] as string | undefined;

  if (!access_token || !refresh_token) return null;

  const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw error;
  return data.session;
}

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [busy, setBusy] = useState(false);

  // Handle deep-link opens (Magic Link / OAuth) while this screen is mounted
  const incomingUrl = Linking.useURL();
  if (incomingUrl) {
    // Fire and forget; App.tsx onAuthStateChange will flip the UI
    createSessionFromUrl(incomingUrl).catch((e) => {
      console.warn('setSession from URL failed:', e?.message ?? e);
    });
  }

  async function onSignUp() {
    if (!email || !password) return Alert.alert('Missing info', 'Enter email and password.');
    setBusy(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: redirectTo }, // user clicks verify link → returns to app
      });
      if (error) throw error;
      Alert.alert('Check your email', 'Confirm your address to finish sign up.');
    } catch (e: any) {
      Alert.alert('Sign up failed', e?.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  async function onSignIn() {
    if (!email || !password) return Alert.alert('Missing info', 'Enter email and password.');
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      // App.tsx listens to onAuthStateChange; it will switch to the app automatically
    } catch (e: any) {
      Alert.alert('Sign in failed', e?.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  async function onSendMagicLink() {
    if (!email) return Alert.alert('Missing email', 'Enter your email first.');
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: redirectTo }, // tapping link deep-links back here
      });
      if (error) throw error;
      Alert.alert('Magic link sent', 'Open your email and tap the link.');
    } catch (e: any) {
      Alert.alert('Magic link failed', e?.message ?? 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  async function onCheckSession() {
    setBusy(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      Alert.alert('Session', session ? `User: ${session.user?.email ?? session.user?.id}` : 'No session');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Unable to read session');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to DivineHinge</Text>
      <Text style={styles.sub}>Sign in or create an account</Text>

      <TextInput
        style={styles.input}
        placeholder="email@example.com"
        placeholderTextColor="#8aa"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="••••••••"
        placeholderTextColor="#8aa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={[styles.btn, styles.primary]} onPress={onSignIn} disabled={busy}>
        <Text style={styles.btnTextDark}>{busy ? 'Working…' : 'Sign In'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={onSignUp} disabled={busy}>
        <Text style={styles.btnText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnGhost} onPress={onSendMagicLink} disabled={busy}>
        <Text style={styles.btnGhostText}>Send Magic Link</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={onCheckSession} disabled={busy}>
        <Text style={styles.btnText}>Check Session</Text>
      </TouchableOpacity>

      {busy && <ActivityIndicator style={{ marginTop: 16 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '900' },
  sub: { color: '#cfc5ff', marginTop: 6, marginBottom: 16 },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginTop: 10,
  },
  btn: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  primary: { backgroundColor: '#7FFF00' },
  secondary: { backgroundColor: '#333' },
  btnText: { color: '#fff', fontWeight: '900' },
  btnTextDark: { color: '#121212', fontWeight: '900' },
  btnGhost: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  btnGhostText: { color: '#cfc5ff', fontWeight: '900' },
});

export default Auth;
