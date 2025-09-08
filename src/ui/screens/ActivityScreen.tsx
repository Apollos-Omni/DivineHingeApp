import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useActivityState } from '../../state/activityState';
import { BackButton } from '../components/BackButton';
function fmt(ts:number){ return new Date(ts).toLocaleString(); }
export const ActivityScreen: React.FC = () => { const { feed } = useActivityState(); return (
  <View style={styles.container}>
    <BackButton /><Text style={styles.title}>Activity</Text>
    <FlatList data={feed} keyExtractor={(i)=>i.id} ItemSeparatorComponent={()=> <View style={{height:10}}/>}
      renderItem={({item}) => (<View style={styles.card}><Text style={styles.line}><Text style={styles.badge}>{item.type.toUpperCase()}</Text> • {fmt(item.ts)}</Text>{item.doorId ? <Text style={styles.sub}>Door: {item.doorId}</Text> : null}{item.note ? <Text style={styles.sub}>{item.note}</Text> : null}</View>)}
    />
  </View>
)};
const styles = StyleSheet.create({ container:{flex:1,backgroundColor:'#121212',padding:16}, title:{color:'#fff',fontWeight:'900',fontSize:22,marginBottom:12}, card:{backgroundColor:'#1a1624',borderRadius:12,padding:12}, line:{color:'#fff',fontWeight:'700'}, badge:{color:'#7FFF00'}, sub:{color:'#cfcfcf'} });
