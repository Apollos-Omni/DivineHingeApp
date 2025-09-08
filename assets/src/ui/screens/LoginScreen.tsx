import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../../auth/AuthProvider';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('apollo@example.com');
  const [password, setPassword] = useState('Divine123');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    try { setErr(null); setLoading(true); await login(email, password); }
    catch (e: any) { setErr(e?.message || 'Login failed'); }
    finally { setLoading(false); }
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0b0b0b' }}>
      <Text style={{ color:'#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>Welcome</Text>
      <TextInput placeholder="Email" placeholderTextColor="#9ca3af" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail}
        style={{ color:'#fff', borderColor:'#374151', borderWidth:1, borderRadius:8, paddingHorizontal:12, height:44, marginBottom:12 }} />
      <TextInput placeholder="Password" placeholderTextColor="#9ca3af" secureTextEntry value={password} onChangeText={setPassword}
        style={{ color:'#fff', borderColor:'#374151', borderWidth:1, borderRadius:8, paddingHorizontal:12, height:44, marginBottom:12 }} />
      {err ? <Text style={{ color:'#f87171', marginBottom:12 }}>{err}</Text> : null}
      <TouchableOpacity onPress={onSubmit} disabled={loading} style={{ backgroundColor:'#22c55e', borderRadius:8, height:44, alignItems:'center', justifyContent:'center' }}>
        <Text style={{ color:'#0b0b0b', fontWeight:'bold' }}>{loading ? 'Signing in…' : 'Sign In'}</Text>
      </TouchableOpacity>
    </View>
  );
}


