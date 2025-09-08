import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDeviceState } from '../../state/deviceState';
import { useActivityState } from '../../state/activityState';

type Params = { doorId: string };

export const DoorHubScreen: React.FC = () => {
  const { params } = useRoute<any>();
  const navigation = useNavigation();
  const { devices, toggleLock } = useDeviceState();
  const { add } = useActivityState();
  const doorId = (params as Params)?.doorId;
  const door = devices.find(d => d.id === doorId);

  if (!door) {
    return <View style={styles.container}><Text style={styles.title}>Door not found</Text></View>;
  }

  const onToggle = () => {
    toggleLock(door.id);
    add({ type: door.isLocked ? 'unlock':'lock', doorId: door.id, ts: Date.now(), note: `${door.isLocked ? 'Unlock' : 'Lock'} via Hub` });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{door.name}</Text>
      <Text style={styles.sub}>{door.isLocked ? 'Currently Locked' : 'Currently Unlocked'}</Text>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.cta, door.isLocked ? styles.ctaPrimary : styles.cta]} onPress={onToggle}>
          <Text style={[styles.ctaText, door.isLocked ? { color:'#121212'} : {}]}>{door.isLocked ? 'Unlock' : 'Lock'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cta} onPress={()=>navigation.navigate('Schedules' as never, { doorId } as never)}>
          <Text style={styles.ctaText}>Schedules</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.tile} onPress={()=>navigation.navigate('RecordingSettings' as never)}>
          <Text style={styles.tileTitle}>Recording</Text>
          <Text style={styles.tileSub}>Clip length & motion</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tile} onPress={()=>navigation.navigate('Activity' as never)}>
          <Text style={styles.tileTitle}>Activity</Text>
          <Text style={styles.tileSub}>Recent events</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.tile} onPress={()=>navigation.navigate('Devices' as never)}>
          <Text style={styles.tileTitle}>Rename/Remove</Text>
          <Text style={styles.tileSub}>Manage this door</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#121212', padding:16 },
  title:{ color:'#fff', fontWeight:'900', fontSize:24, marginTop:8 },
  sub:{ color:'#cfc5ff', marginTop:6, marginBottom:14 },
  row:{ flexDirection:'row', gap:12, marginTop:10 },
  cta:{ backgroundColor:'#2a2a2a', paddingVertical:12, paddingHorizontal:16, borderRadius:12 },
  ctaPrimary:{ backgroundColor:'#7FFF00' },
  ctaText:{ color:'#eee', fontWeight:'800' },
  tile:{ flex:1, backgroundColor:'#1a1624', borderRadius:14, padding:14 },
  tileTitle:{ color:'#fff', fontWeight:'800' },
  tileSub:{ color:'#cfc5ff', marginTop:4 }
});
