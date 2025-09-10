import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Alert, ScrollView } from 'react-native';
import { getProfile, updateProfile } from '../../services/functions';

type Profile = {
  id?: string;
  username?: string;
  website?: string;
  avatar_url?: string;
  [k: string]: any;
};

const SettingsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await getProfile();
      if (error) throw error;
      // Expecting your Edge Function to return something like { profile: {...} } or just {...}
      const p: Profile = (data?.profile ?? data ?? null) as any;
      setProfile(p);
      setUsername(p?.username ?? '');
      setWebsite(p?.website ?? '');
      setAvatarUrl(p?.avatar_url ?? '');
    } catch (e: any) {
      Alert.alert('Load failed', e?.message ?? 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      const { data, error } = await updateProfile({ username: username.trim(), website: website.trim(), avatar_url: avatarUrl.trim() });
      if (error) throw error;
      Alert.alert('Saved', 'Profile updated via Edge Function');
      // optional: refresh
      await load();
    } catch (e: any) {
      Alert.alert('Save failed', e?.message ?? 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#7FFF00" />
        <Text style={{ color: '#cfcfcf', marginTop: 10 }}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.sub}>Backed by your Supabase Edge Function</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Apollos"
          placeholderTextColor="#8a8a8a"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Website</Text>
        <TextInput
          style={styles.input}
          placeholder="https://ourworld.example"
          placeholderTextColor="#8a8a8a"
          value={website}
          onChangeText={setWebsite}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Avatar URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://…"
          placeholderTextColor="#8a8a8a"
          value={avatarUrl}
          onChangeText={setAvatarUrl}
          autoCapitalize="none"
        />

        <TouchableOpacity style={[styles.btn, saving && styles.btnDisabled]} onPress={save} disabled={saving}>
          <Text style={styles.btnText}>{saving ? 'Saving…' : 'Save Profile'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={[styles.label, { marginBottom: 8 }]}>Raw Profile (debug)</Text>
        <Text style={styles.json}>{JSON.stringify(profile, null, 2)}</Text>
      </View>

      <TouchableOpacity style={[styles.btn, { backgroundColor: '#333' }]} onPress={load}>
        <Text style={[styles.btnText, { color: '#fff' }]}>Reload</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#121212', padding: 16, flexGrow: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '900' },
  sub: { color: '#cfc5ff', marginTop: 6, marginBottom: 16 },
  card: { backgroundColor: '#1a1624', borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#2a2a2a' },
  label: { color: '#cfcfcf', fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: '#1e1e1e', color: '#fff', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  btn: { backgroundColor: '#7FFF00', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#121212', fontWeight: '900' },
  json: { color: '#cfcfcf', fontFamily: 'monospace' as any, fontSize: 12 },
});

export default SettingsScreen;
