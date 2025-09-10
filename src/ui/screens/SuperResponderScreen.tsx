import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { callSuperResponder } from '../../services/superResponder';

const SuperResponderScreen: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await callSuperResponder(input.trim());
      setResponse(res);
    } catch (e: any) {
      setResponse({ error: e?.message ?? 'Request failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Super Responder</Text>

      <TextInput
        style={styles.input}
        placeholder="Type a message…"
        placeholderTextColor="#9aa"
        value={input}
        onChangeText={setInput}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSend} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Sending…' : 'Send'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#7FFF00" style={{ marginTop: 16 }} />}

      {response && (
        <View style={styles.response}>
          <Text style={styles.responseTitle}>Response</Text>
          <Text style={styles.responseText}>{JSON.stringify(response, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#121212' },
  title: { color: '#7FFF00', fontSize: 22, fontWeight: '900', marginBottom: 16 },
  input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2a2a2a' },
  button: { marginTop: 12, backgroundColor: '#7FFF00', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#121212', fontWeight: '900' },
  response: { marginTop: 20, backgroundColor: '#1a1624', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  responseTitle: { color: '#fff', fontWeight: '800', marginBottom: 8 },
  responseText: { color: '#cfcfcf', fontFamily: 'monospace' as any, fontSize: 12 },
});

export default SuperResponderScreen;
