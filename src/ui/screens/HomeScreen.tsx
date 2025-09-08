import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDeviceState } from '../../state/deviceState';
import { useAuth } from '../../auth/AuthProvider';
import { LinearGradient } from 'expo-linear-gradient';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { devices, lockAll, unlockAll } = useDeviceState();
  const { logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={['#0b0516', '#1f0f3a', '#5723a0']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
        <Text style={styles.brand}>DivineHinge</Text>
        <Text style={styles.brandSub}>Control the threshold. Unlock your destiny.</Text>
        <View style={styles.heroCtas}>
          <TouchableOpacity style={[styles.cta, styles.ctaPrimary]} onPress={() => navigation.navigate('Devices' as never)}>
            <Text style={[styles.ctaText, { color: '#121212' }]}>Add Device</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cta} onPress={() => (devices.some(d => !d.isLocked) ? lockAll() : unlockAll())}>
            <Text style={styles.ctaText}>{devices.some(d => !d.isLocked) ? 'Lock All' : 'Unlock All'}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Status</Text>
        <Text style={styles.panelSub}>
          {devices.length === 0
            ? 'No doors linked yet.'
            : `${devices.length} door${devices.length>1?'s':''} • ${devices.filter(d=>d.isLocked).length} locked / ${devices.filter(d=>!d.isLocked).length} unlocked`}
        </Text>

        <View style={styles.row}>
          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('Devices' as never)}>
            <Text style={styles.tileTitle}>Devices</Text>
            <Text style={styles.tileSub}>Add, rename, manage</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tile} onPress={() => navigation.navigate('Settings' as never)}>
            <Text style={styles.tileTitle}>Settings</Text>
            <Text style={styles.tileSub}>Account & app</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  hero: { paddingTop: 60, paddingBottom: 28, paddingHorizontal: 18, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  brand: { color: '#fff', fontSize: 28, fontWeight: '900' },
  brandSub: { color: '#cfc5ff', marginTop: 6 },
  heroCtas: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cta: { backgroundColor: '#2a2a2a', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
  ctaPrimary: { backgroundColor: '#7FFF00' },
  ctaText: { color: '#eee', fontWeight: '800' },
  panel: { padding: 18 },
  panelTitle: { color: '#fff', fontWeight: '800', fontSize: 18 },
  panelSub: { color: '#cfcfcf', marginTop: 6, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  tile: { flex: 1, backgroundColor: '#1a1624', borderRadius: 14, padding: 14 },
  tileTitle: { color: '#fff', fontWeight: '800' },
  tileSub: { color: '#cfc5ff', marginTop: 4 },
  logoutBtn: { backgroundColor: '#ff5555', padding: 14, borderRadius: 12, marginTop: 20, alignItems: 'center' },
  logoutText: { color: '#121212', fontWeight: '800' }
});
