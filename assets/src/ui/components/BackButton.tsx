import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export const BackButton: React.FC<{ label?: string }> = ({ label='Back' }) => { const nav = useNavigation(); return (
  <TouchableOpacity onPress={()=>nav.goBack()} style={styles.btn}><Text style={styles.txt}>← {label}</Text></TouchableOpacity>
)};
const styles = StyleSheet.create({ btn:{ paddingVertical:8, paddingHorizontal:12, alignSelf:'flex-start' }, txt:{ color:'#cfcfcf', fontWeight:'700', fontSize:16 } });
