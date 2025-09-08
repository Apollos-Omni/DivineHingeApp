import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Switch } from 'react-native';
import { useScheduleState } from '../../state/scheduleState';
import { useRoute } from '@react-navigation/native';
import { useDeviceState } from '../../state/deviceState';
import { BackButton } from '../components/BackButton';
export const SchedulesScreen: React.FC = () => {
  const route = useRoute<any>();
  const { devices } = useDeviceState();
  const { schedules, addDaily, addOnce, toggle, remove } = useScheduleState();
  const [doorId, setDoorId] = useState<string>('');
  const [hhmm, setHHMM] = useState('22:00');
  const [iso, setISO] = useState(new Date().toISOString());
  const [action, setAction] = useState<'lock'|'unlock'>('lock');
  const firstDoor = (route.params as any)?.doorId ?? devices[0]?.id ?? '';
  React.useEffect(()=>{ if(!doorId && firstDoor) setDoorId(firstDoor) },[devices]);
  return (<View style={styles.container}>
    <BackButton /><Text style={styles.title}>Schedules</Text>
    {devices.length===0? (<Text style={{color:'#cfcfcf'}}>Add a device first to schedule locks.</Text>) : (<>
      <Text style={styles.label}>Door ID</Text>
      <TextInput value={doorId} onChangeText={setDoorId} placeholder="door-id" placeholderTextColor="#777" style={styles.input} />
      <Text style={styles.label}>Action</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.pill, action==='lock' && styles.pillOn]} onPress={()=>setAction('lock')}><Text style={styles.pillTxt}>Lock</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.pill, action==='unlock' && styles.pillOn]} onPress={()=>setAction('unlock')}><Text style={styles.pillTxt}>Unlock</Text></TouchableOpacity>
      </View>
      <Text style={styles.label}>Daily time (HH:MM)</Text>
      <TextInput value={hhmm} onChangeText={setHHMM} placeholder="22:00" placeholderTextColor="#777" style={styles.input} />
      <TouchableOpacity style={styles.primary} onPress={()=> addDaily(doorId, action, hhmm)}><Text style={styles.primaryTxt}>Add Daily</Text></TouchableOpacity>
      <Text style={styles.label}>One-time (ISO datetime)</Text>
      <TextInput value={iso} onChangeText={setISO} placeholder="2025-09-02T22:00:00.000Z" placeholderTextColor="#777" style={styles.input} />
      <TouchableOpacity style={styles.secondary} onPress={()=> addOnce(doorId, action, iso)}><Text style={styles.secondaryTxt}>Add One-Time</Text></TouchableOpacity>
    </>)}
    <Text style={[styles.title,{marginTop:20}]}>Existing</Text>
    <FlatList data={schedules} keyExtractor={(i)=>i.id} ItemSeparatorComponent={()=> <View style={{height:10}}/>} renderItem={({item}) => (
      <View style={styles.item}>
        <Text style={styles.iText}>{item.kind.toUpperCase()} • {item.action} • {item.time} • door {item.doorId}</Text>
        <View style={{flexDirection:'row',alignItems:'center',gap:12}}>
          <Switch value={item.enabled} onValueChange={(v)=>toggle(item.id, v)}/>
          <TouchableOpacity onPress={()=>remove(item.id)}><Text style={{color:'#ff7777'}}>Delete</Text></TouchableOpacity>
        </View>
      </View>
    )}/>
  </View>);
};
const styles = StyleSheet.create({ container:{flex:1,backgroundColor:'#121212',padding:16}, title:{color:'#fff',fontWeight:'900',fontSize:22,marginBottom:12}, label:{color:'#cfcfcf',fontWeight:'700',marginTop:8,marginBottom:6}, input:{backgroundColor:'#1b1b1b',color:'#fff',borderRadius:10,padding:12}, row:{flexDirection:'row',gap:8}, pill:{backgroundColor:'#2a2a2a',paddingVertical:8,paddingHorizontal:14,borderRadius:14}, pillOn:{backgroundColor:'#7FFF00'}, pillTxt:{color:'#fff',fontWeight:'800'}, primary:{backgroundColor:'#7FFF00',padding:12,borderRadius:10,marginTop:10,alignItems:'center'}, primaryTxt:{color:'#121212',fontWeight:'900'}, secondary:{backgroundColor:'#2a2a2a',padding:12,borderRadius:10,marginTop:10,alignItems:'center'}, secondaryTxt:{color:'#eee',fontWeight:'900'}, item:{backgroundColor:'#1a1624',borderRadius:12,padding:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}, iText:{color:'#fff',fontWeight:'700'} });
