import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useSettingsState } from '../../state/settingsState';
import { BackButton } from '../components/BackButton';
export const RecordingSettingsScreen: React.FC = () => {
  const { recordingLengthSec, motionTimestampsEnabled, setRecordingLength, setMotionEnabled } = useSettingsState();
  const [value, setValue] = useState(String(recordingLengthSec));
  const save = () => { const n = parseInt(value,10); if(!isNaN(n)) setRecordingLength(n) };
  return (<View style={styles.container}>
    <BackButton /><Text style={styles.title}>Recording Settings</Text>
    <Text style={styles.label}>Clip length (seconds)</Text>
    <TextInput value={value} onChangeText={setValue} keyboardType="number-pad" style={styles.input} placeholder="10" placeholderTextColor="#777"/>
    <TouchableOpacity style={styles.saveBtn} onPress={save}><Text style={styles.saveTxt}>Save</Text></TouchableOpacity>
    <View style={{height:24}}/>
    <View style={styles.row}><Text style={styles.label}>Motion timestamps</Text><Switch value={motionTimestampsEnabled} onValueChange={setMotionEnabled}/></View>
    <Text style={styles.help}>Each motion event is recorded with a timestamp in Activity.</Text>
  </View>);
};
const styles = StyleSheet.create({ container:{flex:1,backgroundColor:'#121212',padding:16}, title:{color:'#fff',fontWeight:'900',fontSize:22,marginBottom:12}, label:{color:'#cfcfcf',fontWeight:'700',marginBottom:6}, input:{backgroundColor:'#1b1b1b',color:'#fff',borderRadius:10,padding:12}, saveBtn:{backgroundColor:'#7FFF00',padding:12,borderRadius:10,marginTop:10,alignItems:'center'}, saveTxt:{color:'#121212',fontWeight:'900'}, row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}, help:{color:'#888',marginTop:6} });
